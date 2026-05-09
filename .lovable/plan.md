# Storefront → Database Inventory

## Current state
- DB `inventory_items` is fully seeded (37 rows across 7 categories) but `inventory_images` is empty and `primary_image_url` is null on every row.
- Each row has `legacy_image` set to the bundled webp filename (e.g. `15ft-tropic-shock-water-slide.webp`) so we can keep the existing visuals working until admins upload new photos.
- The whole storefront still imports from `src/data/inventory.ts` (a hand-curated array of `Product` with bundled image imports). 16 files consume it: category pages, `ProductGrid`, `ProductCard`, `CartContext`, all `CategoryCarousel`s, `PopularRentalsSection`, plus admin `BookingFormModal` and `RescheduleDialog`.

## Goal
Every public-facing list and detail (and the admin booking dialogs) reads live data from `inventory_items` + `inventory_images`. The in-memory product array is removed. Images resolve in this priority order: `primary_image_url` → first row in `inventory_images` (by `sort_order`) → bundled webp matched from `legacy_image`.

## Approach

### 1. New runtime inventory module (`src/lib/inventory.ts`)
- Re-export the `Product` / `ProductCategory` types so existing imports keep compiling (with a deprecation comment on `src/data/inventory.ts` re-export shim).
- `loadInventory()` — single Supabase query joining items with their images, returns a normalized `Product[]` shaped exactly like today's array. Cached in-module after first call (with a `refreshInventory()` escape hatch for the admin tabs).
- Resolve images via a Vite `import.meta.glob('/src/assets/inventory/*.webp', { eager: true, as: 'url' })` lookup keyed on the `legacy_image` filename. Items with neither a DB image nor a known legacy file fall back to a generic placeholder so the grid never breaks.
- Helpers: `useInventory()` React hook (returns `{ products, loading, error }` via `useState`/`useEffect`), plus category helpers `useWaterSlides()`, `useBounceHouses()`, etc., that filter the cached list and stay reactive when realtime updates fire.
- Optional realtime: subscribe to `postgres_changes` on `inventory_items` so admin edits propagate live to open browser tabs.

### 2. Refactor consumers
- Category pages (`WaterSlideRentals`, `BounceHouseRentals`, `BounceSlideComboRentals`, `ObstacleCourseRentals`, `InteractiveGameRentals`, `ConcessionRentals`, `TableChairRentals`): swap `getX()` for the matching hook; render `<ProductGrid loading=... />` skeletons while loading.
- Home: `AllCategoryCarousels` and `PopularRentalsSection` use `useInventory()` once and slice client-side.
- `CategoryCarousel` / `CategoryCard` / `ProductGrid` / `ProductCard`: keep `Product` shape, no behavior change.
- `CartContext`: switch the type import to `@/lib/inventory`. No logic change (cart already snapshots `id/name/price/image`).
- Admin `BookingFormModal` and `RescheduleDialog`: replace the static `products` import with `useInventory()` so newly added items show up immediately.

### 3. Hide inactive items
Filter `active = true` (already a column) from the public list; admin tools see all rows.

### 4. Cleanup
- Delete the hard-coded array body from `src/data/inventory.ts`; keep the file as a thin re-export of `Product` and `ProductCategory` types from `src/lib/inventory` to avoid touching every import path in this pass. (Future cleanup task can move all imports to `@/lib/inventory` and delete the shim.)
- Remove the dozens of `import x from "@/assets/inventory/..."` lines — the glob handles resolution.

## Out of scope
- Admin uploading new product images (already works in `InventoryDetail`).
- Backfilling `primary_image_url` from `legacy_image`. The fallback chain handles it; admins can upload real photos when ready and the storefront will switch over automatically.
- Pricing logic, cart UI, checkout flow.

## Risks / verifications
- Verify the glob filenames match every `legacy_image` value (one quick SQL check after the change: `select id, legacy_image from inventory_items where legacy_image not in (...)`). I'll run this during implementation.
- Confirm SSR-style usage isn't broken (project is SPA — no SSR — so safe).
- Build must stay green; Vite eager glob keeps images bundled exactly like today.
