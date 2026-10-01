# Fix both monitoring findings

## Finding 1 — Paid checkout stuck in review (critical) — resolve as stale, no code change

Verified before writing this plan:

- The live database function `create_booking_with_items` is already the corrected, schema-aware version: it builds the column list from the real table schema, drops unknown keys, and lets column DEFAULTs fill anything the payload omits. A new `NOT NULL DEFAULT` column (like `archived`) can no longer break it.
- That corrected function already exists in the repo as migration `20260903152754_...sql` — the finding's claim that "the fix did not apply" is outdated. The broken version it cites (in the Sept 1 migration) is superseded by the Sept 3 migration, which is how migrations work.
- No bookings are currently stuck in `needs_review`, and both recent paid checkouts (Ryan Shaughnessy, Lyndsey Sutherland) finalized normally.

Action: claim the finding, verify once more in build mode, then resolve it as **stale** with that evidence. No code changes.

## Finding 2 — No way to record a balance on some part-paid bookings (medium) — fix in the edit form

The problem, confirmed in the code: the "Amount paid" field is permanently disabled on any booking that has a payment, and the "Mark cash collected" shortcut only appears for cash-on-delivery bookings. For a deposit-paid card booking (without a saved card) or an "Other" payment-method booking, the banner literally says "record this payment manually using the form below" — but that field is disabled. Staff are stuck.

The fix (in `src/components/admin/BookingFormModal.tsx` only):

- In the balance-pending banner's fallback branch (payment method is "Other", or card without a saved card), replace the dead-end sentence with a real **"Record payment"** button that opens the existing `RecordPaymentDialog`, pre-filled with the outstanding balance.
- The `RecordPaymentDialog` is already mounted on this form; it records into `booking_payments` (cash, check, external card, "Stripe payment already captured" with a PaymentIntent ID, or emails a Stripe payment link). A database trigger then recomputes `amount_paid`, `balance_due`, and `payment_status` on the booking automatically.

Why this approach fits your money rules:

- It **never touches pricing**. The locked fields stay locked; re-pricing still requires the separate re-price confirmation.
- The payment goes through one canonical path that writes a payment row and logs activity, instead of a raw edit to "Amount paid".
- The disabled "Amount paid" input stays disabled — that is intentional under the money-lock rule; the dialog is the way to record money.

## Verification

- Build clean; typecheck passes.
- Playwright against the admin preview: open a deposit-paid booking with no saved card, confirm the banner shows "Record payment", record a partial payment, and confirm the balance, payment status and activity entry update — with the total unchanged.
- Resolve finding 2 as **fixed** and finding 1 as **stale** in Project monitoring.
