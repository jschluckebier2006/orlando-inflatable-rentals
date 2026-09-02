// Shared Resend email sender + branded templates for Orlando Inflatables.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_BOOKINGS = "Orlando Inflatables <bookings@orlandoinflatables.com>";
const FROM_ALERTS = "Orlando Inflatables Alerts <alerts@orlandoinflatables.com>";
const REPLY_TO = "orlandoinflatablesllc@gmail.com";
export const ADMIN_EMAILS = ["orlandoinflatablesllc@gmail.com", "austin@bouncewave.com"];
export const PHONE = "(407) 497-1840";
export const SITE_URL = "https://orlandoinflatables.com";
export const REVIEW_URL = "https://g.page/r/orlando-inflatables/review";

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// ---------- Template loader ----------
interface TemplateRow {
  key: string;
  subject: string;
  body_html: string;
  enabled: boolean;
}
let _tplCache: { value: Map<string, TemplateRow>; expires: number } | null = null;
const TPL_TTL_MS = 30_000;

export async function loadTemplate(key: string): Promise<TemplateRow | null> {
  try {
    if (!_tplCache || _tplCache.expires < Date.now()) {
      const sb = admin();
      const { data } = await sb.from("email_templates").select("key,subject,body_html,enabled");
      const m = new Map<string, TemplateRow>();
      (data ?? []).forEach((r: any) => m.set(r.key, r as TemplateRow));
      _tplCache = { value: m, expires: Date.now() + TPL_TTL_MS };
    }
    return _tplCache.value.get(key) ?? null;
  } catch {
    return null;
  }
}

export function applyMergeTags(template: string, data: Record<string, string>): string {
  return String(template ?? "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => data[k] ?? "");
}

export interface RenderedEmail {
  subject: string;
  html: string;
  enabled: boolean;
}

export async function renderTemplate(
  key: string,
  data: Record<string, string>,
  preheader: string,
): Promise<RenderedEmail> {
  const tpl = await loadTemplate(key);
  if (!tpl) {
    return { subject: "", html: "", enabled: false };
  }
  const subject = applyMergeTags(tpl.subject, data);
  const innerHtml = applyMergeTags(tpl.body_html, data);
  return {
    subject,
    html: layout({ preheader, body: innerHtml }),
    enabled: tpl.enabled,
  };
}

export interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  from?: "bookings" | "alerts";
  replyTo?: string;
  idempotencyKey: string;
  templateName: string;
  relatedBookingId?: string | null;
  relatedSessionId?: string | null;
  /**
   * Durable snapshot of the source data behind this email (e.g. the full
   * abandoned-cart payload). Written to email_send_log.payload_snapshot so the
   * record stays recoverable even after pending_bookings is purged.
   */
  payloadSnapshot?: unknown;
}

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const sb = admin();
  // Idempotency: skip if we've already logged a successful send with this key.
  const { data: existing } = await sb
    .from("email_send_log")
    .select("id,status")
    .eq("idempotency_key", args.idempotencyKey)
    .maybeSingle();
  if (existing && existing.status === "sent") return { ok: true, skipped: true };

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? Deno.env.get("RESEND_API_KEY_1");
  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    const err = "Missing LOVABLE_API_KEY or RESEND_API_KEY";
    await sb.from("email_send_log").insert({
      idempotency_key: args.idempotencyKey + ":" + Date.now(),
      template_name: args.templateName,
      recipient_email: Array.isArray(args.to) ? args.to.join(",") : args.to,
      status: "failed",
      error_message: err,
      related_booking_id: args.relatedBookingId ?? null,
      related_session_id: args.relatedSessionId ?? null,
      payload_snapshot: (args.payloadSnapshot ?? null) as never,
    });
    return { ok: false, error: err };
  }

  const fromAddr = args.from === "alerts" ? FROM_ALERTS : FROM_BOOKINGS;
  const toArr = Array.isArray(args.to) ? args.to : [args.to];

  try {
    const resp = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: fromAddr,
        to: toArr,
        subject: args.subject,
        html: args.html,
        reply_to: args.replyTo ?? REPLY_TO,
      }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const msg = `Resend ${resp.status}: ${JSON.stringify(data)}`;
      await sb.from("email_send_log").insert({
        idempotency_key: args.idempotencyKey + ":" + Date.now(),
        template_name: args.templateName,
        recipient_email: toArr.join(","),
        status: "failed",
        error_message: msg.slice(0, 500),
        related_booking_id: args.relatedBookingId ?? null,
        related_session_id: args.relatedSessionId ?? null,
      payload_snapshot: (args.payloadSnapshot ?? null) as never,
      });
      return { ok: false, error: msg };
    }
    await sb.from("email_send_log").insert({
      idempotency_key: args.idempotencyKey,
      template_name: args.templateName,
      recipient_email: toArr.join(","),
      status: "sent",
      resend_message_id: data?.id ?? null,
      related_booking_id: args.relatedBookingId ?? null,
      related_session_id: args.relatedSessionId ?? null,
      payload_snapshot: (args.payloadSnapshot ?? null) as never,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await sb.from("email_send_log").insert({
      idempotency_key: args.idempotencyKey + ":" + Date.now(),
      template_name: args.templateName,
      recipient_email: toArr.join(","),
      status: "failed",
      error_message: msg.slice(0, 500),
      related_booking_id: args.relatedBookingId ?? null,
      related_session_id: args.relatedSessionId ?? null,
      payload_snapshot: (args.payloadSnapshot ?? null) as never,
    });
    return { ok: false, error: msg };
  }
}

