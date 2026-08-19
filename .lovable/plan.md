# Add 20x20 High Peak Frame Tent (phone-reservation only)

Note: an existing project rule said "never add tents." This request replaces it — I'll update that memory when building.

## What you'll get

- A new **Tents** category with its own page at `/tent-rentals`, a homepage carousel card, and a tile on the All Rentals page.
- The **20x20 High Peak Frame Tent** product, marked as not bookable online.
- Its card looks identical to every other product card, but shows a compact spec table and a **"Call to Reserve"** button (phone icon, taps to dial 407-497-1840) instead of "Book Now".
- Product photos: the detail modal gets a **multi-photo gallery** (main image + thumbnail strip), so several tent photos uploaded from the admin all show.

## Product content (you enter this in the admin UI, not a migration)

Description (2–3 sentences, matching site tone): white high-peak frame tent with an elegant peaked silhouette; no center poles so the entire 400 sq ft floor is usable; free-standing frame sets up on grass or hard surfaces; ideal for weddings, graduations and backyard parties, with professional delivery and setup by our team.

Specs to enter (price shown once — the card's normal `$379 / day` line is hidden when specs include a Price row, so there is no duplicate):

```text
Price               $379 per day
Dimensions          20 ft x 20 ft (400 sq ft)
Seating Capacity    40 guests with tables / 67 without
Table Capacity      Six 6 ft rectangular banquet tables
```

## Reusable pattern (not a one-off)

Any product can be flagged phone-only or given a spec list — the tent is just the first to use it. Admin gets a "Bookable online" toggle and a spec editor so future items work the same way.

## Technical details

**Data model**
- Migration: add `bookable_online boolean not null default true` and `specs jsonb not null default '[]'` to `public.inventory_items`. Existing rows unaffected.
- `src/lib/inventory.ts`: extend `Product` with `bookableOnline?: boolean` (defaults true in `normalize`), `specs?: { label: string; value: string }[]`, and `images: string[]` (all `inventory_images` rows, primary first). Add `"tents"` to `ProductCategory`, `CATEGORY_LABELS`, `CATEGORY_LINKS`.
- Insert the tent row via migration (slug `20x20-high-peak-frame-tent`, `base_price 379`, `bookable_online false`, specs JSON, `stock_count 1`).

**UI**
- New `src/components/inventory/ProductSpecs.tsx`: 2-col `dl`, `text-xs`, muted left label / right-aligned value, `divide-y divide-border`, tight row padding. Rendered between description and CTA.
- `ProductCard.tsx`: card becomes `flex flex-col h-full` with the CTA in an `mt-auto` footer so equal-height grid alignment holds. When `bookableOnline === false`, render `<Button asChild variant="secondary">` wrapping `<a href="tel:+14074971840">` with a `Phone` icon, label "Call to Reserve", and the requested `aria-label`. Same size/min-height as Book Now; the anchor stops click propagation so it never opens the booking modal.
- `ProductDetailModal.tsx`: same CTA swap + specs table; thumbnail gallery when `images.length > 1`.
- `CartContext.addItem`: ignore products with `bookableOnline === false` (guardrail); `CategoryCard` tiles route through the same modal and inherit the CTA.

**Pages / routing**
- New `src/pages/TentRentals.tsx` modeled on `TableChairRentals.tsx` (hero → grid → SEO content), route in `App.tsx`, entry in `Rentals.tsx`, card in `AllCategoryCarousels.tsx`, nav/footer category links, and `public/sitemap.xml`.

**Admin**
- `InventoryDetail.tsx`: add `tents` to the category select, a "Bookable online" switch, and a repeatable label/value spec editor persisting to the new columns.
