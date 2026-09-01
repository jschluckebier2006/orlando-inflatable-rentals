# Root cause report + remediation plan: paid checkouts losing their booking

## 1. The exact database error

It is **not** a numeric overflow. The raw Postgres error is:

```
code: 22000
message: range lower bound must be less than or equal to range upper bound
```

- **Where it is raised:** the `prevent_double_booking()` trigger that fires `BEFORE INSERT ON public.booking_items`. It builds `daterange(b.event_date, coalesce(b.event_end_date, b.event_date), '[]')` over *other* bookings, plus the same construct over `inventory_blackouts` and `global_blackouts`.
- **Offending table/columns:** `public.bookings.event_date` / `public.bookings.event_end_date`.
- **Offending row (verified by query):**

```text
booking id       93fa2306-242b-4a1e-8845-38b5167e7761
customer         riverajordan91@gmail.com
event_date       2026-08-29   <-- lower bound
event_end_date   2026-08-22   <-- upper bound (BEFORE the start)
status           confirmed    <-- so the trigger scans it every time
```

No inverted rows exist in `global_blackouts` or `inventory_blackouts` — this single booking row is the poison pill. Because its status is `confirmed`, **every** subsequent `booking_items` insert scans it and dies with 22000. That is why the failures are continuous rather than sporadic.

Most likely origin: a reschedule/edit path that wrote `event_date` forward without moving `event_end_date`. `RescheduleDialog.tsx:95` and `BookingFormModal.tsx:248-251` both write the pair, and neither validates `end >= start` — nor does the table have a CHECK constraint.

## 2. The code that creates the booking and then deletes it

`supabase/functions/_shared/finalizeBooking.ts`

- lines 157-160 — insert the `bookings` row (payment already captured at this point)
- lines 188-194 — build `booking_items` rows
- line 195 — `insert(itemRows)` → this is what raises 22000
- **line 198 — `await supabase.from("bookings").delete().eq("id", bookingId);`** deletes the paid booking
- line 199 — returns `{ status: "error" }`

`supabase/functions/payments-webhook/index.ts`

- line 53 — calls the finalizer
- lines 54-56 — `status === "error"` → **HTTP 500**, so Stripe retries, and each retry repeats create → fail → delete.

There is no transaction: booking insert, items insert, pending cleanup, deposit payment row and emails are five separate round trips.

## 3. Error inventory — what is and is not recoverable

The counts "10 errors / 3 webhook 500s" come from the monitoring finding's log window. **Per-error timestamps and PaymentIntent IDs are not retrievable from this project's data:** the analytics log store returns no rows for the period (retention has rolled past it), and `pending_bookings` is now **empty** because the hourly `pg_cron` purge deletes rows older than 6 hours — which destroyed the cart payloads for exactly the sessions that failed.

What is still on record in `email_send_log` — abandoned-cart alerts for checkout sessions that never became a booking (confirmed: no `bookings` row exists for any of these session IDs):

| Alert sent (UTC) | Stripe Checkout Session | Booking exists? |
|---|---|---|
| 2026-09-01 00:30:05 | `cs_live_a1yfk72UTPk2wAgRVLLe3X4eMmrpnMXpkGuEerveIzJK0QFpXeG2PpGDMP` | No |
| 2026-09-01 00:25:04 | `cs_live_a1HDww3XChYAL0n306jWGbY2nHPXF5tOqsFdJq7H5SOGM4ySv130Yokw5M` | No |
| 2026-08-21 23:50:05 | `cs_live_a13B3teOZuLojhZUI4vIHV8oaOOTUiDtzhbfv1voElNKHs8Z6MrKaNMSTs` | No |

The last booking that finalized successfully was **2026-08-25 20:24** (tmcculley@mcculleyconstruction.com). Every paid checkout after that date is suspect.

`cvstrickland05@gmail.com` appears **nowhere** in `bookings`, `customers`, or `email_send_log` — consistent with a paid checkout whose booking was created and then deleted, and whose pending row was purged.

**The authoritative list of orphaned payments can only come from Stripe**, matching `succeeded` PaymentIntents against `bookings.stripe_payment_intent_id`. That is step 1 of the implementation below — I did not run it in plan mode.

