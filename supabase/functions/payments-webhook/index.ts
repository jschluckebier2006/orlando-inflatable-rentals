import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const env = (url.searchParams.get("env") === "live" ? "live" : "sandbox") as StripeEnv;
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: any;
  try {
    const stripe = createStripeClient(env);
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, getWebhookSecret(env));
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Only act on session completion / payment success for our booking flow
  const isCheckoutCompleted = event.type === "checkout.session.completed";
  const isAsyncSuccess = event.type === "checkout.session.async_payment_succeeded";
  if (!isCheckoutCompleted && !isAsyncSuccess) {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object;
  if (session.metadata?.kind !== "booking") {
    return new Response("not a booking session", { status: 200 });
  }
  if (session.payment_status !== "paid") {
    return new Response("not paid", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Idempotency: if we already created a booking for this session, exit
  const { data: existing } = await supabase
    .from("bookings").select("id").eq("stripe_session_id", session.id).maybeSingle();
  if (existing) return new Response("already processed", { status: 200 });

  const { data: pending, error: pendErr } = await supabase
    .from("pending_bookings").select("*").eq("stripe_session_id", session.id).maybeSingle();
  if (pendErr || !pending) {
    console.error("pending_bookings lookup failed", pendErr);
    return new Response("pending not found", { status: 200 });
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

  const SERVER_MULT: Record<string, number> = { "7hour": 1.0, overnight: 1.25, weekend: 1.6 };
  const multiplier = SERVER_MULT[p.duration_type];

  const amountCharged = Number(pending.amount_charged);
  const total = Number(pending.amount_total);
  const balance = Math.max(0, Math.round((total - amountCharged) * 100) / 100);
  const paymentStatus = balance === 0 ? "paid_in_full" : "deposit_paid";

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
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
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      total_amount: total,
      deposit_amount: Number(pending.deposit_amount),
      amount_paid: amountCharged,
      balance_due: balance,
      payment_status: paymentStatus,
    })
    .select("id")
    .single();

  if (bookingErr || !booking) {
    console.error("Insert booking failed", bookingErr);
    return new Response("could not insert booking", { status: 500 });
  }

  const itemRows = p.items.map((i: any) => ({
    booking_id: booking.id,
    product_id: i.product_id,
    product_name: i.product_name,
    product_price: i.product_price,
    unit_price: Math.round(i.product_price * multiplier * 100) / 100,
  }));
  const { error: itemsErr } = await supabase.from("booking_items").insert(itemRows);
  if (itemsErr) {
    // If trigger detects a conflict, we'd hit it here. We don't want to leave money taken with no booking.
    console.error("Insert booking_items failed", itemsErr);
    await supabase.from("bookings").delete().eq("id", booking.id);
    return new Response("conflict on items", { status: 500 });
  }

  // Cleanup
  await supabase.from("pending_bookings").delete().eq("stripe_session_id", session.id);

  // Fire confirmation + admin alert emails (best-effort, never blocks).
  try {
    await supabase.functions.invoke("send-booking-emails", { body: { booking_id: booking.id } });
  } catch (e) {
    console.error("send-booking-emails invoke failed", e);
  }

  return new Response("ok", { status: 200 });
});
