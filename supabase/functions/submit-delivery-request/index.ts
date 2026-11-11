// Saves a delivery request from a customer whose ZIP can't be booked online
// ("call" ZIPs or unlisted ZIPs) and alerts the admins through the same email
// path new bookings use. Writes with the service role — visitors never get
// direct table access.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { sendEmail, ADMIN_EMAILS, PHONE } from "../_shared/email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RequestSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  customer_phone: z.string().trim().min(7).max(40).regex(/^[0-9+().\-\s]+$/, "Phone can only contain digits and + ( ) - ."),
  customer_email: z.string().trim().email().max(255),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  event_zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "ZIP must be 5 digits"),
  items: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  notes: z.string().trim().max(2000).optional().nullable(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional().nullable(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return json({ error: "Please check the form and try again.", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const d = parsed.data;
    // Bots fill the hidden field: pretend success, store nothing.
    if (d.website) return json({ ok: true });

    if (d.event_date) {
      const dt = new Date(`${d.event_date}T00:00:00Z`);
      if (Number.isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== d.event_date) {
        return json({ error: "That event date isn't a valid calendar date." }, 400);
      }
    }

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const zip = d.event_zip.slice(0, 5);

    // Light duplicate guard: the same person re-submitting within 10 minutes
    // returns the earlier request instead of creating (and alerting) twice.
    const since = new Date(Date.now() - 10 * 60_000).toISOString();
    const { data: dup } = await sb.from("delivery_requests")
      .select("id")
      .eq("customer_email", d.customer_email)
      .eq("event_zip", zip)
      .gte("created_at", since)
      .limit(1)
      .maybeSingle();
    if (dup?.id) return json({ ok: true, id: dup.id, duplicate: true });

    const { data: row, error } = await sb.from("delivery_requests").insert({
      customer_name: d.customer_name,
      customer_phone: d.customer_phone,
      customer_email: d.customer_email,
      event_date: d.event_date ?? null,
      event_zip: zip,
      items: d.items,
      notes: d.notes || null,
    }).select("id, created_at").single();
    if (error || !row) {
      console.error("delivery_requests insert failed", error);
      return json({ error: `We couldn't send your request. Please call or text ${PHONE}.` }, 500);
    }

    const itemsHtml = d.items.length
      ? `<ul style="margin:0 0 12px;padding-left:18px;font-size:14px;">${d.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
      : `<p style="font-size:14px;color:#54657a;">No items listed.</p>`;
    const html = `
<h1 style="margin:0 0 8px;font-size:20px;">New delivery request</h1>
<p style="margin:0 0 12px;">ZIP <strong>${esc(zip)}</strong> can't be booked online, so this customer sent a request. Please call or text them back.</p>
<table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
<tr><td style="color:#54657a;width:110px;">Name</td><td><strong>${esc(d.customer_name)}</strong></td></tr>
<tr><td style="color:#54657a;">Phone</td><td><a href="tel:${esc(d.customer_phone.replace(/[^0-9+]/g, ""))}">${esc(d.customer_phone)}</a></td></tr>
<tr><td style="color:#54657a;">Email</td><td>${esc(d.customer_email)}</td></tr>
<tr><td style="color:#54657a;">Event date</td><td>${esc(d.event_date ?? "Not given")}</td></tr>
<tr><td style="color:#54657a;">Event ZIP</td><td>${esc(zip)}</td></tr>
</table>
<h2 style="font-size:15px;margin:20px 0 4px;">Items wanted</h2>
${itemsHtml}
${d.notes ? `<p style="font-size:13px;color:#54657a;"><strong>Notes:</strong> ${esc(d.notes)}</p>` : ""}
<p><a href="https://orlandoinflatables.com/admin/bookings?tab=requests">Open delivery requests in admin</a></p>`;

    const sent = await sendEmail({
      to: ADMIN_EMAILS,
      subject: `Delivery request — ${d.customer_name} (ZIP ${zip})`,
      html,
      from: "alerts",
      replyTo: d.customer_email,
      templateName: "delivery_request_admin",
      idempotencyKey: `delivery_request_admin:${row.id}`,
      payloadSnapshot: { request_id: row.id, ...d, website: undefined },
    });
    if (!sent.ok) console.error("delivery request alert failed", sent.error);

    return json({ ok: true, id: row.id });
  } catch (e) {
    console.error("submit-delivery-request", e);
    return json({ error: `We couldn't send your request. Please call or text ${PHONE}.` }, 500);
  }
});