## 4. Is the malformed value producing wrong deposits? No.

$5.45 is not a bug and is not related. `supabase/functions/_shared/pricing.ts:5` defines `DEPOSIT_CHARGE = 5.45` (with `DEPOSIT_NET = 5.00`): Checkout deliberately charges a **flat $5.45 reservation deposit today**, and the rest becomes `balance_due`, collected later by cash or by the `admin-charge-balance` off-session charge. Verified in live data: e.g. booking `a25d02f4` — total $315.56, paid $5.45, balance $310.11. The 22000 error is a date-range failure inside a trigger; it never touches the money math, which is computed before insert by `computeBreakdown()`.

## 5. Why the abandoned-cart alert fired for a paying customer

`supabase/functions/scheduled-email-runner/index.ts:30-63`: the job selects `pending_bookings` older than 30 minutes and skips a row **only if a `bookings` row exists for that session**. Since the finalizer deleted the booking, no row existed — so a genuinely paid session looked identical to an abandoned one. The job never consults `payment_status`, `stripe_payment_intent_id`, or Stripe. Those alerts are actually your only surviving evidence of the lost orders.

---

# Proposed fix (not implemented)

### Step 0 — stop the bleeding (immediate, one migration)
Correct booking `93fa2306` so `event_end_date >= event_date`, then add `CHECK (event_end_date >= event_date)` on `bookings` and `CHECK (end_date >= start_date)` on `inventory_blackouts` and `global_blackouts`. Additionally harden the three trigger functions to use `least()/greatest()` when building `daterange`, so one bad legacy row can never again take down all checkouts.

### Step 1 — recover the lost customers
A one-off admin-triggered reconciliation run that lists `succeeded` Stripe PaymentIntents/Checkout Sessions for the last 60 days, left-joins against `bookings.stripe_payment_intent_id` / `stripe_session_id`, and outputs email, amount, intended event date and session ID for every unmatched charge — including the cvstrickland05 order. Output goes to a new `needs_review` records set so the bookings can be rebuilt by hand from the Stripe session metadata.

### Step 2 — atomic finalize
Move booking + items creation into a single `SECURITY DEFINER` Postgres function (`finalize_booking(payload jsonb)`) so both inserts share one transaction. A trigger failure rolls back the items **and** the parent row automatically; the edge function stops doing manual compensating deletes.

### Step 3 — never delete a paid booking
Remove the `delete` at `finalizeBooking.ts:198`. On any post-payment failure, write the booking with `status = 'needs_review'` (new enum value) plus a `finalize_error` column holding the Postgres message, record the payment, and fire a loud admin alert email. The customer's money is never separated from a record.

### Step 4 — validate before insert
Range-check `event_date`/`event_end_date` (and the item set) in `create-booking-checkout` and in the finalizer, returning a clear 400 with a readable message instead of letting the trigger produce a 500.

### Step 5 — idempotent webhook
Key on PaymentIntent ID: add a unique index on `bookings.stripe_payment_intent_id`, plus a `webhook_events` table keyed by Stripe `event.id` so replays short-circuit. Return **200** for terminal, non-retryable failures (booking parked in `needs_review`) and reserve 500 for genuinely transient errors, so Stripe retries can't loop.

### Step 6 — standing reconciliation job
A daily `pg_cron` job running the Step 1 logic; any succeeded charge with no matching booking raises a `needs_review` record and an admin email. Also stop purging `pending_bookings` at 6 hours for sessions that have a payment attempt — retain those 30 days.

### Step 7 — suppress false abandoned-cart alerts
In `scheduled-email-runner`, skip a pending row when a booking exists for the session **or** the Stripe session/PaymentIntent shows a payment attempt/succeeded status, or a `needs_review` record references it.

### Technical notes
- Files touched: `supabase/functions/_shared/finalizeBooking.ts`, `payments-webhook/index.ts`, `check-booking-status/index.ts`, `create-booking-checkout/index.ts`, `scheduled-email-runner/index.ts`, plus new migrations and a small admin UI surface for `needs_review`.
- Steps 0 and 1 are the urgent ones; 2-7 are the durable fix and can follow in the same pass.
