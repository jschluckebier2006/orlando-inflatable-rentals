## Scope

Two UI changes plus minimal backend support so the new option can submit. No changes to existing payment options, deposit amount, pricing, or checkout flow.

## Changes

### 1. `src/components/booking/PaymentStep.tsx`

- Replace the muted text under the order total ("Pay any remaining balance in cash or card on delivery day.") with:
  > "A $50 non-refundable deposit is due today to secure your date. Your remaining balance will be charged to your card the week of your event, typically 2–5 days before your scheduled date — unless you select the cash on delivery option below."

- Widen the `choice` state union and `Option` component value type to include `"deposit_cash"`.

- Add a 4th `<Option>` below the Custom amount option:
  - value: `deposit_cash`
  - label: `$50 deposit + remaining balance cash on delivery`
  - amount: `$50.00`
  - sub: `Pay $50 now by card. Remaining balance is due in cash on the day of your event.`

- Update the existing helper paragraph about remaining balance (the one currently below the options) so that when `choice === "deposit_cash"` it reads:
  > "Your remaining balance of $[total - 50] is due in cash on the day of your event."
  Other choices keep the existing wording.

- `startPayment` already sends `payment_choice: choice`; treat `deposit_cash` like `deposit` for amount-charged purposes (charges $50). The submit button and `agreed`-gating logic stay as-is.

### 2. `supabase/functions/create-booking-checkout/index.ts`

Minimal edit so the new value validates and charges $50:

- Extend `payment_choice` enum to `["deposit", "full", "custom", "deposit_cash"]`.
- In the amount-selection branch, treat `deposit_cash` the same as `deposit` (charge `$50`, line label `"Non-refundable rental deposit (cash balance on delivery)"`). All other logic (totals, tax, waiver, stash, Stripe session) unchanged.

## Out of scope

- No changes to deposit amount, tax/waiver math, custom amount validation, embedded checkout, webhook, emails, or admin views.
- No changes to the cancellation policy block or "Confirm Reservation" button.
