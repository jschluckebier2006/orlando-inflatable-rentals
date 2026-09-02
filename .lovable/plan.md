# Three flagged issues — investigation report and proposed fixes

## 1. "A crashed webhook can permanently swallow a paid order"

### The bug is real in the code
`payments-webhook` claims each Stripe event by inserting a `webhook_events` row with `status = 'processing'`. On any retry it reads the prior row and returns `duplicate` (HTTP 200) unless the status is exactly `failed`. Only two paths ever move a row off `processing`: a clean `finish("failed", …)` or `finish("completed", …)`. A crash, an uncaught throw, or a platform timeout between the claim and `finish` leaves the row stuck at `processing` forever. Every Stripe retry then answers "already handled", the booking is never created, and no `needs_review` row is written. Both safety nets fail at once, silently.

### But Megan Pahl's order was NOT lost this way — and was not lost at all

Evidence:

- No `webhook_events` row exists for her session or PaymentIntent. The whole table holds exactly one row (`evt_1UAf5F0…`, `completed`, `result = no_pending`, created 2026-09-01 19:01 UTC). The idempotency table did not exist on 2026-08-18 when her session was paid, so this mechanism could not have applied to her.
- No `processing` rows exist anywhere, past or present.
- Her order **was** finalized. `email_send_log` shows four emails all tied to booking `738ed40c-9ee8-48e7-84a3-30e7889aa2db`:
  - `booking_confirmation_customer` — sent 2026-08-18 14:31:52
  - `booking_new_admin` — sent 2026-08-18 14:31:53
  - `day_before_reminder` — sent 2026-08-21 16:00
  - `post_event_review` — sent 2026-08-23 09:00
- So the booking existed, was confirmed, was delivered, and the event has already happened (around 2026-08-22). **Nothing is within 7 days; there is no live job at risk.**
- The `bookings` row `738ed40c…` no longer exists. There is no `admin_audit_log` entry, no `booking_activity`, and no `pending_bookings` row. That signature matches the admin hard-delete (type-DELETE-to-confirm), which by design leaves no trace.
- `email_send_log.payload_snapshot` for her confirmation email is NULL — snapshots were added after her booking, so item list/address/times are not recoverable from the database. Stripe still holds her session (line items, address, email) if you want the detail.
- **No abandoned-cart alert was sent to her.** There is no `abandoned_cart:cs_live_a1Vtwth7…` row in `email_send_log`.

### Why reconciliation alerted anyway
`stripe-reconcile` flags a paid, non-refunded Stripe session with no matching `bookings` row. Her charge is still held and her booking row was hard-deleted, so she matches the orphan test. The reconciler has no concept of "the booking existed and was deliberately deleted."

### Any other orders lost the same way since the deploy?
No. Since 2026-09-01 there are zero new `bookings`, zero `needs_review` rows, and exactly one `webhook_events` row (completed).

### Is checkout silently broken, or is it genuinely quiet?
Genuinely quiet — with one caveat. Evidence that the checkout path is alive: two real `abandoned_cart_admin` alerts fired on 2026-09-01 at 00:25 and 00:30 UTC. That alert only fires for a `pending_bookings` row, which is written *after* validation, the availability pre-check, and a successful Stripe session creation. So on 09-01 real customers reached Stripe checkout and the server-side path worked end to end; they simply did not pay. Booking volume is naturally low anyway — 7 bookings in the last 30 days (last one 2026-08-25), so a 1-2 day gap is normal for this shop.

The caveat: those two carts abandoned *at the payment step*, and the payload snapshots are NULL, so I cannot tell what dates they wanted. A weekend rental refused by the off-by-one would be rejected *before* a session exists, so it leaves no `pending_bookings` row and no alert — it is invisible in the database. Retained edge-function logs show no `create-booking-checkout` entries at all, so I cannot rule out a silent refusal by log evidence either. Nothing suggests checkout is broken; the off-by-one is the one path that could turn a customer away without a trace, which is why fix #2 goes in before the holiday weekend.

### Proposed fix (implement first)
1. **Wrap the whole handler in try/catch** in `payments-webhook`. Any thrown error marks the row `failed` with the message and returns 500 so Stripe retries into real reprocessing.
2. **Expire stale claims.** Treat a `processing` row older than 5 minutes as reclaimable: on a duplicate hit, if `status = 'processing'` and `updated_at < now() - 5 min`, take the claim over (atomic conditional UPDATE) and reprocess instead of answering "duplicate".
3. **Watchdog alert.** A stuck `processing` row older than 10 minutes raises a loud admin alert (checked by the reconcile cron and on each webhook call), so a stalled claim can never sit silent.
4. **Heartbeat.** Touch `updated_at` when finalize starts, so the age test measures real staleness.
5. **Audit every hard delete (expanded).** A `BEFORE DELETE` trigger on `public.bookings` writes an `admin_audit_log` row for any permanent deletion, capturing booking ID, customer name/email/phone, event dates, status, totals, Stripe session and PaymentIntent, who deleted it (JWT email, or `system/service`), the timestamp, and the complete row as a JSON snapshot in `before`. The log is already append-only (updates and deletes are denied by RLS), so the trace cannot be erased. `stripe-reconcile` then consults this log and excludes sessions whose booking was deliberately deleted — with the deletion shown as context rather than an orphan alert.

