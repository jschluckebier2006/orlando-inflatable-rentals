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
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
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
      <tr><td style="color:#54657a;">Delivery</td><td>${escapeHtml(b.event_start_time ?? "")}</td></tr>
      <tr><td style="color:#54657a;">Pickup</td><td>${escapeHtml(b.event_end_time ?? "")}</td></tr>
      <tr><td style="color:#54657a;">Address</td><td>${escapeHtml(b.event_address_line)}, ${escapeHtml(b.event_city)} ${escapeHtml(b.event_zip)}</td></tr>
      <tr><td style="color:#54657a;">Contact</td><td>${escapeHtml(b.customer_name)} · ${escapeHtml(b.customer_phone)}</td></tr>
    </table>`;
}

export function customerConfirmationEmail(b: BookingForEmail, items: BookingItemForEmail[]) {
  const ref = b.id.slice(0, 8).toUpperCase();
  const balance = Number(b.balance_due ?? 0);
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
  const taxLine = Number(b.tax_amount ?? 0) > 0
    ? `<tr><td style="color:#54657a;">Sales Tax (7%)</td><td style="text-align:right;">${fmtMoney(b.tax_amount)}</td></tr>` : "";
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;">Booking confirmed!</h1>
    <p style="margin:0 0 16px;color:#54657a;">Hi ${escapeHtml(b.customer_name.split(" ")[0])}, thanks for booking with Orlando Inflatables. Your reservation is locked in.</p>
    <p style="margin:0 0 16px;font-size:13px;color:#54657a;">Booking ref: <strong>#${ref}</strong></p>
    <h2 style="font-size:16px;margin:20px 0 8px;">Event details</h2>
    ${bookingDetailsBlock(b)}
    <h2 style="font-size:16px;margin:24px 0 4px;">Your rentals</h2>
    ${itemsTable(items)}
    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:8px;">
      ${subtotalLine}
      ${waiverLine}
      ${deliveryLine}
      ${taxLine}
      <tr><td style="color:#54657a;"><strong>Total</strong></td><td style="text-align:right;"><strong>${fmtMoney(b.total_amount)}</strong></td></tr>
      <tr><td style="color:#54657a;">Amount paid</td><td style="text-align:right;">${fmtMoney(b.amount_paid)}</td></tr>
      ${balanceLine}
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#54657a;">Need to make a change? Reply to this email or call <strong>${PHONE}</strong>. Cancellations 7+ days before your event are fully refundable; weather-related cancellations on event day receive a full credit.</p>`;
  return {
    subject: `Booking confirmed for ${fmtDate(b.event_date)} · #${ref}`,
    html: layout({ preheader: `Your Orlando Inflatables booking #${ref} is confirmed.`, body }),
  };
}

export function adminNewBookingEmail(b: BookingForEmail, items: BookingItemForEmail[]) {
  const ref = b.id.slice(0, 8).toUpperCase();
  const itemList = items.map((i) => `<li>${escapeHtml(i.product_name)} — ${fmtMoney(i.unit_price ?? i.product_price)}</li>`).join("");
  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;">New booking #${ref}</h1>
    <p style="margin:0 0 12px;"><strong>${escapeHtml(b.customer_name)}</strong> · ${escapeHtml(b.customer_email)} · ${escapeHtml(b.customer_phone)}</p>
    ${bookingDetailsBlock(b)}
    <h2 style="font-size:15px;margin:20px 0 4px;">Items</h2>
    <ul style="margin:0 0 12px;padding-left:18px;font-size:14px;">${itemList}</ul>
    <p style="font-size:14px;"><strong>Total:</strong> ${fmtMoney(b.total_amount)} · <strong>Paid:</strong> ${fmtMoney(b.amount_paid)} · <strong>Balance:</strong> ${fmtMoney(b.balance_due)}</p>
    ${b.notes ? `<p style="font-size:13px;color:#54657a;"><strong>Notes:</strong> ${escapeHtml(b.notes)}</p>` : ""}
    ${b.stripe_session_id ? `<p style="font-size:12px;color:#8a97a8;">Stripe session: ${escapeHtml(b.stripe_session_id)}</p>` : ""}`;
  return {
    subject: `🎉 New booking · ${b.customer_name} · ${fmtDate(b.event_date)}`,
    html: layout({ preheader: `New booking from ${b.customer_name}`, body }),
  };
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
export function adminAbandonedCartEmail(c: AbandonedCartInfo) {
  const itemList = c.items.map((i) => `<li>${escapeHtml(i.product_name)} — ${fmtMoney(i.product_price)}</li>`).join("");
  const body = `
    <h1 style="margin:0 0 8px;font-size:20px;">Abandoned checkout</h1>
    <p style="margin:0 0 12px;color:#54657a;">A customer reached checkout but didn't complete payment ~30 min ago. Worth a quick call.</p>
    <p><strong>${escapeHtml(c.customer_name)}</strong><br>
    📧 ${escapeHtml(c.customer_email)}<br>
    📞 <a href="tel:${escapeHtml(c.customer_phone)}">${escapeHtml(c.customer_phone)}</a></p>
    <p><strong>Requested date:</strong> ${fmtDate(c.event_date)}</p>
    <h2 style="font-size:15px;margin:16px 0 4px;">Cart</h2>
    <ul style="margin:0 0 12px;padding-left:18px;">${itemList}</ul>
    <p style="font-size:14px;"><strong>Cart total:</strong> ${fmtMoney(c.amount_total)}</p>`;
  return {
    subject: `🛒 Abandoned cart · ${c.customer_name} · ${fmtDate(c.event_date)}`,
    html: layout({ preheader: `${c.customer_name} didn't complete checkout`, body }),
  };
}

export function dayBeforeReminderEmail(b: BookingForEmail) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;">See you tomorrow!</h1>
    <p style="margin:0 0 16px;color:#54657a;">Hi ${escapeHtml(b.customer_name.split(" ")[0])}, just a friendly reminder that your Orlando Inflatables rental is tomorrow.</p>
    ${bookingDetailsBlock(b)}
    <p style="margin:20px 0 0;font-size:14px;">Please make sure the delivery area is clear, accessible, and within ~75 ft of a working outlet. If weather looks rough, give us a call at <strong>${PHONE}</strong> — same-day weather cancellations get full credit toward a future booking.</p>`;
  return {
    subject: `Reminder: your rental is tomorrow · ${fmtDate(b.event_date)}`,
    html: layout({ preheader: "Quick reminder for your event tomorrow.", body }),
  };
}

export function reviewRequestEmail(b: BookingForEmail) {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;">Thanks for renting with us!</h1>
    <p style="margin:0 0 16px;color:#54657a;">Hi ${escapeHtml(b.customer_name.split(" ")[0])}, we hope yesterday's event was a blast. If you have a minute, a Google review means the world to our small family business.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${REVIEW_URL}" style="background:${BRAND_BLUE};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:bold;display:inline-block;">Leave a Google Review</a>
    </p>
    <p style="margin:0;font-size:13px;color:#54657a;">Thank you again — we can't wait to bounce with you next time!</p>`;
  return {
    subject: "How was your Orlando Inflatables rental?",
    html: layout({ preheader: "A quick review would mean a lot.", body }),
  };
}