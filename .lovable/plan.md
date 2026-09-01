# Verification items + Pass 2 kickoff

## 1. The third abandoned-cart alert (cs_live_a1HDww3X…, 00:25 on 2026-09-01)

What the database shows now:

- Three abandoned-cart admin alerts exist since Aug 20: `cs_live_a13B3teO…` (Aug 21 23:50), `cs_live_a1HDww3X…` (Sep 1 00:25), `cs_live_a1yfk72U…` (Sep 1 00:30).
- No row in `bookings` references `cs_live_a1HDww3X…` — so it is not a silently-matched booking.
- The reconciliation run covered Aug 20 → now and lists every Stripe Checkout Session in that window whose `payment_status = "paid"` and has no booking. This session was inside the scanned window and did not appear, which means Stripe reported it as **not paid**.
- Its `pending_bookings` row is gone (6-hour purge), so the cart contents are unrecoverable.

This is strong evidence of a genuine abandonment, but it is inferred from an absence. Before Pass 2 code, run one direct read: retrieve `cs_live_a1HDww3X…` from Stripe and report its `payment_status`, `status`, `payment_intent` (if any) and the PaymentIntent's status, plus `customer_details`. If it returns `unpaid`/`expired` with no succeeded PaymentIntent, it is confirmed as a real abandonment. If it shows a succeeded payment, it is a third lost customer and gets the same rebuild treatment as the other two.

## 2. Corrected charge pairing + name cross-reference

Corrected pairing (to be re-verified against the reconciliation output before any record is written — retrieve both PaymentIntents and their sessions from Stripe and confirm email, amount and session ID line up):

| Customer | Event date | PaymentIntent | Session |
| --- | --- | --- | --- |
| Kiana George | 2026-09-06 | `pi_3U71gY0ozdYluEdQ1oeUBWrJ` | `cs_live_a13B3teO…` |
| Cynthia Strickland (Stripe billing name Josh Strickland) | 2026-09-19 | `pi_3UAf5D0ozdYluEdQ1ruPUH6n` | `cs_live_a1yfk72U…` |

For the 9/19 record: account/receipt email **cvstrickland05@gmail.com — Cynthia Strickland**, PaymentIntent billing name **Josh Strickland**. Customer name goes in as `Cynthia Strickland`, with a note line `Stripe billing name: Josh Strickland (pi_3UAf5D0ozdYluEdQ1ruPUH6n)` on both the booking and the customer record so the two names stay linked.

## 3. Blocking 2026-09-06 and 2026-09-19

No global blackout — 9/6 is Labor Day Saturday with the promo running, so a company-wide block is off the table. Item-level only:

- **9/6, Kiana's item — matched:** `18' Tiki Plunge Dual Lane Water Slide`, item id **`tiki-plunge-18`** (slug `18-tiki-plunge-water-slide`, stock_count 1, active). It currently has no blackout rows at all. Add one `inventory_blackouts` row: `item_id = 'tiki-plunge-18'`, `start_date = end_date = 2026-09-06`, reason "Held for Kiana George — paid deposit pi_3U71gY0ozdYluEdQ1oeUBWrJ, booking being rebuilt by phone". With stock_count 1 this fully protects the unit; the rest of the fleet stays sellable for the promo weekend.
- **9/19, Cynthia's items:** blocked once you send the item list. Nothing applied on that date until then.

## 4. Entering Kiana's booking with the deposit already paid

Recovered from the abandoned-cart alert email: Kiana George — kianageorge23@gmail.com — 407-338-0568, event Sunday 2026-09-06, cart `18' Tiki Plunge Dual Lane Water Slide` $309.00, cart total $329.09, deposit captured $5.45 (`pi_3U71gY0ozdYluEdQ1oeUBWrJ`, session `cs_live_a13B3teO…`). Still needed by phone: delivery address and setup/pickup times.

Do **not** send her through checkout again. Correct path:

1. Create the booking in the admin "New booking" form with the recovered item and contact details plus the address and times from the callback. Leave payment fields at default (unpaid).
2. Record the deposit Stripe already captured — $5.45 against `pi_3U71gY0ozdYluEdQ1oeUBWrJ`.
3. Remove the `tiki-plunge-18` blackout row for 9/6 once the real booking exists, so the booking itself holds the date.



Right now `RecordPaymentDialog` offers cash, check, card-external and "send Stripe link" — none of which represent an already-captured Stripe charge, and the admin form has no field for a PaymentIntent ID. Pass 2 adds that:

- A new payment method option **"Stripe payment already captured"** in `RecordPaymentDialog`, with the PaymentIntent ID as the reference. It writes a `booking_payments` row with `method = 'stripe_deposit'`, and the existing recompute trigger sets `amount_paid`, `balance_due` and `payment_status` correctly — same mechanism the automated path uses, so no phantom balance.
- Selecting that method also writes `stripe_payment_intent_id` (and `stripe_customer_id` when resolvable) onto the booking, so the charge is linked and future reconciliation runs stop flagging it.

Net effect for Kiana: total from her rebuilt item list, $5.45 credited, balance due = total − 5.45, payment status `deposit_paid`. No second charge.

## Pass 2 (unchanged from the approved plan, in order)

- **Step 2 — Atomic finalize.** Booking + items created inside one `SECURITY DEFINER` function so a partial failure rolls back; the compensating delete is removed.
- **Step 3 — Never delete a paid booking.** On post-payment failure persist as `needs_review` with a `finalize_error` column, record the payment, alert admin.
- **Step 4 — Validate before insert.** Range-check dates and items in `create-booking-checkout` and the finalizer; return a clear 400, not a trigger-driven 500.
- **Step 5 — Idempotent webhook by PaymentIntent.** First audit `stripe_payment_intent_id` for NULLs and duplicates and report before choosing the index shape. Add a `webhook_events` table keyed by Stripe `event.id`; 200 for terminal failures parked in `needs_review`, 500 only for transient errors.
- **Step 6 — Standing reconciliation + durable cart snapshot.** Daily `pg_cron` job; any succeeded charge without a booking raises `needs_review` + admin alert. `pending_bookings` retention extended to **30 days for every row with a Stripe session ID**. In addition, `scheduled-email-runner` snapshots the full cart payload (name, email, phone, requested date, line items, total, session ID) into a durable `payload_snapshot jsonb` column on `email_send_log` at alert time — so even after any purge the alert record itself remains a complete, permanently recoverable copy.
- **Step 7 — Suppress false abandoned-cart alerts.** Skip a pending row when a booking exists, a `needs_review` record references it, or Stripe shows a payment attempt.
- **Step 8 — Admin `needs_review` queue** in the dashboard showing `finalize_error`, session and PaymentIntent.

Plus the two items above: the deposit-already-captured payment method, and the name cross-reference note.

### Technical notes

Files touched: `supabase/functions/_shared/finalizeBooking.ts`, `payments-webhook`, `check-booking-status`, `create-booking-checkout`, `scheduled-email-runner`, `stripe-reconcile` (one targeted session lookup), `src/components/admin/RecordPaymentDialog.tsx`, a new admin review-queue view, and migrations for `finalize_error`, `needs_review` status, `webhook_events`, and the cron/retention change.
