# Paid checkouts losing their booking — two-pass remediation

Root cause (verified): booking `93fa2306-242b-4a1e-8845-38b5167e7761` (riverajordan91@gmail.com) has `event_date 2026-08-29` / `event_end_date 2026-08-22` — an inverted date range. It is `confirmed`, so the `prevent_double_booking()` trigger on `booking_items` builds `daterange(2026-08-29, 2026-08-22)` on **every** new checkout and raises Postgres `22000: range lower bound must be less than or equal to range upper bound`. `finalizeBooking.ts:195-199` then deletes the just-created paid booking and `payments-webhook/index.ts:54-56` returns 500, so Stripe retries into the same failure. The $5.45 deposit is unrelated — it is the intentional flat `DEPOSIT_CHARGE` constant.

**The intended dates are already determined — no guess needed.** `booking_activity` holds the reschedule record from 2026-08-20 14:06 UTC by orlandoinflatablesllc@gmail.com: *"Rescheduled from 2026-08-22 to 2026-08-29→2026-08-22"* with metadata `to_start: 2026-08-29, to_end: 2026-08-22`. It is a `7hour` (single-day) rental, and the post-event review email fired 2026-08-30 — confirming the event ran on **2026-08-29**. The reschedule wrote the new start but left the old end. Correct value: `event_end_date = 2026-08-29`. No `needs_review` flag required.

A scan confirms this is the **only** row in the database that would violate the new constraints (`bookings`: 1, `inventory_blackouts`: 0, `global_blackouts`: 0).

---

## PASS 1 — emergency, revised order

**1. Correct booking 93fa2306.** Set `event_end_date = '2026-08-29'` to match the reschedule's intended single-day event. Reported as "restored from evidence", not a temporary unblock.

**2. Step 0 migration** (applied after the row is corrected):
- `CHECK (event_end_date >= event_date)` on `bookings`
- `CHECK (end_date >= start_date)` on `inventory_blackouts` and `global_blackouts`
- `least()/greatest()` hardening on all four range-building functions: `prevent_double_booking()`, `prevent_double_booking_on_reactivate()`, `is_date_range_available()`, `get_booked_dates_for_products()` — so one bad legacy row can never take down all checkouts again.
- Also fix the reschedule write path (`RescheduleDialog.tsx`) so it can't produce an inverted pair.

**3. Verify checkout end to end** with a real test booking (create → finalize → booking + items rows), then remove the test data.

**4. Read-only Stripe reconciliation, Aug 20 2026 → now.** List succeeded PaymentIntents and their Checkout Sessions, left-joined against `bookings.stripe_payment_intent_id` and `stripe_session_id`. Present every unmatched charge in chat with event date, customer email, name, phone, amount, and the complete session metadata (items, delivery address, duration, notes) needed to rebuild the booking by hand.

**5. Flag emergencies** — any orphaned charge whose event date is already past or within the next 7 days.

---

## PASS 2 — durable fix (not started until the reconciliation output is reviewed)

**Step 2 — Atomic finalize.** Booking + items creation moves into one `SECURITY DEFINER` Postgres function so both inserts share a single transaction; the manual compensating delete goes away.

**Step 3 — Never delete a paid booking.** On post-payment failure, persist the booking as `needs_review` with a `finalize_error` column holding the Postgres message, record the payment, and alert an admin loudly.

**Step 4 — Validate before insert.** Range-check dates and the item set in `create-booking-checkout` and the finalizer, returning a clear 400 instead of a trigger-driven 500.

**Step 5 — Idempotent webhook keyed by PaymentIntent.** First audit `stripe_payment_intent_id` for NULLs and duplicates and report findings, then pick the index shape (partial unique on NOT NULL, dedupe first if needed) rather than shipping a migration that fails. Add a `webhook_events` table keyed by Stripe `event.id`; return 200 for terminal failures parked in `needs_review`, 500 only for transient errors.

**Step 6 — Standing reconciliation.** Daily `pg_cron` job running the Pass 1 logic; any succeeded charge with no matching booking raises a `needs_review` record and an admin alert. Retain `pending_bookings` **30 days for every row that has a Stripe session ID**, not only those with a payment attempt.

**Step 7 — Suppress false abandoned-cart alerts.** Skip a pending row when a booking exists for the session, a `needs_review` record references it, or Stripe shows a payment attempt/success.

**Step 8 — Admin `needs_review` queue.** A visible admin queue listing every `needs_review` booking with its `finalize_error` text and Stripe session/PaymentIntent, so these surface in the dashboard rather than only by email.

### Technical notes
- Pass 1: one data correction, one migration, one small frontend guard, one read-only Stripe reconciliation run.
- Pass 2: `finalizeBooking.ts`, `payments-webhook`, `check-booking-status`, `create-booking-checkout`, `scheduled-email-runner`, new migrations, and a new admin review-queue surface.