// ---------- Templates ----------
const BRAND_BLUE = "#1e88ff";
const escapeHtml = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function layout(opts: { preheader: string; body: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#1a2a3a;">
<span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
<tr><td style="background:${BRAND_BLUE};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">Orlando Inflatables</td></tr>
<tr><td style="padding:28px;">${opts.body}</td></tr>
<tr><td style="background:#f4f6fa;padding:18px 28px;font-size:13px;color:#54657a;">
Questions? Call <a href="tel:+14074971840" style="color:${BRAND_BLUE};font-weight:bold;text-decoration:none;">${PHONE}</a><br>
<a href="${SITE_URL}" style="color:${BRAND_BLUE};">orlandoinflatables.com</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

export interface BookingForEmail {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_date: string;
  event_end_date?: string | null;
  event_start_time?: string | null;
  event_end_time?: string | null;
  event_address_line: string;
  event_city: string;
  event_zip: string;
  duration_type: string;
  total_amount: number | null;
  amount_paid: number;
  balance_due: number | null;
  notes?: string | null;
  stripe_session_id?: string | null;
  subtotal?: number | null;
  damage_waiver_selected?: boolean | null;
  damage_waiver_amount?: number | null;
  tax_amount?: number | null;
  delivery_fee?: number | null;
  delivery_zone_city?: string | null;
  checkout_fee_amount?: number | null;
  payment_method_choice?: "card_on_file" | "cash_on_delivery" | null;
}
export interface BookingItemForEmail {
  product_name: string;
  unit_price: number | null;
  product_price: number;
}

const fmtMoney = (n: number | null | undefined) =>
  n == null ? "—" : `$${Number(n).toFixed(2)}`;
const fmtDate = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const fmtTime = (t: string | null | undefined) => {
  if (!t) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t));
  if (!m) return String(t);
  let h = parseInt(m[1], 10);
  const mins = m[2];
  if (isNaN(h)) return String(t);
  const period = h >= 12 ? "pm" : "am";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mins}${period}`;
};

function itemsTable(items: BookingItemForEmail[]) {
  const rows = items.map((i) => `
    <tr><td style="padding:8px 0;border-bottom:1px solid #eef0f4;">${escapeHtml(i.product_name)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eef0f4;text-align:right;">${fmtMoney(i.unit_price ?? i.product_price)}</td></tr>`).join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0;font-size:14px;">${rows}</table>`;
}

function bookingDetailsBlock(b: BookingForEmail) {
  const dateLine = b.event_end_date && b.event_end_date !== b.event_date
    ? `${fmtDate(b.event_date)} → ${fmtDate(b.event_end_date)}`
    : fmtDate(b.event_date);
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;">
      <tr><td style="color:#54657a;width:130px;">Event date</td><td><strong>${dateLine}</strong></td></tr>
      <tr><td style="color:#54657a;">Delivery</td><td>${escapeHtml(fmtTime(b.event_start_time))}</td></tr>
      <tr><td style="color:#54657a;">Pickup</td><td>${escapeHtml(fmtTime(b.event_end_time))}</td></tr>
      <tr><td style="color:#54657a;">Address</td><td>${escapeHtml(b.event_address_line)}, ${escapeHtml(b.event_city)} ${escapeHtml(b.event_zip)}</td></tr>
      <tr><td style="color:#54657a;">Contact</td><td>${escapeHtml(b.customer_name)} · ${escapeHtml(b.customer_phone)}</td></tr>
    </table>`;
}

