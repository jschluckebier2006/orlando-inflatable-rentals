# Verification items + Pass 2 kickoff

## 1. The third abandoned-cart alert (cs_live_a1HDww3X…, 00:25 on 2026-09-01)

What the database shows now:

- Three abandoned-cart admin alerts exist since Aug 20: `cs_live_a13B3teO…` (Aug 21 23:50), `cs_live_a1HDww3X…` (Sep 1 00:25), `cs_live_a1yfk72U…` (Sep 1 00:30).
- No row in `bookings` references `cs_live_a1HDww3X…` — so it is not a silently-matched booking.
- The reconciliation run covered Aug 20 → now and lists every Stripe Checkout Session in that window whose `payment_status = "paid"` and has no booking. This session was inside the scanned window and did not appear, which means Stripe reported it as **not paid**.
- Its `pending_bookings` row is gone (6-hour purge), so the cart contents are unrecoverable.

This is strong evidence of a genuine abandonment, but it is inferred from an absence. Before Pass 2 code, run one direct read: retrieve `cs_live_a1HDww3X…` from Stripe and report its `payment_status`, `status`, `payment_intent` (if any) and the PaymentIntent's status, plus `customer_details`. If it returns `unpaid`/`expired` with no succeeded PaymentIntent, it is confirmed as a real abandonment. If it shows a succeeded payment, it is a third lost customer and gets the same rebuild treatment as the other two.

## 2. Name cross-reference on the 9/19 charge

Record both identities on the 9/19 charge (`pi_3U71gY0ozdYluEdQ1oeUBWrJ`): account/receipt email **cvstrickland05@gmail.com — Cynthia Strickland**, PaymentIntent billing name **Josh Strickland**. When the booking is rebuilt, put the customer name as `Cynthia Strickland` and add a note line: `Stripe billing name: Josh Strickland (pi_3U71gY0ozdYluEdQ1oeUBWrJ)`. Same note goes on the customer record so the two names stay linked.

## 3. Blocking 2026-09-06 and 2026-09-19

Product-level blocking is not possible yet — the item lists lived only in `pending_bookings` and were purged. Two options:

- **Company-wide block (available now):** add `global_blackouts` rows for 2026-09-06 and 2026-09-19. This stops all new online bookings on those dates. Existing bookings are untouched (there is already a confirmed booking on 9/6 — Amy Meeker — which stays valid), but any further online checkout on those dates is blocked.
- **Item-level block:** once you have Kiana's and Cynthia's item lists by phone, replace the global block with `inventory_blackouts` rows for just those items, so the rest of the fleet stays sellable on those two dates.

Recommendation: apply the global block now, swap to item-level as soon as the phone calls come in. Confirm and it goes in as a data change, no schema change.

## 4. Entering Kiana's booking with the deposit already paid

Do **not** send her through checkout again. Correct path:

1. Create the booking in the admin "New booking" form with the items, address, date and times collected by phone. Leave payment fields at default (unpaid).
2. Record the deposit that Stripe already captured — $5.45 against `pi_3U71gY0ozdYluEdQ1oeUBWrJ`.

Right now `RecordPaymentDialog` offers cash, check, card-external and "send Stripe link" — none of which represent an already-captured Stripe charge, and the admin form has no field for a PaymentIntent ID. Pass 2 adds that:

- A new payment method option **"Stripe payment already captured"** in `RecordPaymentDialog`, with the PaymentIntent ID as the reference. It writes a `booking_payments` row with `method = 'stripe_deposit'`, and the existing recompute trigger sets `amount_paid`, `balance_due` and `payment_status` correctly — same mechanism the automated path uses, so no phantom balance.
- Selecting that method also writes `stripe_payment_intent_id` (and `stripe_customer_id` when resolvable) onto the booking, so the charge is linked and future reconciliation runs stop flagging it.

Net effect for Kiana: total from her rebuilt item list, $5.45 credited, balance due = total − 5.45, payment status `deposit_paid`. No second charge.

## Pass 2 (unchanged from the approved plan, in order)

- **Step 2 — Atomic finalize.** Booking + items created inside one `SECURITY DEFINER` function so a partial failure rolls back; the compensating delete is removed.
- **Step 3 — Never delete a paid booking.** On post-payment failure persist as `needs_review` with a `finalize_error` column, record the payment, alert admin.
- **Step 4 — Validate before insert.** Range-check dates and items in `create-booking-checkout` and the finalizer; return a clear 400, not a trigger-driven 500.
- **Step 5 — Idempotent webhook by PaymentIntent.** First audit `stripe_payment_intent_id` for NULLs and duplicates and report before choosing the index shape. Add a `webhook_events` table keyed by Stripe `event.id`; 200 for terminal failures parked in `needs_review`, 500 only for transient errors.
- **Step 6 — Standing reconciliation.** Daily `pg_cron` job; any succeeded charge without a booking raises `needs_review` + admin alert. `pending_bookings` retention extended to **30 days for every row with a Stripe session ID**.
- **Step 7 — Suppress false abandoned-cart alerts.** Skip a pending row when a booking exists, a `needs_review` record references it, or Stripe shows a payment attempt.
- **Step 8 — Admin `needs_review` queue** in the dashboard showing `finalize_error`, session and PaymentIntent.

Plus the two items above: the deposit-already-captured payment method, and the name cross-reference note.

### Technical notes

Files touched: `supabase/functions/_shared/finalizeBooking.ts`, `payments-webhook`, `check-booking-status`, `create-booking-checkout`, `scheduled-email-runner`, `stripe-reconcile` (one targeted session lookup), `src/components/admin/RecordPaymentDialog.tsx`, a new admin review-queue view, and migrations for `finalize_error`, `needs_review` status, `webhook_events`, and the cron/retention change.
