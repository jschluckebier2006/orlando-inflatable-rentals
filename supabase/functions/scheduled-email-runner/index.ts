import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  sendEmail,
  adminAbandonedCartEmail,
  dayBeforeReminderEmail,
  reviewRequestEmail,
  ADMIN_EMAILS,
  type BookingForEmail,
  type AbandonedCartInfo,
} from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  let job = "";
  try {
    const body = await req.json().catch(() => ({}));
    job = body.job ?? "";
  } catch { /* ignore */ }

  const results: Record<string, unknown> = { job };

  try {
    if (job === "abandoned_cart") {
      // Pending bookings older than 30 min, not yet converted, not yet alerted.
      const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data: pendings } = await sb
        .from("pending_bookings")
        .select("*")
        .lt("created_at", cutoff)
        .limit(50);
      let sent = 0;
      for (const p of pendings ?? []) {
        // Skip if a real booking exists for this session (already converted).
        const { data: existing } = await sb
          .from("bookings").select("id").eq("stripe_session_id", p.stripe_session_id).maybeSingle();
        if (existing) continue;
        // Idempotency log check happens inside sendEmail.
        const payload = (p as any).payload ?? {};
        const info: AbandonedCartInfo = {
          customer_name: payload.customer_name ?? "Unknown",
          customer_email: payload.customer_email ?? "",
          customer_phone: payload.customer_phone ?? "",
          event_date: payload.event_date ?? "",
          items: (payload.items ?? []).map((i: any) => ({ product_name: i.product_name, product_price: i.product_price })),
          stripe_session_id: p.stripe_session_id,
          amount_total: Number(p.amount_total),
        };
        const eml = adminAbandonedCartEmail(info);
        const r = await sendEmail({
          to: ADMIN_EMAILS, subject: eml.subject, html: eml.html, from: "alerts",
          templateName: "abandoned_cart_admin",
          idempotencyKey: `abandoned_cart:${p.stripe_session_id}`,
          relatedSessionId: p.stripe_session_id,
        });
        if (r.ok && !r.skipped) sent++;
      }
      results.sent = sent;
    } else if (job === "day_before_reminder") {
      // Tomorrow's date in UTC (close enough for daily 4PM job).
      const tomorrow = new Date(); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const dateStr = tomorrow.toISOString().slice(0, 10);
      const { data: bookings } = await sb
        .from("bookings").select("*")
        .eq("event_date", dateStr).eq("status", "confirmed").limit(200);
      let sent = 0;
      for (const b of (bookings ?? []) as unknown as BookingForEmail[]) {
        const eml = dayBeforeReminderEmail(b);
        const r = await sendEmail({
          to: b.customer_email, subject: eml.subject, html: eml.html, from: "bookings",
          templateName: "day_before_reminder",
          idempotencyKey: `day_before:${b.id}`,
          relatedBookingId: b.id,
        });
        if (r.ok && !r.skipped) sent++;
      }
      results.sent = sent;
    } else if (job === "post_event_review") {
      // Yesterday's events.
      const y = new Date(); y.setUTCDate(y.getUTCDate() - 1);
      const dateStr = y.toISOString().slice(0, 10);
      const { data: bookings } = await sb
        .from("bookings").select("*")
        .eq("event_date", dateStr).eq("status", "confirmed").limit(200);
      let sent = 0;
      for (const b of (bookings ?? []) as unknown as BookingForEmail[]) {
        const eml = reviewRequestEmail(b);
        const r = await sendEmail({
          to: b.customer_email, subject: eml.subject, html: eml.html, from: "bookings",
          templateName: "post_event_review",
          idempotencyKey: `review_request:${b.id}`,
          relatedBookingId: b.id,
        });
        if (r.ok && !r.skipped) sent++;
      }
      results.sent = sent;
    } else {
      return new Response(JSON.stringify({ error: "unknown job" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, ...results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scheduled-email-runner", job, e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});