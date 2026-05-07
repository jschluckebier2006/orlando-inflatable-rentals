## Add 7% sales tax + optional 10% damage waiver

### Pricing model
- **Subtotal** = items × duration multiplier (unchanged)
- **Damage waiver** = 10% of subtotal (optional, default ON)
- **Tax** = 7% of (subtotal + damage waiver)
- **Total** = subtotal + waiver + tax

### Database
New migration adds 4 nullable numeric columns to `bookings`:
- `damage_waiver_selected boolean default true`
- `damage_waiver_amount numeric default 0`
- `tax_rate numeric default 0.07`
- `tax_amount numeric default 0`

(`subtotal` and `total_amount` already exist.)

### Frontend — `CheckoutModal.tsx`
Add a Damage Waiver card between the items list and Continue button on **step 3** (review step), styled to match the screenshot:
- Bright blue header bar ("Damage Waiver" in white)
- White body with the exact copy from the screenshot
- Below the card: a `Select` defaulting to "Yes - Recommended (10%)" with alternative "No - Decline waiver"

Update the order summary block to break out:
```
Subtotal           $X.XX
Damage Waiver 10%  $X.XX   (only when selected)
Sales Tax 7%       $X.XX
Total              $X.XX
```

Pass `damage_waiver` boolean through to `PaymentStep` payload. `PaymentStep` recomputes `total` from subtotal + waiver + tax for the deposit/full/custom options (full = grand total incl. tax+waiver; custom min stays $50, max = grand total).

### Frontend — `CartContext.tsx`
No structural changes; totals shown in cart drawer remain "subtotal" (pre-tax). Add a small note "+ 7% sales tax at checkout" under the cart total.

### Frontend — `BookingFormModal.tsx` (admin)
Add same waiver toggle + tax line to the admin booking form summary so manually-created bookings match.

### Edge functions
**`submit-booking/index.ts`**
- Add `damage_waiver: z.boolean().default(true)` to schema
- Server-side recompute: `subtotal`, `damage_waiver_amount = subtotal * 0.10` (if selected else 0), `tax_amount = (subtotal + waiver) * 0.07`, `total_amount = subtotal + waiver + tax`
- Insert these onto the `bookings` row

**`create-booking-checkout/index.ts`**
- Add `damage_waiver: z.boolean()` to schema
- Recompute server-side total the same way
- Validate `payment_choice=full` against the new grand total; `custom_amount` max becomes grand total
- Stripe line item label updated when waiver is selected (keeps single line item; tax is folded into the amount, not handled by Stripe Tax — explicit per project, no managed_payments)
- `pending_bookings.amount_total` stores grand total so the webhook writes the correct `total_amount`

**`payments-webhook/index.ts`**
- Pass through `damage_waiver_selected`, `damage_waiver_amount`, `tax_rate`, `tax_amount`, `subtotal` from the stashed payload onto the created booking row

### Email templates (`_shared/email.ts`)
- Confirmation + admin notification email summary section gains Subtotal / Damage Waiver / Sales Tax / Total lines

### Out of scope
- Stripe automatic_tax / managed_payments (we're collecting a flat 7% FL state rate on the line-item amount; no jurisdiction logic)
- Refund/partial-refund handling for waiver

### Files touched
- `supabase/migrations/<new>.sql` (new)
- `src/components/booking/CheckoutModal.tsx`
- `src/components/booking/PaymentStep.tsx`
- `src/components/cart/CartDrawer.tsx` (small "+ tax at checkout" note)
- `src/components/admin/BookingFormModal.tsx`
- `supabase/functions/submit-booking/index.ts`
- `supabase/functions/create-booking-checkout/index.ts`
- `supabase/functions/payments-webhook/index.ts`
- `supabase/functions/_shared/email.ts`
