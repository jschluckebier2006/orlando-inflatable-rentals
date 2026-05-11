// Shared finalize helper: turns a paid Stripe Checkout Session + its
// pending_bookings row into a real booking + booking_items, cleans up the
// pending row, and fires confirmation emails.
//
// Used by both payments-webhook (primary path) and check-booking-status
// (inline fallback when Stripe webhook hasn't landed yet).
//
// Pure: does NO Stripe I/O. Caller passes an already-retrieved Session.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { loadSettings } from "./settings.ts";

export type FinalizeStatus =
  | "created"
  | "already_exists"
  | "not_paid"
  | "not_a_booking"
  | "no_pending"
  | "error";

export interface FinalizeResult {
  status: FinalizeStatus;
  booking_id?: string;
  message?: string;
}

interface MinimalSession {
  id: string;
  payment_status?: string;
  payment_intent?: string | { id?: string } | null;
  metadata?: Record<string, string> | null;
}

const SERVER_MULT: Record<string, number> = { "7hour": 1.0, overnight: 1.25, weekend: 1.6 };

export async function finalizeBookingFromSession(
  supabase: SupabaseClient,
  session: MinimalSession,
): Promise<FinalizeResult> {
  if (session.metadata?.kind !== "booking") {
    return { status: "not_a_booking" };
  }
  if (session.payment_status !== "paid") {
    return { status: "not_paid", message: session.payment_status ?? "unknown" };
  }

  // Look up pending payload
  const { data: pending, error: pendErr } = await supabase
    .from("pending_bookings").select("*").eq("stripe_session_id", session.id).maybeSingle();
  if (pendErr) {
    console.error("[finalizeBooking] pending lookup error", pendErr);
    return { status: "error", message: pendErr.message };
  }
  if (!pending) {
    // Either already processed (and cleaned up) or stale session.
    // Caller should re-check bookings table to disambiguate.
    const { data: existing } = await supabase
      .from("bookings").select("id").eq("stripe_session_id", session.id).maybeSingle();
    if (existing?.id) return { status: "already_exists", booking_id: existing.id };
    return { status: "no_pending" };
  }

  const p = pending.payload;

  // Recompute end date / time defaults exactly like create-booking-checkout would have
  const startDate = new Date(p.event_date + "T00:00:00Z");
  const endDate = new Date(startDate);
  if (p.duration_type !== "7hour") endDate.setUTCDate(endDate.getUTCDate() + 1);
  const endDateStr = endDate.toISOString().slice(0, 10);
  let event_start_time = p.event_start_time;
  let event_end_time = p.event_end_time;
  if (p.duration_type === "overnight") event_end_time = "08:00";
  if (p.duration_type === "weekend") { event_start_time = "08:00"; event_end_time = "20:00"; }

  const multiplier = SERVER_MULT[p.duration_type];
  const settings = await loadSettings(supabase);
  const TAX_RATE = settings.taxRate;
  const WAIVER_RATE = settings.damageWaiverRate;
  const subtotal = Math.round(p.items.reduce((s: number, i: any) => s + Number(i.product_price), 0) * multiplier * 100) / 100;
  const waiverSelected = p.damage_waiver !== false;
  const damage_waiver_amount = waiverSelected ? Math.round(subtotal * WAIVER_RATE * 100) / 100 : 0;
  const deliveryFee = Math.max(0, Math.round(Number(p.delivery_fee ?? 0) * 100) / 100);
  const deliveryZoneCity = p.delivery_zone_city ?? null;
  const tax_amount = Math.round((subtotal + damage_waiver_amount + deliveryFee) * TAX_RATE * 100) / 100;

  const amountCharged = Number(pending.amount_charged);
  const total = Number(pending.amount_total);
  const balance = Math.max(0, Math.round((total - amountCharged) * 100) / 100);
  const paymentStatus = balance === 0 ? "paid_in_full" : "deposit_paid";

  // Race-safe insert. The partial unique index
  // bookings_stripe_session_id_uniq (stripe_session_id) WHERE stripe_session_id IS NOT NULL
  // makes a concurrent winner show up as a 23505 we catch and turn into "already_exists".
  const insertPayload = {
    duration_type: p.duration_type,
    event_date: p.event_date,
    event_end_date: endDateStr,
    price_multiplier: multiplier,
    event_start_time,
    event_end_time,
    event_type: p.event_type ?? null,
    customer_name: p.customer_name,
    customer_email: p.customer_email,
    customer_phone: p.customer_phone,
    event_address_line: p.event_address_line,
    event_city: p.event_city,
    event_zip: p.event_zip,
    notes: p.notes ?? null,
    status: "confirmed",
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    total_amount: total,
    deposit_amount: Number(pending.deposit_amount),
    amount_paid: amountCharged,
    balance_due: balance,
    payment_status: paymentStatus,
    subtotal,
    damage_waiver_selected: waiverSelected,
    damage_waiver_amount,
    tax_rate: TAX_RATE,
    tax_amount,
    delivery_fee: deliveryFee,
    delivery_zone_city: deliveryZoneCity,
  };

  // Plain insert. The partial unique index
  // bookings_stripe_session_id_uniq (stripe_session_id) WHERE stripe_session_id IS NOT NULL
  // can't be referenced by ON CONFLICT (Postgres requires a non-partial constraint),
  // so we rely on catching 23505 below.
  const insertRes = await supabase
    .from("bookings")
    .insert(insertPayload)
    .select("id");

  if (insertRes.error) {
    // Treat unique-violation as already-processed by other path.
    const code = (insertRes.error as any).code;
    if (code === "23505") {
      const { data: existing } = await supabase
        .from("bookings").select("id").eq("stripe_session_id", session.id).maybeSingle();
      if (existing?.id) return { status: "already_exists", booking_id: existing.id };
    }
    console.error("[finalizeBooking] insert booking failed", insertRes.error);
    return { status: "error", message: insertRes.error.message };
  }

  // ignoreDuplicates returns an empty array when the row already existed.
  let bookingId = insertRes.data?.[0]?.id as string | undefined;
  if (!bookingId) {
    const { data: existing } = await supabase
      .from("bookings").select("id").eq("stripe_session_id", session.id).maybeSingle();
    if (existing?.id) {
      // Best-effort cleanup if the other path didn't get there yet.
      await supabase.from("pending_bookings").delete().eq("stripe_session_id", session.id);
      return { status: "already_exists", booking_id: existing.id };
    }
    return { status: "error", message: "insert returned no row and no existing booking" };
  }

  // Items
  const itemRows = p.items.map((i: any) => ({
    booking_id: bookingId!,
    product_id: i.product_id,
    product_name: i.product_name,
    product_price: i.product_price,
    unit_price: Math.round(i.product_price * multiplier * 100) / 100,
  }));
  const { error: itemsErr } = await supabase.from("booking_items").insert(itemRows);
  if (itemsErr) {
    console.error("[finalizeBooking] insert booking_items failed", itemsErr);
    await supabase.from("bookings").delete().eq("id", bookingId);
    return { status: "error", message: itemsErr.message };
  }

  // Cleanup pending
  await supabase.from("pending_bookings").delete().eq("stripe_session_id", session.id);

  // Fire emails best-effort. send-booking-emails dedupes via email_send_log
  // idempotency_key = "booking_confirm_customer:<booking_id>" / "booking_new_admin:<booking_id>",
  // so a webhook + fallback race never double-sends.
  try {
    await supabase.functions.invoke("send-booking-emails", { body: { booking_id: bookingId } });
  } catch (e) {
    console.error("[finalizeBooking] send-booking-emails invoke failed", e);
  }

  return { status: "created", booking_id: bookingId };
}