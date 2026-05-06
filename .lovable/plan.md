## Rental Duration & Pricing Tiers

Add three rental duration options applied **per order** (one choice for the whole cart), with multi-day availability blocking and clear pricing display.

### Pricing formulas (applied to each item's base price)
- **7-hour (1 day)** — base price (e.g. $499.00)
- **Overnight** — base × 1.25 (e.g. $623.75). Default pickup 8:00 AM next day.
- **Full Weekend** — base × 1.60 (e.g. $798.40). Saturday 8:00 AM delivery → Sunday 8:00 PM pickup.

### UX flow

**1. Cart drawer (`CartDrawer.tsx`)**
- Add a Duration selector (radio group) at the top of the drawer:
  - 7-Hour Rental — $X (base sum)
  - Overnight (+25%) — $Y
  - Full Weekend (+60%) — $Z
- Each option shows the recalculated cart total beside it.
- Default = `7-hour`. Selection stored in `CartContext`.

**2. Checkout step 1 — Date selection (`CheckoutModal.tsx`)**
- Show the same Duration selector above the calendar (editable). Help text explains what each means.
- Calendar disable logic depends on selection:
  - **7-hour**: disable any date where any cart item is booked (current behavior).
  - **Overnight**: disable date `D` if any cart item is booked on `D` OR `D+1`. Also disable if `D+1` is in the past… (n/a).
  - **Full Weekend**: only Saturdays selectable. Disable Saturday `S` if any cart item is booked on `S` or `S+1` (Sunday).
- For Overnight/Full Weekend, the "selected date" represents the **delivery date**.

**3. Checkout step 2 — Times**
- **7-hour**: keep current 8AM–8PM start + pickup dropdowns.
- **Overnight**: show start time dropdown only (8AM–8PM). Pickup auto-set to **next day 8:00 AM**, displayed read-only.
- **Full Weekend**: both times locked: Sat **8:00 AM** delivery, Sun **8:00 PM** pickup, displayed read-only.

**4. Checkout step 3 — Summary**
- Show duration label, date range, per-item price, multiplier, and grand total.

### Backend changes

**Migration** (schema + trigger updates):
- Add to `bookings`: `duration_type text not null default '7hour'` (values: `'7hour' | 'overnight' | 'weekend'`), `event_end_date date` (nullable; equals `event_date` for 7-hour, `event_date + 1` for overnight/weekend), `price_multiplier numeric not null default 1.0`.
- Add to `booking_items`: `unit_price numeric` (already have `product_price` = base; keep base, store `unit_price` = base × multiplier as the charged amount).
- **Replace** `prevent_double_booking` trigger to check the **date range** (`event_date` through `event_end_date`) overlaps any existing booking's range for the same `product_id` (status pending/confirmed). Uses a daterange overlap.
- **Replace** `get_booked_dates_for_products` RPC to expand each existing booking into one row per day in its date range, so the calendar greys out every blocked day.

**Edge function `submit-booking/index.ts`**:
- Accept new fields: `duration_type`, derived `event_end_date`, `price_multiplier`.
- Server-side enforce time defaults for overnight/weekend.
- Validate weekend selection is a Saturday.
- Insert booking with new fields; insert items with `unit_price = product_price * multiplier`.

**Admin (`pages/admin/Bookings.tsx`)**:
- Display Duration column and date range.
- Show item `unit_price` (charged) alongside base.

### Files

**Edit**: `src/contexts/CartContext.tsx`, `src/components/cart/CartDrawer.tsx`, `src/components/booking/CheckoutModal.tsx`, `src/pages/admin/Bookings.tsx`, `supabase/functions/submit-booking/index.ts`

**Add**: one migration file (alter tables, replace trigger function, replace RPC), `src/lib/pricing.ts` (helpers: `MULTIPLIERS`, `formatTier`, `computeEndDate`, `isSaturday`).

### Out of scope
- Stripe deposits (phase 2).
- Mixed durations across items in the same order.
- Custom multi-day rentals beyond the three tiers.
