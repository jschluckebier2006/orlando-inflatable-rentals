## Goal

Replace the single-item booking modal with a **shopping cart flow**. Customers add multiple inflatables/items to a cart, then check out once with a single date, delivery start time (8 AM–8 PM), and contact info. Double-booking prevention still applies per item per date.

## User flow

1. Browse rentals → click **Add to Cart** on each desired item (cart icon in header shows count).
2. Open cart drawer → review items, adjust quantities (capped at 1 per unique unit per day), remove items.
3. Click **Check Availability & Reserve** → checkout modal:
   - Step 1: Pick event date → system checks every cart item's availability; flags any conflicts with option to remove.
   - Step 2: Pick **delivery start time** (8:00 AM–8:00 PM, 30-min increments) and **pickup time** (same range, must be after start).
   - Step 3: Customer info + address + notes → submit.
4. Confirmation screen lists all reserved items + reference ID.

## Files to add

- `src/contexts/CartContext.tsx` — cart state in `localStorage`, `addItem`, `removeItem`, `clear`, `items[]`.
- `src/components/cart/CartDrawer.tsx` — slide-out (shadcn `Sheet`) listing items, totals, "Reserve" CTA.
- `src/components/cart/CartButton.tsx` — header icon + badge count, opens drawer.
- `src/components/booking/CheckoutModal.tsx` — replaces `BookingModal`. 3 steps as above. Uses new RPC for batch availability check.

## Files to edit

- `src/components/inventory/ProductCard.tsx` — change CTA from "Book Your Date" to **"Add to Cart"**; show "Added ✓" state briefly.
- `src/components/inventory/ProductGrid.tsx` — drop `BookingModal`; cards just call `addToCart`.
- `src/components/layout/Header.tsx` — mount `<CartButton />`.
- `src/components/layout/StickyBookButton.tsx` & `src/components/home/CTASection.tsx` & `HeroSection.tsx` — open `CheckoutModal` directly (no preselected product) for "Check Availability".
- `src/components/JotformModal.tsx` — keep shim, render `CheckoutModal` instead.
- `src/App.tsx` — wrap with `<CartProvider>`.

## Backend

**Migration:**
- New RPC `get_booked_dates_for_products(_product_ids text[])` returning `(product_id, event_date)` so the checkout can disable dates that conflict with **any** cart item.
- Add nullable `event_end_time text` column to `bookings` (pickup time).
- New table `booking_items` (id, booking_id FK, product_id, product_name, product_price) + unique partial index `(product_id, event_date)` on the parent booking's date — enforced via the existing date+product check moved to `booking_items`. Drop the old single-product columns? **No** — keep `bookings` row as the order header (customer info, date, times, status); move per-item rows to `booking_items`. Remove the partial unique index from `bookings` and recreate it on a view or via trigger that joins items to the parent booking date.

Actual approach (simpler): keep `bookings` as the **order header** without product fields, and add `booking_items(id, booking_id, product_id, product_name, product_price)`. Enforce no-double-booking via a **BEFORE INSERT trigger** on `booking_items` that checks for any active booking_item whose parent booking has the same `event_date` and `status in ('pending','confirmed')`.

Schema changes:
```sql
alter table bookings add column event_end_time text;
-- product_id/name/price become nullable (legacy); new orders use booking_items
alter table bookings alter column product_id drop not null;
alter table bookings alter column product_name drop not null;
alter table bookings alter column product_price drop not null;
drop index if exists bookings_unit_day_active;

create table booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_price numeric not null,
  created_at timestamptz not null default now()
);
alter table booking_items enable row level security;
create policy "anyone create booking items" on booking_items for insert with check (true);
create policy "admins read items" on booking_items for select to authenticated using (has_role(auth.uid(),'admin'));

-- trigger to prevent double booking across orders
create function prevent_double_booking() returns trigger ...
create trigger ... before insert on booking_items ...
```

**Edge function** `submit-booking/index.ts` — accept `items: [{product_id, product_name, product_price}]`, `event_end_time`, insert header + items in one transaction (use `.rpc` or sequential with cleanup). On conflict (P0001 from trigger), return list of conflicting product names.

## Admin page

- `src/pages/admin/Bookings.tsx` — join `booking_items`, render each booking with its item list and times.

## Time slots

Generate 30-min slots from `08:00` to `20:00` for both start and pickup. Validate `pickup > start`.

## Out of scope

- Stripe deposits (still phase 2).
- Multi-day rentals.
- Per-item different dates (cart = one event date).

