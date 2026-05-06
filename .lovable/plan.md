# Booking Confirmation Emails

Build two branded transactional emails that fire when a Stripe payment succeeds:

1. **Customer receipt** — branded confirmation sent to the customer.
2. **Admin alert** — internal notification sent to `orlandoinflatablesllc@gmail.com` and `austin@bouncewave.com`.

## Step 1 — Provision email infrastructure

Run `email_domain--setup_email_infra` to create the email queue tables, RPC wrappers, send log, and deploy the `process-email-queue` cron-driven sender. One-time setup, no schema changes for you to review.

## Step 2 — Scaffold transactional email function

Run `email_domain--scaffold_transactional_email` to create the standard `send-transactional-email` Edge Function and template directory.

## Step 3 — Create the two branded templates

New files in `supabase/functions/_shared/email-templates/`:

### `booking-customer.tsx`
React Email template, bright-blue (#2563EB / brand) themed, includes:
- Header: "Orlando Inflatables" + tagline, phone `(407) 497-1840` prominent.
- Greeting with customer first name.
- Booking reference (short ID), event date, start/pickup times, event address.
- Itemized list of rented products with per-item price.
- Subtotal, amount paid, balance due (if any), payment status.
- "What happens next" block: delivery window, setup notes, contact info.
- Footer: phone, reply-to note, unsubscribe link (auto-injected by infra).

### `booking-admin.tsx`
Plain, operational layout, no marketing chrome:
- Subject-line equivalent header: "New Booking — {customer_name} — {event_date}".
- Customer block: name, email, phone.
- Event block: date range, times, full address, event type, notes.
- Items table: product name, base price, multiplier-adjusted unit price.
- Money block: total, deposit, amount paid, balance due, Stripe session ID.
- Link back to `/admin/bookings` for quick access.

Both templates:
- From: `bookings@orlandoinflatables.com`
- Reply-to: `orlandoinflatablesllc@gmail.com`
- Use shared `<EmailLayout>` wrapper for consistent header/footer.

## Step 4 — Wire into the payments webhook

Edit `supabase/functions/payments-webhook/index.ts`. After the successful `booking_items` insert and `pending_bookings` cleanup, render both templates and call the email enqueue RPC twice:

```text
try {
  enqueue customer email -> p.customer_email
  enqueue admin email   -> ADMIN_EMAILS (BCC-style fan-out, one row each)
} catch (e) {
  console.error("email enqueue failed", e)
  // do NOT fail the webhook — booking is already saved
}
```

`ADMIN_EMAILS` declared at top of file as a constant array so it's easy to edit later.

## Step 5 — Deploy

Deploy `payments-webhook` and `send-transactional-email` (auto-handled).

## Technical details

- **Files created:** `supabase/functions/_shared/email-templates/booking-customer.tsx`, `booking-admin.tsx`, plus a small `_layout.tsx` shared wrapper.
- **Files edited:** `supabase/functions/payments-webhook/index.ts` only.
- **No DB schema changes** beyond what `setup_email_infra` provisions automatically.
- **No new secrets.** Domain `orlandoinflatables.com` is already configured.
- **Idempotency preserved:** existing "already processed" check prevents duplicate sends on Stripe webhook retries.
- **Failure isolation:** email errors are caught and logged; the booking + calendar block remain authoritative.

## Out of scope

- Reminder emails (day-before, post-event thank-you) — can be added later.
- SMS notifications — not requested.
- Customer-facing "view my booking" page — not requested.