function totalsBlock(b: BookingForEmail) {
  const total = Number(b.total_amount ?? 0);
  const paid = Number(b.amount_paid ?? 0);
  // Trust the money, not the stored balance column — a stale balance must never
  // print a phantom amount due on a fully paid booking.
  const paidInFull = total > 0 && paid >= total - 0.005;
  const balance = paidInFull ? 0 : Math.max(0, Number(b.balance_due ?? Math.max(0, total - paid)));
  const balanceLine = balance > 0
    ? `<tr><td style="color:#54657a;">Balance due on delivery</td><td style="text-align:right;"><strong>${fmtMoney(balance)}</strong></td></tr>`
    : `<tr><td colspan="2" style="text-align:right;color:#1a8a4a;font-weight:bold;">Paid in full ✓</td></tr>`;

  const subtotalLine = b.subtotal != null
    ? `<tr><td style="color:#54657a;">Subtotal</td><td style="text-align:right;">${fmtMoney(b.subtotal)}</td></tr>` : "";
  const waiverLine = b.damage_waiver_selected && Number(b.damage_waiver_amount ?? 0) > 0
    ? `<tr><td style="color:#54657a;">Damage Waiver (10%)</td><td style="text-align:right;">${fmtMoney(b.damage_waiver_amount)}</td></tr>` : "";
  const deliveryLine = Number(b.delivery_fee ?? 0) > 0
    ? `<tr><td style="color:#54657a;">Delivery${b.delivery_zone_city ? ` — ${escapeHtml(b.delivery_zone_city)}` : ""}</td><td style="text-align:right;">${fmtMoney(b.delivery_fee)}</td></tr>`
    : b.delivery_zone_city
      ? `<tr><td style="color:#54657a;">Delivery — ${escapeHtml(b.delivery_zone_city)}</td><td style="text-align:right;color:#1a8a4a;">FREE</td></tr>`
      : "";
  const feeLine = Number(b.checkout_fee_amount ?? 0) > 0
    ? `<tr><td style="color:#54657a;">Online Payment Convenience Fee (4%)</td><td style="text-align:right;">${fmtMoney(b.checkout_fee_amount)}</td></tr>` : "";
  const taxLine = Number(b.tax_amount ?? 0) > 0
    ? `<tr><td style="color:#54657a;">Sales Tax (7%)</td><td style="text-align:right;">${fmtMoney(b.tax_amount)}</td></tr>` : "";
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:8px;">
      ${subtotalLine}${waiverLine}${deliveryLine}${taxLine}${feeLine}
      <tr><td style="color:#54657a;"><strong>Total</strong></td><td style="text-align:right;"><strong>${fmtMoney(b.total_amount)}</strong></td></tr>
      <tr><td style="color:#54657a;">Amount paid</td><td style="text-align:right;">${fmtMoney(b.amount_paid)}</td></tr>
      ${balanceLine}
    </table>`;
}

function itemsList(items: BookingItemForEmail[]) {
  return `<ul style="margin:0 0 12px;padding-left:18px;font-size:14px;">${
    items.map((i) => `<li>${escapeHtml(i.product_name)} — ${fmtMoney(i.unit_price ?? i.product_price)}</li>`).join("")
  }</ul>`;
}

export async function customerConfirmationEmail(b: BookingForEmail, items: BookingItemForEmail[]): Promise<RenderedEmail> {
  const ref = b.id.slice(0, 8).toUpperCase();
  return await renderTemplate("booking_confirmation_customer", {
    first_name: escapeHtml(b.customer_name.split(" ")[0]),
    customer_name: escapeHtml(b.customer_name),
    ref,
    event_date: fmtDate(b.event_date),
    phone: PHONE,
    details_block: bookingDetailsBlock(b),
    items_block: itemsTable(items),
    totals_block: totalsBlock(b),
  }, `Your Orlando Inflatables booking #${ref} is confirmed.`);
}

