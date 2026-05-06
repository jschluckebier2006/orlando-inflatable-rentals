# Booking Email Notifications

Your checkout already does the rest of what we discussed (deposit/pay-in-full choice, calendar auto-block on confirmed bookings). The only thing missing is **email**. This plan adds that.

## What you'll get

When a customer's payment succeeds, two emails go out automatically:

1. **Customer receipt** — branded confirmation with their booking reference, date, items, amount paid, balance due, and your phone number. Sent to the email they entered at checkout.
2. **Admin alert** — internal notification with full customer details (name, phone, address, items, amount), sent to **orlandoinflatablesllc@gmail.com** and **austin@bouncewave.com**.

Both emails include `orlandoinflatablesllc@gmail.com` as the **reply-to**, so any customer reply lands in your Gmail inbox.

## Sender setup

- **From:** `bookings@orlandoinflatables.com`
- **Reply-to:** `orlandoinflatablesllc@gmail.com`
- **Provider:** Lovable's built-in transactional email (no external account / API key needed; queued and sent reliably).

You'll need to add `orlandoinflatables.com` as your project's email domain — this is a one-time DNS step (~5 minutes) that proves you own the domain. I'll trigger the setup dialog at the start of implementation.

## Steps

1. **Domain setup** — open the email setup dialog so you can add `orlandoinflatables.com` and paste the DNS records into your registrar. Once it shows "verifying" we can proceed; full verification can finish in the background.
2. **Provision email infrastructure** — Lovable creates the email queue, send log, and sender function. No work for you.
3. **Build the two email templates** — branded with your bright-blue theme, your phone `(407) 497-1840`, booking summary, and the items list. Customer template focuses on the reservation; admin template focuses on operational details.
4. **Trigger from the payment webhook** — modify `supabase/functions/payments-webhook/index.ts` so that immediately after a booking is successfully inserted into the database, it enqueues both emails. This guarantees no booking is confirmed without notifications going out.
5. **Wrap email sending in try/catch** — if the email provider has a hiccup, the booking still saves and the calendar still blocks. We log the failure rather than fail the webhook (Stripe would otherwise retry and could double-charge).

## Technical details

- New file: `supabase/functions/_shared/email-templates/booking-customer.tsx` — React Email template for customer receipt.
- New file: `supabase/functions/_shared/email-templates/booking-admin.tsx` — React Email template for the internal alert.
- Edited: `supabase/functions/payments-webhook/index.ts` — after successful `booking_items` insert, call `enqueue_email` RPC twice (one customer, one admin) with the rendered templates.
- Admin recipients hardcoded as a constant array `ADMIN_EMAILS = ["orlandoinflatablesllc@gmail.com", "austin@bouncewave.com"]` so they're easy to edit later.
- No database schema changes. No new secrets. No new edge functions beyond the auto-provisioned `process-email-queue`.
- Sandbox testing: emails are sent normally from sandbox once the domain verifies. Test card `4242 4242 4242 4242` on a $50 deposit will trigger both emails to whatever email you put in the test booking form.

## What this does NOT change

- Existing $50 deposit / pay-in-full / custom amount checkout flow — untouched.
- Existing calendar auto-block via `get_booked_dates_for_products` — untouched.
- Existing admin dashboard, booking edit modal, manual booking entry — untouched.

## After approval

I'll trigger the domain-setup dialog first. Once you've pasted the DNS records (Hostinger has a per-record helper — I can walk you through it), I'll build and deploy the email pieces. Confirmation works as soon as DNS verifies.
