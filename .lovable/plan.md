# Full Email System

Three phases. Phase 1 ships as soon as DNS verifies; Phases 2–3 follow.

## Phase 1 — Core transactional emails

1. **Booking confirmation (customer)** — branded receipt sent on successful payment. Booking ref, date, times, address, items, amount paid, balance due, phone `(407) 497-1840`.
2. **New booking alert (admin)** — sent to `orlandoinflatablesllc@gmail.com` and `austin@bouncewave.com` with full booking details + Stripe session ID. Reply-to: Gmail.
3. **Abandoned cart alert (admin)** — sent to `orlandoinflatablesllc@gmail.com` 30 minutes after a `pending_bookings` row is created without a corresponding paid booking. Includes name, phone, email, items, requested date. Built via a `pg_cron` job that scans `pending_bookings` every 5 min and fires once per session (idempotency key on `stripe_session_id`).
4. **Day-before delivery reminder (customer)** — sent at 4PM the day before `event_date`. Confirms delivery window, address, contact #, weather/cancellation policy. Daily `pg_cron` job scans `bookings` where `event_date = tomorrow` and `status = confirmed`.
5. **Post-event review request (customer)** — sent the morning after `event_date`. Direct link to your Google review profile (single CTA, no review-gating per Google TOS). Daily `pg_cron` job.

All five wired through the standard `send-transactional-email` Edge Function. From `bookings@orlandoinflatables.com`, reply-to `orlandoinflatablesllc@gmail.com`.

## Phase 2 — Operational completeness + admin editor

6. **Balance-due reminder (customer)** — sent 3 days before `event_date` if `balance_due > 0`.
7. **Manual-booking confirmation (customer)** — when admin enters a booking via `BookingFormModal`, customer gets the same branded receipt as online checkout.
8. **Cancellation / refund confirmation (customer)** — fires when admin sets booking `status = cancelled`.
9. **Email Templates admin tab** at `/admin/emails`:
   - New `email_templates` table: `key`, `subject`, `body_html`, `body_text`, `enabled`, `updated_at`. Seed with all Phase 1 + 2 templates.
   - List view: every template with subject, status toggle, last edited.
   - Editor: subject input + rich-text body editor + merge-tag picker (`{{customer_name}}`, `{{event_date}}`, `{{event_time}}`, `{{items}}`, `{{total_amount}}`, `{{amount_paid}}`, `{{balance_due}}`, `{{booking_ref}}`, `{{phone}}`).
   - "Send test to me" button — renders with sample data, fires to logged-in admin's email.
   - Send-log per template: who got it, when, status (sent / failed / suppressed) — pulled from `email_send_log`, deduped by `message_id`.
   - Branding/layout (header, footer, button styles, brand blue) stays in code; only editable copy lives in DB.
   - Admin-only route, gated by `has_role(auth.uid(), 'admin')`.

## Phase 3 — Optional ops polish

10. **Daily ops digest (admin)** — 7AM email with today's + tomorrow's deliveries.
11. **Internal balance-unpaid alert (admin)** — 24hr before event if balance still due.

## Cross-cutting technical notes

- All scheduled emails use `pg_cron` + a dispatcher Edge Function (`scheduled-email-runner`) that scans the relevant tables, checks idempotency against `email_send_log` (via `idempotency_key` derived from booking ID + template name), and enqueues sends.
- Failure isolation: every send wrapped in try/catch; logged to `email_send_log` but never blocks the underlying booking flow.
- All admin recipients in a single `ADMIN_EMAILS` constant, easy to edit later.
- No review-gating (Google TOS): single review CTA only.

## Order of execution

1. Wait for DNS verification on `orlandoinflatables.com`.
2. Provision email infrastructure (queue, send log, cron dispatcher).
3. Ship Phase 1 (templates + webhook wiring + 3 cron jobs for abandoned cart, day-before, review request).
4. Ship Phase 2 (3 more templates + admin Email Templates tab + DB-backed template content).
5. Ship Phase 3 on request.

## Out of scope

- SMS notifications.
- Customer-facing "view my booking" portal.
- Marketing/promotional emails (newsletters, discounts) — would damage sender reputation; use a dedicated marketing platform if ever needed.