### Hard delete policy (accepted — implement in this pass)
Hard delete is removed for any booking that has money attached: `amount_paid > 0` OR a non-null `stripe_payment_intent_id`. Those become cancel + archive — `status = 'cancelled'`, `cancelled_at`, a cancel reason, and a new `archived` flag that hides the row from the default admin list while preserving the record. Hard delete stays available only for zero-payment records (test rows, typos). Enforced in two places: the admin UI (`src/pages/admin/Bookings.tsx` offers Archive instead of Delete when money is attached) and a database `BEFORE DELETE` guard that raises an exception on any paid booking, so the rule cannot be bypassed. The audit trigger stays in place regardless.



## 2. Weekend rentals wrongly refused at checkout

### The off-by-one, exactly
`supabase/functions/create-booking-checkout/index.ts` line 101:

```text
spanDays = weekend ? 2 : overnight ? 1 : 0
end = start + spanDays days      -> Saturday + 2 = MONDAY
```

`supabase/functions/_shared/finalizeBooking.ts` lines 68-71:

```text
if (duration_type !== "7hour") end = start + 1 day   -> Saturday + 1 = SUNDAY
```

The pre-payment availability check asks `is_date_range_available` for Sat–Mon (3 days) while the booking that actually gets written is Sat–Sun (2 days). Any block on the Monday refuses the sale for dates that are genuinely free. `weekend` should use `spanDays = 1`, matching finalize and matching the stored `event_end_date`.

### Real customers hit since the deploy?
No evidence of any. There are zero bookings and zero checkout sessions since the 2026-09-01 deploy, and no edge-function log entries for `create-booking-checkout` in the retained window (log retention has aged out anything older). So the exposure is prospective, not yet realized.

Live blackouts relevant to Labor Day weekend (2026-09-05/06):
- `aqua-palms-combo-4in1`: 2026-09-06 → 2026-09-07 (this one spills onto the Monday)
- `tiki-plunge-18`: 2026-09-06 (handled offline, do not clear)

With the current math, a Sat 2026-09-05 weekend rental of `aqua-palms-combo-4in1` is evaluated through Monday 09-07 and refused.

### Proposed fix
Add a shared `rentalEndDate(startDate, durationType)` helper in `supabase/functions/_shared/` returning `start + 0` for `7hour` and `start + 1` for `overnight` and `weekend`. Both `create-booking-checkout` (pre-check) and `finalizeBooking` use it, so the two can never drift. Verification after the fix: `is_date_range_available` for `aqua-palms-combo-4in1` over 2026-09-05 → 2026-09-06 must return true despite the 09-07 blackout, and the same call over 09-05 → 09-07 must still return false.


## 3. "Paid bookings fail to finalize — booking is deleted" — STALE

Confirmed stale on all three checks:
- **Compensating delete is gone.** A search across `supabase/functions` finds no delete against `bookings` anywhere. `finalizeBooking.ts` creates booking + items in one transaction via `create_booking_with_items` and, on failure, calls `parkForReview` instead of deleting.
- **Atomic finalize is live.** The RPC exists in the database and is the only creation path in the code.
- **No recurrence.** Zero `needs_review` bookings, zero `failed` webhook events, no 4xx/5xx edge-function log entries in the retained window, and no 22000 range errors — the `CHECK` constraint on `bookings` plus the pre-insert validation now block the inverted-range case that caused the original bug.

Safe to dismiss.

## Implementation order (on approval)

1. **Database migration:** hard-delete audit trigger on `bookings` + lookup indexes for reconciliation and the stuck-`processing` watchdog.
2. **`payments-webhook`:** whole-handler try/catch, stale-claim takeover, heartbeat, watchdog alert on stuck rows.
3. **`stripe-reconcile`:** exclude sessions whose booking was deliberately deleted (from the audit log), report them separately, and surface stuck webhook claims.
4. **Weekend range:** shared `rentalEndDate` helper used by both checkout pre-check and finalize, then the 2026-09-05 verification query.
5. Nothing for #3 — dismiss.

