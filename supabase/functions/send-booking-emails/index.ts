import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  sendEmail,
  customerConfirmationEmail,
  adminNewBookingEmail,
  ADMIN_EMAILS,
  type BookingForEmail,
  type BookingItemForEmail,
} from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // ---- needs_review alert: a paid checkout that could not be finalized ----
    if (body?.needs_review) {
      const nr = body.needs_review;
      const esc = (s: unknown) =>
        String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
      const snap = nr.snapshot ?? {};
      const html = `
<h2 style="color:#c0392b;margin:0 0 12px;">Paid checkout needs review</h2>
<p>A customer completed payment but the booking could not be created automatically.
The booking has been saved and flagged <strong>needs review</strong> — the payment is recorded, nothing was deleted.</p>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px;">
<tr><td><strong>Booking ID</strong></td><td>${esc(nr.booking_id)}</td></tr>
<tr><td><strong>Stripe session</strong></td><td>${esc(nr.session_id)}</td></tr>
<tr><td><strong>PaymentIntent</strong></td><td>${esc(snap.stripe_payment_intent_id)}</td></tr>
<tr><td><strong>Customer</strong></td><td>${esc(snap.customer_name)} — ${esc(snap.customer_email)} — ${esc(snap.customer_phone)}</td></tr>
<tr><td><strong>Event date</strong></td><td>${esc(snap.event_date)} → ${esc(snap.event_end_date)}</td></tr>
<tr><td><strong>Address</strong></td><td>${esc(snap.event_address_line)}, ${esc(snap.event_city)} ${esc(snap.event_zip)}</td></tr>
<tr><td><strong>Total</strong></td><td>$${esc(snap.total_amount)}</td></tr>
</table>
<p style="margin-top:16px;"><strong>Error</strong></p>
<pre style="background:#f4f6fa;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:13px;">${esc(nr.error)}</pre>
<p><a href="https://orlandoinflatables.com/admin/bookings?review=1">Open the review queue in admin</a></p>`;
      await sendEmail({
        to: ADMIN_EMAILS,
        subject: `🚨 Paid checkout needs review — ${snap.customer_name ?? "unknown"} (${snap.event_date ?? "?"})`,
        html,
        from: "alerts",
        templateName: "booking_needs_review_admin",
        idempotencyKey: `needs_review:${nr.session_id}`,
        relatedBookingId: nr.booking_id && nr.booking_id !== "(unknown)" ? nr.booking_id : null,
        relatedSessionId: nr.session_id ?? null,
        payloadSnapshot: nr,
      });
      return new Response(JSON.stringify({ ok: true, alerted: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { booking_id } = body ?? {};
    if (!booking_id || typeof booking_id !== "string") {
      return new Response(JSON.stringify({ error: "booking_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: booking, error: bErr } = await sb.from("bookings").select("*").eq("id", booking_id).maybeSingle();
    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "booking not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: items } = await sb.from("booking_items").select("product_name,unit_price,product_price").eq("booking_id", booking_id);
    const b = booking as unknown as BookingForEmail;
    const its = (items ?? []) as BookingItemForEmail[];

    const cust = await customerConfirmationEmail(b, its);
    if (cust.enabled) {
      await sendEmail({
        to: b.customer_email, subject: cust.subject, html: cust.html,
        from: "bookings", templateName: "booking_confirmation_customer",
        idempotencyKey: `booking_confirm_customer:${b.id}`,
        relatedBookingId: b.id, relatedSessionId: b.stripe_session_id ?? null,
      });
    }

    const adm = await adminNewBookingEmail(b, its);
    if (adm.enabled) {
      await sendEmail({
        to: ADMIN_EMAILS, subject: adm.subject, html: adm.html,
        from: "alerts", templateName: "booking_new_admin",
        idempotencyKey: `booking_new_admin:${b.id}`,
        relatedBookingId: b.id, relatedSessionId: b.stripe_session_id ?? null,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-booking-emails", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});