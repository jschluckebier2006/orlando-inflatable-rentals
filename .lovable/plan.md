## Wrap up Stripe payment integration

The payment infrastructure (deposit/full/custom flow, embedded Stripe Checkout, webhook → booking) is wired. Three pieces remain to make it production-ready.

### 1. Admin Bookings: show payment info

Update `src/pages/admin/Bookings.tsx`:
- Extend the `Booking` type with `payment_status`, `amount_paid`, `balance_due`, `deposit_amount`, `total_amount`, `stripe_session_id`.
- Add a **Payment** column (between Status and Actions) showing:
  - Badge for `payment_status` (`unpaid` / `deposit_paid` / `paid_in_full` / `refunded`)
  - "Paid $X.XX of $Y.YY"
  - "Balance due: $Z.ZZ" (highlighted when > 0)
- Add a "Payment" filter option alongside the status filter (paid in full / deposit only / unpaid).

### 2. Deploy & smoke-test edge functions

- Deploy `create-booking-checkout` and `payments-webhook`.
- Verify `create-booking-checkout` returns a `clientSecret` for a sample payload (sandbox env, $50 deposit choice).
- Confirm `payments-webhook` is reachable. Webhook signature is validated by the Stripe SDK in code; sandbox webhook secret is already set.
- Check edge logs for any cold-start errors.

### 3. Cleanup / polish

- The `submit-booking` edge function and the legacy `handleSubmit` path in `CheckoutModal.tsx` are now bypassed (the cart goes straight from step 3 → PaymentStep → Stripe → webhook creates the booking). Remove the dead `handleSubmit` and unused imports from `CheckoutModal.tsx` to keep the file lean. Leave the `submit-booking` function deployed for now in case of fallback, but mark it unused in a code comment.
- `CheckoutReturn.tsx` currently shows success after a 1.5s timer regardless. Improve it to **poll the bookings table by `stripe_session_id`** (up to ~10s) so we only display "Confirmed" once the webhook actually wrote the row. If polling times out, show "Payment received — finalizing your reservation. We'll email confirmation shortly."

### Technical notes

- Webhook env: the handler reads `?env=sandbox|live` from the URL. The Stripe-registered webhook URLs already include this, so no change needed.
- No DB schema changes needed — `payment_status`, `amount_paid`, `balance_due`, `deposit_amount`, `stripe_session_id` already exist on `bookings`.
- Stripe sandbox test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Out of scope (ask before doing)

- Live-mode go-live / claiming the Stripe account.
- Refund tooling in admin UI.
- Email receipts beyond Stripe's built-in.
