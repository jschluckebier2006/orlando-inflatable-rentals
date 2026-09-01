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
import { computeBreakdown, DEPOSIT_NET, DEPOSIT_CHARGE } from "./pricing.ts";

export type FinalizeStatus =
  | "created"
  | "already_exists"
  | "not_paid"
  | "not_a_booking"
  | "no_pending"
  | "needs_review"
  | "error";

export interface FinalizeResult {
  status: FinalizeStatus;
  booking_id?: string;
  message?: string;
}

interface MinimalSession {
  id: string;
  payment_status?: string;
  payment_intent?: string | { id?: string; payment_method?: string | { id?: string } | null } | null;
  customer?: string | { id?: string } | null;
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
  const subtotal = Math.round(p.items.reduce((s: number, i: any) => s + Number(i.product_price), 0) * multiplier * 100) / 100;
  const waiverSelected = p.damage_waiver !== false;
  const deliveryFee = Math.max(0, Math.round(Number(p.delivery_fee ?? 0) * 100) / 100);
  const deliveryZoneCity = p.delivery_zone_city ?? null;
  const paymentChoice: "card_on_file" | "cash_on_delivery" =
    p.payment_choice === "cash_on_delivery" ? "cash_on_delivery" : "card_on_file";
  const bd = computeBreakdown(
    subtotal,
    waiverSelected,
    deliveryFee,
    {
      taxRate: settings.taxRate,
      waiverRate: settings.damageWaiverRate,
      checkoutFeeRate: settings.onlineCheckoutFeeRate,
    },
    paymentChoice,
  );
  const damage_waiver_amount = bd.damageWaiver;
  const tax_amount = bd.tax;
  const checkout_fee_amount = bd.checkoutFee;
  const total = bd.total;
  const amountCharged = DEPOSIT_CHARGE;
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
    stripe_customer_id:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? p.stripe_customer_id ?? null,
    stripe_payment_method_id:
      typeof session.payment_intent === "object" && session.payment_intent
        ? (typeof session.payment_intent.payment_method === "string"
            ? session.payment_intent.payment_method
            : session.payment_intent.payment_method?.id ?? null)
        : null,
    payment_method_choice: paymentChoice,
    checkout_fee_amount,
    total_amount: total,
    deposit_amount: DEPOSIT_NET,
    amount_paid: amountCharged,
    balance_due: balance,
    payment_status: paymentStatus,
    subtotal,
    damage_waiver_selected: waiverSelected,
    damage_waiver_amount,
    tax_rate: settings.taxRate,
    tax_amount,
    delivery_fee: deliveryFee,
    delivery_zone_city: deliveryZoneCity,
  };

  const itemRows = p.items.map((i: any) => ({
    product_id: i.product_id,
    product_name: i.product_name,
    product_price: i.product_price,
    unit_price: Math.round(i.product_price * multiplier * 100) / 100,
  }));

  // ---- Pre-insert validation: fail fast with a clear reason instead of a
  // trigger-driven 500 deep inside the transaction. ----
  const validationError = validatePayload(insertPayload, itemRows);
  if (validationError) {
    console.error("[finalizeBooking] validation failed", validationError);
    return await parkForReview(supabase, session, insertPayload, validationError);
  }

  // ---- Atomic create: booking + items in ONE database transaction. ----
  // If the items insert fails (blackout, double-booking, bad range), the whole
  // transaction rolls back — there is no half-built booking and, critically,
  // no compensating delete of a booking the customer already paid for.
  const { data: newId, error: createErr } = await supabase.rpc("create_booking_with_items", {
    p_booking: insertPayload,
    p_items: itemRows,
  });

  if (createErr) {
    // A unique violation means another path (webhook vs. status poll) already
    // finalized this session or PaymentIntent. That's success, not failure.
    if ((createErr as any).code === "23505") {
      const { data: existing } = await supabase
        .from("bookings").select("id")
        .or(
          `stripe_session_id.eq.${session.id}` +
          (insertPayload.stripe_payment_intent_id
            ? `,stripe_payment_intent_id.eq.${insertPayload.stripe_payment_intent_id}`
            : ""),
        )
        .maybeSingle();
      if (existing?.id) {
        await supabase.from("pending_bookings").delete().eq("stripe_session_id", session.id);
        return { status: "already_exists", booking_id: existing.id };
      }
    }
    console.error("[finalizeBooking] atomic create failed", createErr);
    // The money is already taken. Never drop it on the floor — park the booking
    // for human review with the exact Postgres message attached.
    return await parkForReview(supabase, session, insertPayload, createErr.message);
  }

  const bookingId = newId as unknown as string;
  if (!bookingId) {
    return await parkForReview(
      supabase, session, insertPayload,
      "create_booking_with_items returned no id",
    );
  }

  // Cleanup pending. Only after the booking is durably committed.
  await supabase.from("pending_bookings").delete().eq("stripe_session_id", session.id);


  // Record the Stripe checkout deposit as a booking_payments row so the
  // recompute trigger sees the full picture. Without this row, the first
  // admin balance charge causes the trigger to overwrite amount_paid with
  // just the admin-charge sum, leaving a phantom DEPOSIT_CHARGE balance.
  if (amountCharged > 0 && insertPayload.stripe_payment_intent_id) {
    const { error: depErr } = await supabase.from("booking_payments").insert({
      booking_id: bookingId,
      method: "stripe_deposit",
      amount: amountCharged,
      reference: insertPayload.stripe_payment_intent_id,
      notes: "Stripe Checkout deposit (auto-recorded by finalizeBooking).",
      recorded_by: "system",
    });
    if (depErr) {
      console.error("[finalizeBooking] deposit payment insert failed", depErr);
    }
  }

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

