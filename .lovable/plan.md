# Paid checkouts losing their booking — two-pass remediation

Root cause (verified): booking `93fa2306-242b-4a1e-8845-38b5167e7761` (riverajordan91@gmail.com) has `event_date 2026-08-29` / `event_end_date 2026-08-22` — an inverted date range. It is `confirmed`, so the `prevent_double_booking()` trigger on `booking_items` builds `daterange(2026-08-29, 2026-08-22)` on **every** new checkout and raises Postgres `22000: range lower bound must be less than or equal to range upper bound`. `finalizeBooking.ts:195-199` then deletes the just-created paid booking and `payments-webhook/index.ts:54-56` returns 500, so Stripe retries into the same failure. No inverted rows exist in `global_blackouts` or `inventory_blackouts`. The $5.45 deposit is unrelated — it is the intentional flat `DEPOSIT_CHARGE` constant.

---

## PASS 1 — emergency (this pass only)

**1. Reconciliation first, before any schema change.**
Run a read-only Stripe reconciliation over Aug 20 2026 → now: list succeeded PaymentIntents and their Checkout Sessions, left-join against `bookings.stripe_payment_intent_id` and `bookings.stripe_session_id`, and output every unmatched charge with customer email, name, phone, amount, event date, and the complete session metadata (items, delivery address, duration, notes) needed to rebuild the booking by hand. Present that list in chat before touching anything.

**2. Flag the emergency calls.**
In that output, mark any orphaned charge whose event date is already past or falls within the next 7 days.

**3. Correct booking 93fa2306 — no silent guess.**
Pull its Stripe session metadata (`cs_live_a1OVxa32Me0m0ff09HwIJcVcczl6zFEoRKtkRhCJAIl7eJ1mQjIMcyHITF`) plus every `email_send_log` row for riverajordan91@gmail.com to determine the intended dates. If the original intent is determinable, restore it. If not, set `event_end_date = event_date` as a temporary unblock, flag the row `needs_review`, and report that so the customer can be called. Either way, state explicitly which path was taken.

**4. Step 0 migration, applied after the row is corrected.**
- `CHECK (event_end_date >= event_date)` on `bookings`
- `CHECK (end_date >= start_date)` on `inventory_blackouts` and `global_blackouts`
- Harden `prevent_double_booking()`, `prevent_double_booking_on_reactivate()`, `is_date_range_available()` and `get_booked_dates_for_products()` to build ranges with `least()/greatest()`, so one bad legacy row can never take down all checkouts again.
- Before applying, scan for any other row that would violate the new constraints and report it rather than letting the migration fail.

**5. Verify.**
Confirm checkout works end to end with a real test booking (create → finalize → items → booking row) before stopping.

---

## PASS 2 — durable fix (only after Pass 1 is reviewed and approved)

**Step 2 — Atomic finalize.** Move booking + items creation into one `SECURITY DEFINER` Postgres function so both inserts share a single transaction; remove the manual compensating delete.

**Step 3 — Never delete a paid booking.** On post-payment failure, persist the booking as `needs_review` with a `finalize_error` column holding the Postgres message, record the payment, and alert an admin loudly.

**Step 4 — Validate before insert.** Range-check `event_date`/`event_end_date` and the item set in `create-booking-checkout` and the finalizer, returning a clear 400 instead of a trigger-driven 500.

**Step 5 — Idempotent webhook, keyed by PaymentIntent.** *Amendment:* first audit `bookings.stripe_payment_intent_id` for NULLs and duplicates and report the findings, then choose the index shape (partial unique on NOT NULL, dedupe first if needed) rather than shipping a migration that fails. Add a `webhook_events` table keyed by Stripe `event.id`; return 200 for terminal failures parked in `needs_review` and reserve 500 for genuinely transient errors.

**Step 6 — Standing reconciliation.** Daily `pg_cron` job running the Pass 1 reconciliation logic; any succeeded charge with no matching booking raises a `needs_review` record and an admin alert. *Amendment:* retain `pending_bookings` for **30 days for every row that has a Stripe session ID**, not only those with a payment attempt — the 6-hour purge is what destroyed the evidence this time.

**Step 7 — Suppress false abandoned-cart alerts.** Skip a pending row when a booking exists for the session, a `needs_review` record references it, or Stripe shows a payment attempt/success.

**Step 8 (added) — Admin `needs_review` queue.** A visible queue in the admin UI listing every `needs_review` booking with its `finalize_error` text and the Stripe session/PaymentIntent, so these surface in the dashboard rather than only by email.

### Technical notes
- Pass 1 touches: one migration, one throwaway read-only Stripe reconciliation run. No app code changes.
- Pass 2 touches: `supabase/functions/_shared/finalizeBooking.ts`, `payments-webhook/index.ts`, `check-booking-status/index.ts`, `create-booking-checkout/index.ts`, `scheduled-email-runner/index.ts`, new migrations, and a new admin page/section for the review queue.
