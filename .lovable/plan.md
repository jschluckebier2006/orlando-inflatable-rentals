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
No. Since 2026-09-01 there are zero new `bookings`, zero `needs_review` rows, and exactly one `webhook_events` row (completed). There has been no live checkout traffic since the deploy, so no order has been swallowed.

### Proposed fix (implement first)
1. **Wrap the whole handler in try/catch** in `payments-webhook`. Any thrown error marks the row `failed` with the message and returns 500 so Stripe retries into real reprocessing.
2. **Expire stale claims.** Treat a `processing` row older than 5 minutes as reclaimable: on a duplicate hit, if `status = 'processing'` and `updated_at < now() - 5 min`, take the claim over (atomic conditional UPDATE) and reprocess instead of answering "duplicate".
3. **Watchdog alert.** Extend the daily reconcile cron (and add a short-interval check) to find `webhook_events` rows stuck at `processing` for more than 10 minutes, park the affected session via the existing `needs_review` path, and email admins. A stuck marker must never sit silent.
4. **Heartbeat.** Update `updated_at` when finalize starts, so the age test measures real staleness.
5. **Reconciler refinement.** Record hard-deleted booking session IDs (a small `deleted_bookings` ledger or an audit-log entry on delete) so a deliberately removed booking stops re-alerting as a lost order every morning.

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
Change `spanDays` for `weekend` from 2 to 1 so the pre-check range is identical to the range finalize writes, and add a shared helper so the two files can never drift again.

## 3. "Paid bookings fail to finalize — booking is deleted" — STALE

Confirmed stale on all three checks:
- **Compensating delete is gone.** A search across `supabase/functions` finds no delete against `bookings` anywhere. `finalizeBooking.ts` creates booking + items in one transaction via `create_booking_with_items` and, on failure, calls `parkForReview` instead of deleting.
- **Atomic finalize is live.** The RPC exists in the database and is the only creation path in the code.
- **No recurrence.** Zero `needs_review` bookings, zero `failed` webhook events, no 4xx/5xx edge-function log entries in the retained window, and no 22000 range errors — the `CHECK` constraint on `bookings` plus the pre-insert validation now block the inverted-range case that caused the original bug.

Safe to dismiss.

## Implementation order (on approval)

1. Webhook crash recovery: try/catch, stale-claim takeover, heartbeat, stuck-`processing` watchdog alert, reconciler awareness of deliberately deleted bookings.
2. Weekend `spanDays` off-by-one plus shared range helper.
3. Nothing for #3.