// ---------------------------------------------------------------------------
// Validation — range-check everything the database constrains, before insert.
// ---------------------------------------------------------------------------
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validatePayload(b: Record<string, any>, items: any[]): string | null {
  if (!DATE_RE.test(String(b.event_date ?? ""))) {
    return `Invalid event_date: ${b.event_date}`;
  }
  if (!DATE_RE.test(String(b.event_end_date ?? ""))) {
    return `Invalid event_end_date: ${b.event_end_date}`;
  }
  if (b.event_end_date < b.event_date) {
    return `Inverted date range: event_end_date ${b.event_end_date} is before event_date ${b.event_date}`;
  }
  if (!Array.isArray(items) || items.length === 0) {
    return "Booking has no rental items";
  }
  if (items.length > 20) {
    return `Too many items on one booking (${items.length})`;
  }
  for (const i of items) {
    if (!i.product_id || !i.product_name) return "Item is missing product_id or product_name";
    const price = Number(i.product_price);
    if (!Number.isFinite(price) || price < 0) return `Invalid price on item ${i.product_name}`;
  }
  for (const f of ["customer_name", "customer_email", "customer_phone", "event_address_line", "event_city", "event_zip"]) {
    if (!b[f]) return `Missing required field: ${f}`;
  }
  if (!Number.isFinite(Number(b.total_amount)) || Number(b.total_amount) < 0) {
    return `Invalid total_amount: ${b.total_amount}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// parkForReview — the money is already captured, so we never discard the order.
// Persist a booking flagged needs_review with the raw failure text, record the
// deposit against it, and alert an admin loudly.
// ---------------------------------------------------------------------------
async function parkForReview(
  supabase: SupabaseClient,
  session: MinimalSession,
  insertPayload: Record<string, any>,
  errorMessage: string,
): Promise<FinalizeResult> {
  // Clamp anything that would trip a CHECK constraint so the review row itself
  // can always be written. The original values live on in finalize_error.
  const safe: Record<string, any> = { ...insertPayload };
  if (!DATE_RE.test(String(safe.event_date ?? ""))) {
    safe.event_date = new Date().toISOString().slice(0, 10);
  }
  if (!DATE_RE.test(String(safe.event_end_date ?? "")) || safe.event_end_date < safe.event_date) {
    safe.event_end_date = safe.event_date;
  }
  safe.customer_name ||= "UNKNOWN — needs review";
  safe.customer_email ||= "unknown@needs-review.local";
  safe.customer_phone ||= "unknown";
  safe.event_address_line ||= "UNKNOWN — needs review";
  safe.event_city ||= "UNKNOWN";
  safe.event_zip ||= "00000";
  // Park as pending (not confirmed) so it never looks like a live, dispatchable job.
  safe.status = "pending";
  safe.needs_review = true;
  safe.needs_review_at = new Date().toISOString();
  safe.finalize_error =
    `${errorMessage}\n\noriginal event_date=${insertPayload.event_date} ` +
    `event_end_date=${insertPayload.event_end_date} session=${session.id}`;

  const { data, error } = await supabase.from("bookings").insert(safe).select("id").maybeSingle();

  if (error) {
    // Someone else already created it — that's fine.
    if ((error as any).code === "23505") {
      const { data: existing } = await supabase
        .from("bookings").select("id").eq("stripe_session_id", session.id).maybeSingle();
      if (existing?.id) return { status: "already_exists", booking_id: existing.id };
    }
    console.error("[finalizeBooking] parkForReview insert failed", error);
    // Deliberately keep the pending_bookings row: it is now the only copy.
    return { status: "error", message: `${errorMessage} (and needs_review persist failed: ${error.message})` };
  }

  const bookingId = data?.id as string | undefined;
  console.error("[finalizeBooking] parked booking for review", bookingId, errorMessage);

  // Record the captured deposit so the balance is right when a human fixes it.
  if (bookingId && Number(safe.amount_paid) > 0 && safe.stripe_payment_intent_id) {
    await supabase.from("booking_payments").insert({
      booking_id: bookingId,
      method: "stripe_deposit",
      amount: safe.amount_paid,
      reference: safe.stripe_payment_intent_id,
      notes: "Stripe Checkout deposit (booking parked for review).",
      recorded_by: "system",
    });
  }

  // Keep the pending_bookings row so the original cart survives for the rebuild.
  await notifyAdminNeedsReview(supabase, bookingId ?? "(unknown)", session.id, errorMessage, safe);

  return { status: "needs_review", booking_id: bookingId, message: errorMessage };
}

async function notifyAdminNeedsReview(
  supabase: SupabaseClient,
  bookingId: string,
  sessionId: string,
  errorMessage: string,
  snapshot: Record<string, any>,
): Promise<void> {
  try {
    await supabase.functions.invoke("send-booking-emails", {
      body: {
        needs_review: {
          booking_id: bookingId,
          session_id: sessionId,
          error: errorMessage,
          snapshot,
        },
      },
    });
  } catch (e) {
    console.error("[finalizeBooking] needs_review alert failed", e);
  }
}