export async function adminNewBookingEmail(b: BookingForEmail, items: BookingItemForEmail[]): Promise<RenderedEmail> {
  const ref = b.id.slice(0, 8).toUpperCase();
  return await renderTemplate("booking_new_admin", {
    ref,
    customer_name: escapeHtml(b.customer_name),
    customer_email: escapeHtml(b.customer_email),
    customer_phone: escapeHtml(b.customer_phone),
    event_date: fmtDate(b.event_date),
    details_block: bookingDetailsBlock(b),
    items_list: itemsList(items),
    total: fmtMoney(b.total_amount),
    paid: fmtMoney(b.amount_paid),
    balance: fmtMoney(b.balance_due),
    notes_block: b.notes ? `<p style="font-size:13px;color:#54657a;"><strong>Notes:</strong> ${escapeHtml(b.notes)}</p>` : "",
    stripe_block: b.stripe_session_id ? `<p style="font-size:12px;color:#8a97a8;">Stripe session: ${escapeHtml(b.stripe_session_id)}</p>` : "",
  }, `New booking from ${b.customer_name}`);
}

export async function customerRescheduleEmail(
  b: BookingForEmail,
  prev: { start: string; end?: string | null },
): Promise<RenderedEmail> {
  const ref = b.id.slice(0, 8).toUpperCase();
  const oldLine = prev.end && prev.end !== prev.start
    ? `${fmtDate(prev.start)} → ${fmtDate(prev.end)}`
    : fmtDate(prev.start);
  const newLine = b.event_end_date && b.event_end_date !== b.event_date
    ? `${fmtDate(b.event_date)} → ${fmtDate(b.event_end_date)}`
    : fmtDate(b.event_date);
  const rescheduleBlock = `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6;border:1px solid #eef0f4;border-radius:8px;padding:12px;margin:8px 0 16px;">
      <tr><td style="color:#54657a;width:130px;">Previous date</td><td style="text-decoration:line-through;color:#8a97a8;">${oldLine}</td></tr>
      <tr><td style="color:#54657a;">New date</td><td><strong style="color:${BRAND_BLUE};">${newLine}</strong></td></tr>
      <tr><td style="color:#54657a;">Delivery</td><td>${escapeHtml(fmtTime(b.event_start_time))}</td></tr>
      <tr><td style="color:#54657a;">Pickup</td><td>${escapeHtml(fmtTime(b.event_end_time))}</td></tr>
      <tr><td style="color:#54657a;">Address</td><td>${escapeHtml(b.event_address_line)}, ${escapeHtml(b.event_city)} ${escapeHtml(b.event_zip)}</td></tr>
    </table>`;
  return await renderTemplate("booking_reschedule_customer", {
    first_name: escapeHtml(b.customer_name.split(" ")[0]),
    ref,
    event_date: fmtDate(b.event_date),
    phone: PHONE,
    reschedule_block: rescheduleBlock,
  }, `Your booking #${ref} has been rescheduled to ${newLine}.`);
}

