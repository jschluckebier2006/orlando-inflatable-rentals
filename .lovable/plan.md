## Goal

When a customer enters their event zip in the checkout form, the matching delivery fee from your zone list is auto-applied — visible on the order summary on the payment step, taxed at 7%, and charged through Stripe. Out-of-area or "Call to book" zips block checkout with a "Call (407) 497-1840" message.

## How it'll work for the customer

1. **Step 2 (contact/address):** as soon as a valid 5-digit zip is typed, a small badge appears under the zip field:
   - Free zone → green "Free delivery to {City}"
   - Paid zone → blue "{City} delivery fee: $50.00"
   - Call-to-book or unknown → red "We can't book this zip online. Please call (407) 497-1840" + Confirm button disabled
2. **Step 3 (payment):** order summary shows a new "Delivery fee" line above tax. Tax is recomputed on (subtotal + waiver + delivery). Stripe charges the new total (or the $5 deposit, depending on chosen plan).
3. **Confirmation email + admin booking record:** stores the zone name, delivery fee, and that it was included in tax.

## Files I'll create or change

### New: `src/data/deliveryZones.ts`
Single source of truth — easy to edit later. Just say "change 32833 to $25" and I update one line.
```ts
export type ZoneStatus = "free" | "paid" | "call";
export interface DeliveryZone { zip: string; city: string; fee: number; status: ZoneStatus; }
export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  "32826": { zip:"32826", city:"Alafaya", fee:0, status:"free" },
  "32828": { zip:"32828", city:"Avalon Park / Waterford Lakes", fee:50, status:"paid" },
  // ...all 41 zips from your PDF...
  "32820": { zip:"32820", city:"Bithlo", fee:0, status:"call" },
  "32709": { zip:"32709", city:"Christmas", fee:0, status:"call" },
};
export function lookupZone(zip: string): DeliveryZone | null { /* normalize + lookup */ }
```

### New: `src/lib/pricing.ts` — extend `computeBreakdown`
Add an optional `deliveryFee` arg. Tax is computed on `subtotal + waiver + deliveryFee` (FL-compliant). Existing callers without the arg keep working (defaults to 0).

### Edit: `src/components/booking/CheckoutModal.tsx`
- Add `<ZipFeeBadge zip={form.event_zip} />` directly under the zip input on step 2.
- Add `deliveryFee` + `zoneCity` to local state, derived from `lookupZone(form.event_zip)`.
- Block step-3 advance (`canSubmit`) when status is `call` or zone is null.
- Pass `deliveryFee` and `zoneCity` into `<PaymentStep />`.
- Include `delivery_fee`, `delivery_zone_city`, and `event_zip` in the `submit-booking` payload (already sent).

### Edit: `src/components/booking/PaymentStep.tsx`
- Accept `deliveryFee`, `zoneCity` props.
- Recompute breakdown with delivery fee included; render new "Delivery fee — {City}" line in the summary, or "Free delivery to {City}" when fee is 0.
- Pass `delivery_fee` in the `create-booking-checkout` body.

### Edit: `supabase/functions/create-booking-checkout/index.ts`
- Add `delivery_fee` (z.number().nonneg, max 200) and `delivery_zone_city` (string, optional) to the schema.
- Server-side recompute: `tax = (subtotal + waiver + deliveryFee) * 0.07`; `total = subtotal + waiver + deliveryFee + tax`.
- Server-side guard: re-lookup the zip against a copy of the zone table (also lives in the function) and **reject** if status is `call` or unknown — defends against client tampering.
- Stash `delivery_fee` and `delivery_zone_city` into `pending_bookings.payload` so the webhook can persist them.

### Edit: `supabase/functions/payments-webhook/index.ts` + `supabase/functions/submit-booking/index.ts`
- Persist `delivery_fee` and `delivery_zone_city` onto the `bookings` row (new columns — see migration below).
- Include "Delivery fee — {City}: $X.XX" in the customer/admin email line items.

### Database migration
Add two nullable columns to `bookings`:
- `delivery_fee numeric not null default 0`
- `delivery_zone_city text`

(Existing rows just get `0` / `null`. No data loss.)

### Edit: `src/components/admin/BookingFormModal.tsx` + admin booking list
Display the delivery fee + zone city as a read-only line so you can see what each customer was charged.

## Out of scope

- No admin UI for editing zones (you chose "code file"). I update on request.
- No distance/Google Maps API — pure zip lookup, instant, $0 cost.
- No change to the cart drawer (fee is unknown until address is entered, by design).
- No change to existing payment plans, deposit, or cancellation policy.

## Validation when I'm done

- Type a free zip (32801) → green badge, no fee on summary, tax unchanged.
- Type a $50 zip (32828) → blue badge, "$50.00 Delivery fee" line, tax = (sub + waiver + 50) × 0.07.
- Type a $75 zip (34786) → same with $75.
- Type 32820 (Bithlo) → red "call to book" message, Confirm button disabled.
- Type 99999 → red "we don't service this area" message, button disabled.
- Server tampering test: call `create-booking-checkout` with a valid zip but `delivery_fee: 0` → server overwrites with the real fee (defense in depth).
