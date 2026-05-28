## Goal

Change the sales tax rate from 7% to 6.5% everywhere it surfaces — live DB value (source of truth), code-side fallbacks, and all "7%" display strings.

## Where tax lives today

Tax rate is **live-editable** via the admin Settings page and stored in `public.app_settings.tax_rate` (currently `0.07`). Both the React app (`src/lib/appSettings.ts`) and edge functions (`supabase/functions/_shared/settings.ts`) hydrate from that row. The hardcoded `0.07` values in code are only fallbacks used if the DB read fails. All breakdown math flows through `computeBreakdown()` (client + edge) which already reads the live rate — so once the DB is updated, totals recalculate automatically.

## Changes

### 1. Database (single migration)
- `UPDATE public.app_settings SET tax_rate = 0.065 WHERE id = 1;`

### 2. Code-side fallback defaults (0.07 → 0.065)
- `src/lib/pricing.ts` line 39 — `TAX_RATE` constant
- `src/lib/appSettings.ts` line 18 — `DEFAULTS.taxRate`
- `supabase/functions/_shared/settings.ts` line 18 — `DEFAULTS.taxRate`

### 3. Display strings ("7%" → "6.5%")
- `src/components/cart/CartDrawer.tsx` line 95 — "+7% sales tax" footer note
- `src/components/booking/PaymentStep.tsx` line 165 — "Sales Tax (7%)" row
- `src/components/booking/CheckoutModal.tsx` line 501 — "Sales Tax (7%)" row
- `src/components/admin/BookingFormModal.tsx` line 426 — "Sales Tax (7%)" row

### 4. Admin BookingFormModal recalculation
`src/components/admin/BookingFormModal.tsx` imports the static `TAX_RATE` constant (line 13) and uses it directly at line 204 (`taxAmount` calc) and line 258 (persists `tax_rate` to the booking row). Bumping the constant in step 2 covers this — no behavioral change beyond the new rate.

## Out of scope
- Existing `bookings.tax_rate` rows (historical bookings keep their original rate — correct behavior).
- Admin Settings UI (already DB-driven; will display 6.5% after step 1).
- `get_booked_dates_for_products` and all booking-availability functions — untouched.

## Verification
- Confirm migration applied: `SELECT tax_rate FROM app_settings WHERE id = 1;` returns `0.065`.
- Spot-check cart drawer footer reads "+6.5% sales tax" and Checkout/Payment step shows "Sales Tax (6.5%)" with recomputed amounts.
