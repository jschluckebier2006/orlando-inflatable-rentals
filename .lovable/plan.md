# Why paid bookings started failing (and the availability-check question)

## What actually broke

Confirmed from today's logs and the database, not a guess.

Nya Acree paid a deposit at 15:14 UTC today. Finalization failed with:

```text
null value in column "archived" of relation "bookings" violates not-null constraint
```

Her booking exists but is parked for review: `needs_review = true`, `status = pending`, **0 rental items**, deposit recorded. The cart is still in the pending-checkout table, so nothing is lost.

Root cause: on Sept 2 the `archived` column was added to bookings as `NOT NULL DEFAULT false`. The atomic booking-creation database function builds the new row from a fixed list of seeded defaults; any column not in that list comes through as NULL and the column default never applies. `archived` was never added to that list, so **every** online booking made after Sept 2 hits a NOT-NULL violation and gets parked. That is exactly why this "randomly" started after months of clean bookings — it's tied to the schema change, not to traffic.

This is a whole class of bug: the next column added with NOT NULL will break checkout the same way.

## On the failed availability check

Nothing in the last 30 days of function logs shows an availability-check failure, and the database permissions for that check are correct today. The 503 guard shipped earlier is a safety net, not a live symptom — there is no evidence customers are being blocked by it right now. If it does fire later, the log line it writes will name the exact cause.

## The fix

1. **Make the create function schema-proof.** Rewrite `create_booking_with_items` so it inserts only the columns actually present in the payload and lets Postgres apply each column's own default for everything else, instead of a hand-maintained defaults list. Adding a future column can then never break checkout.
2. **Repair Nya Acree's booking** — restore her rental item (18' Purple Hurricane Single Lane Water Slide, 2026-09-26) from the stored cart, clear `needs_review`, set status to confirmed, keep the recorded deposit and totals exactly as paid, and clear the pending-cart row. Confirmation emails are sent through the normal deduped path so she gets her confirmation.
3. **Verify** by simulating a booking insert through the repaired function against a test payload, then confirming her row shows the item, correct dates, and no review flag.

## Technical notes

- Migration replaces `public.create_booking_with_items` with a dynamic column-list insert derived from `information_schema.columns` intersected with the payload keys; `id`, `created_at`, `updated_at` still forced server-side; item insert and the double-booking trigger path unchanged.
- No edge function code change is required for the fix; `finalizeBooking.ts` already parks safely and will simply succeed once the function is corrected.
- No change to pricing, availability, or the 503 guard.
