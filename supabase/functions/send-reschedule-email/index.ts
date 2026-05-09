import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  sendEmail,
  customerRescheduleEmail,
  adminRescheduleEmail,
  ADMIN_EMAILS,
  type BookingForEmail,
} from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const { booking_id, previous_start, previous_end, override, actor_email } = body ?? {};
    if (!booking_id || typeof booking_id !== "string" || !previous_start) {
      return new Response(JSON.stringify({ error: "booking_id and previous_start required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: booking } = await sb.from("bookings").select("*").eq("id", booking_id).maybeSingle();
    if (!booking) {
      return new Response(JSON.stringify({ error: "booking not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const b = booking as unknown as BookingForEmail;
    const prev = { start: previous_start as string, end: (previous_end ?? previous_start) as string };
    const isOverride = !!override;

    // Customer notification
    if (b.customer_email) {
      const cust = customerRescheduleEmail(b, prev);
      await sendEmail({
        to: b.customer_email,
        subject: cust.subject,
        html: cust.html,
        from: "bookings",
        templateName: "booking_reschedule_customer",
        idempotencyKey: `booking_reschedule_customer:${b.id}:${prev.start}->${b.event_date}`,
        relatedBookingId: b.id,
      });
    }

    // Admin alert (always; flagged louder when override was used)
    const adm = adminRescheduleEmail(b, prev, isOverride, actor_email ?? null);
    await sendEmail({
      to: ADMIN_EMAILS,
      subject: adm.subject,
      html: adm.html,
      from: "alerts",
      templateName: "booking_reschedule_admin",
      idempotencyKey: `booking_reschedule_admin:${b.id}:${prev.start}->${b.event_date}:${isOverride ? "ovr" : "ok"}`,
      relatedBookingId: b.id,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-reschedule-email", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});