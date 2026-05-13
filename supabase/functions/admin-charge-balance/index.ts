// Admin one-click off-session capture for card-on-file bookings.
// Charges the saved PaymentMethod for the remaining balance, records a
// booking_payments row (status updates roll up via trigger), and emails
// the customer a balance-paid confirmation.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import { sendEmail, balancePaidCustomerEmail, type BookingForEmail } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    // ----- Admin auth -----
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "unauthorized" }, 401);
    const sbAuth = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData } = await sbAuth.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: "unauthorized" }, 401);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: roleRow } = await sb.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) return json({ error: "forbidden" }, 403);

    // ----- Input -----
    const { booking_id } = await req.json().catch(() => ({}));
    if (!booking_id || typeof booking_id !== "string") return json({ error: "booking_id required" }, 400);

    // ----- Load booking -----
    const { data: booking, error: bErr } = await sb
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .maybeSingle();
    if (bErr) return json({ error: bErr.message }, 500);
    if (!booking) return json({ error: "booking not found" }, 404);

    if (booking.payment_status === "paid_in_full") {
      return json({ error: "Booking already paid in full." }, 409);
    }
    const balance = Number(booking.balance_due ?? 0);
    if (!(balance > 0)) return json({ error: "No balance due." }, 409);
    if (!booking.stripe_customer_id || !booking.stripe_payment_method_id) {
      return json({ error: "No saved card on file for this booking." }, 409);
    }

    // ----- Stripe off-session charge -----
    const env: StripeEnv = String(booking.stripe_session_id ?? "").startsWith("cs_live_") ? "live" : "sandbox";
    const stripe = createStripeClient(env);
    const amountCents = Math.round(balance * 100);

    let pi;
    try {
      pi = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "usd",
        customer: booking.stripe_customer_id,
        payment_method: booking.stripe_payment_method_id,
        off_session: true,
        confirm: true,
        description: `Balance for booking ${String(booking.id).slice(0, 8).toUpperCase()}`,
        metadata: {
          kind: "booking_balance",
          booking_id: booking.id,
        },
      });
    } catch (err: any) {
      // Stripe surfaces SCA / 3DS as a card_error with payment_intent attached.
      const reqPi = err?.raw?.payment_intent ?? err?.payment_intent;
      if (reqPi?.client_secret) {
        return json({
          error: "authentication_required",
          message: "This card requires customer authentication (3DS). Please charge from the Stripe dashboard or contact the customer.",
          payment_intent_id: reqPi.id,
          client_secret: reqPi.client_secret,
        }, 402);
      }
      console.error("[admin-charge-balance] stripe error", err?.message ?? err);
      return json({ error: err?.message ?? "Stripe charge failed" }, 502);
    }

    if (pi.status !== "succeeded") {
      return json({
        error: `Charge not completed: status=${pi.status}`,
        payment_intent_id: pi.id,
      }, 502);
    }

    // ----- Record payment (trigger updates booking totals + status) -----
    const amountPaid = pi.amount_received / 100;
    const { error: payErr } = await sb.from("booking_payments").insert({
      booking_id: booking.id,
      method: "card_external",
      amount: amountPaid,
      reference: pi.id,
      notes: `Off-session capture by ${user.email ?? "admin"} via admin-charge-balance.`,
      recorded_by: user.email ?? null,
    });
    if (payErr) {
      console.error("[admin-charge-balance] payment insert failed", payErr);
      return json({
        error: "Charge succeeded but failed to record payment row.",
        payment_intent_id: pi.id,
        details: payErr.message,
      }, 500);
    }

    // ----- Email customer (best-effort) -----
    try {
      const b: BookingForEmail = {
        ...booking,
        amount_paid: Number(booking.amount_paid ?? 0) + amountPaid,
        balance_due: 0,
      } as BookingForEmail;
      const rendered = await balancePaidCustomerEmail(b, amountPaid);
      if (rendered.enabled && booking.customer_email) {
        await sendEmail({
          to: booking.customer_email,
          subject: rendered.subject,
          html: rendered.html,
          from: "bookings",
          idempotencyKey: `balance_paid_customer:${booking.id}:${pi.id}`,
          templateName: "balance_paid_customer",
          relatedBookingId: booking.id,
        });
      }
    } catch (e) {
      console.error("[admin-charge-balance] email failed", e);
    }

    return json({
      ok: true,
      payment_intent_id: pi.id,
      amount_charged: amountPaid,
    });
  } catch (err: any) {
    console.error("[admin-charge-balance] uncaught", err);
    return json({ error: err?.message ?? String(err) }, 500);
  }
});