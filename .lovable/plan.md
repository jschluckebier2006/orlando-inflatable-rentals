# Paid-in-full display cleanup + completed auto-archive

## Part 1 — Paid-in-full must never show a balance

### Audit results (verified now)

Database is currently clean: no booking has `amount_paid >= total_amount` while still carrying
`payment_status <> 'paid_in_full'` or `balance_due > 0`. The payment trigger that recomputes totals
whenever a payment row is added/edited/removed does set the status to paid correctly.

Surfaces checked and their state:

| Surface | State |
| --- | --- |
| Bookings list row (mobile + desktop) | Correct — balance only rendered when `balance_due > 0` |
| Booking detail / edit modal | **Wrong** — always renders a "Balance due" line, even at $0.00, and recomputes a balance locally instead of trusting the paid state |
| Booking edit modal — charge prompts | Partially right (gated on `payment_status === 'paid_in_full'`), but the gate uses only the stored status, not the amounts — a stale status re-exposes "Charge balance now" |
| Booking edit modal — save path | **Risk** — saving writes whatever `payment_status` the dropdown holds plus a locally computed `balance_due`, so an admin can save "amount paid = total" while status stays `deposit_paid`. This is the one way the database can drift out of sync |
| Calendar day sheet | No balance shown — fine |
| Customer record / customer list | Shows booking totals only, no balance — fine |
| Cancelled/archived table | Shows amount paid only — fine |
| Customer + admin emails (`_shared/email.ts` totals block) | Prints "Paid in full ✓" only when the stored `balance_due <= 0`; if that column is ever stale the email prints a false balance. Needs the same amount-based check |
| Dashboard totals | No balance aggregation exists — nothing to fix |

### Fixes

1. Introduce one shared truth for "is this paid": `amount_paid >= total_amount` (with a cent
   tolerance) OR `payment_status === 'paid_in_full'`. Use it everywhere instead of reading
   `balance_due` directly.
2. Booking edit modal: when paid, replace the "Balance due" line with "Paid in full" and
   "Paid $X of $X"; hide the charge-balance and cash-collection blocks.
3. Booking edit modal save: derive `payment_status` from the amounts on save (unpaid / deposit_paid /
   paid_in_full) so a manual edit can never persist a paid booking as partially paid, and clamp
   `balance_due` to 0 when paid.
4. Emails: base the "Paid in full ✓" line on the amounts, not the stored balance column.

No change to how payments are recorded; only display and derived-status consistency.

## Part 2 — Auto-archive completed bookings

The current Archive action sets `status = 'cancelled'` and stays untouched — it remains the path for
"this was called off". The new path is separate.

- `completed` already exists in the booking status list, so no schema change is needed there.
- New daily database job (alongside the existing daily jobs) runs at 8:00 AM ET and sets
  `status = 'completed'`, `archived = true` for every booking that is:
  - currently `pending` or `confirmed` (never touches cancelled ones),
  - paid in full (`amount_paid >= total_amount`, total greater than zero), and
  - finished (`event_end_date < today`).
  Payment fields, dates, and totals are left exactly as they are.
- The job is idempotent (already-archived rows are excluded) and bounded by the date filter.
- Each auto-archive writes an activity entry so the trail shows why a job moved.

### Visibility

The existing "Show archived" toggle will list both kinds, visually separated:

```text
Archived
  [Completed]  Sat Aug 15 · Marble Combo · Jane Doe · Paid $412.00      <- green
  [Cancelled]  Sat Aug 22 · Tiki Plunge  · John Roe · Refunded          <- muted/red
```

Completed-archived rows get a green "Completed" badge and their paid total; cancelled-archived rows
keep their current muted styling and cancel reason. Unarchive stays available for both.

### Confirmations

- **Revenue reporting:** nothing filters on `archived`, and `completed` bookings keep their
  `total_amount` / `amount_paid`, so archived-completed jobs still count. Marking them cancelled
  would have removed them — that is exactly why this path is separate.
- **Double-booking:** the availability functions match on `status in ('pending','confirmed')`, so a
  booking moved to `completed` no longer holds its dates. That is intentional and harmless here
  because the job only runs after the event has already ended — past dates are never bookable
  anyway. Future-dated bookings are never touched.

## Technical notes

- Part 1 touches `src/components/admin/BookingFormModal.tsx`, a small shared helper in
  `src/pages/admin/Bookings.tsx` (or `src/lib`), and the totals block in
  `supabase/functions/_shared/email.ts` (redeploy of the email-sending functions).
- Part 2 is a SQL-only `pg_cron` job plus a badge/section change in `src/pages/admin/Bookings.tsx`;
  the archived list query widens to include `status = 'completed' and archived = true`.