export async function adminRescheduleEmail(
  b: BookingForEmail,
  prev: { start: string; end?: string | null },
  override: boolean,
  actorEmail?: string | null,
): Promise<RenderedEmail> {
  const ref = b.id.slice(0, 8).toUpperCase();
  const oldLine = prev.end && prev.end !== prev.start
    ? `${fmtDate(prev.start)} → ${fmtDate(prev.end)}`
    : fmtDate(prev.start);
  const newLine = b.event_end_date && b.event_end_date !== b.event_date
    ? `${fmtDate(b.event_date)} → ${fmtDate(b.event_end_date)}`
    : fmtDate(b.event_date);
  const overrideBlock = override
    ? `<p style="margin:12px 0;padding:10px 12px;background:#fff4e5;border:1px solid #ffb84d;border-radius:6px;color:#8a4b00;font-size:13px;">
         <strong>⚠️ Conflict override:</strong> the new date had a booking conflict that was overridden by ${escapeHtml(actorEmail ?? "an admin")}. The same item may now be double-booked.
       </p>` : "";
  return await renderTemplate("booking_reschedule_admin", {
    ref,
    customer_name: escapeHtml(b.customer_name),
    customer_email: escapeHtml(b.customer_email),
    customer_phone: escapeHtml(b.customer_phone),
    event_date: fmtDate(b.event_date),
    old_dates: oldLine,
    new_dates: newLine,
    actor_email: escapeHtml(actorEmail ?? "admin"),
    override_block: overrideBlock,
    override_emoji: override ? "⚠️ " : "",
  }, `Booking #${ref} rescheduled to ${newLine}`);
}

export interface AbandonedCartInfo {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_date: string;
  items: { product_name: string; product_price: number }[];
  stripe_session_id: string;
  amount_total: number;
}
export async function adminAbandonedCartEmail(c: AbandonedCartInfo): Promise<RenderedEmail> {
  const list = `<ul style="margin:0 0 12px;padding-left:18px;">${
    c.items.map((i) => `<li>${escapeHtml(i.product_name)} — ${fmtMoney(i.product_price)}</li>`).join("")
  }</ul>`;
  return await renderTemplate("abandoned_cart_admin", {
    customer_name: escapeHtml(c.customer_name),
    customer_email: escapeHtml(c.customer_email),
    customer_phone: escapeHtml(c.customer_phone),
    event_date: fmtDate(c.event_date),
    items_list: list,
    cart_total: fmtMoney(c.amount_total),
  }, `${c.customer_name} didn't complete checkout`);
}

export async function dayBeforeReminderEmail(b: BookingForEmail): Promise<RenderedEmail> {
  return await renderTemplate("day_before_reminder", {
    first_name: escapeHtml(b.customer_name.split(" ")[0]),
    event_date: fmtDate(b.event_date),
    phone: PHONE,
    details_block: bookingDetailsBlock(b),
  }, "Quick reminder for your event tomorrow.");
}

export async function reviewRequestEmail(b: BookingForEmail): Promise<RenderedEmail> {
  return await renderTemplate("post_event_review", {
    first_name: escapeHtml(b.customer_name.split(" ")[0]),
    review_url: REVIEW_URL,
  }, "A quick review would mean a lot.");
}

export async function balancePaidCustomerEmail(
  b: BookingForEmail,
  amountCharged: number,
): Promise<RenderedEmail> {
  const ref = b.id.slice(0, 8).toUpperCase();
  return await renderTemplate("balance_paid_customer", {
    first_name: escapeHtml(b.customer_name.split(" ")[0]),
    ref,
    event_date: fmtDate(b.event_date),
    phone: PHONE,
    balance_paid: fmtMoney(amountCharged),
    totals_block: totalsBlock(b),
  }, `Payment received for your Orlando Inflatables booking #${ref}.`);
}