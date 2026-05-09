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
    const { booking_id } = await req.json();
    if (!booking_id || typeof booking_id !== "string") {
      return new Response(JSON.stringify({ error: "booking_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
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