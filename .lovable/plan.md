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
- Schema only — **no product insert in the migration**. The tent is created through the admin UI.
- `stock_count` is left at its default and never rendered for `bookableOnline === false` products; an audit pass removes any stock/availability text on those (card, modal, category page, admin-facing storefront copy).
- `images: string[]` is built from `inventory_images` (primary first, then `sort_order`), falling back to the single resolved `image`. Products with one image get an array of length 1, and the thumbnail strip only renders when `images.length > 1`, so every existing product looks byte-identical to today.

**UI**
- New `src/components/inventory/ProductSpecs.tsx`: 2-col `dl`, `text-xs`, muted left label / right-aligned value, `divide-y divide-border`, tight row padding. Rendered between description and CTA.
- `ProductCard.tsx`: card becomes `flex flex-col h-full` with the CTA in an `mt-auto` footer so equal-height grid alignment holds. When `bookableOnline === false`, render `<Button asChild variant="secondary">` wrapping `<a href="tel:+14074971840">` with a `Phone` icon, label "Call to Reserve", and the requested `aria-label`. Same size/min-height as Book Now; the anchor stops click propagation so it never opens the booking modal. Directly beneath it, visible muted text `407-497-1840` (`text-xs text-muted-foreground text-center`) so desktop users can read the number.
- The `$379 / day` price line is suppressed when the product's specs already contain a `Price` row.
- `ProductDetailModal.tsx`: same CTA swap + specs table; thumbnail gallery when `images.length > 1`.
- `CartContext.addItem`: for `bookableOnline === false`, skip the add **and** fire a toast — "This item is reserved by phone" with the description containing a `tel:+14074971840` link rendered as `407-497-1840`. `CategoryCard` tiles route through the same modal and inherit the CTA.

**GA4 tracking**
- `gtag.js` for `G-CSD46XS8PZ` is already loaded in `index.html`. Add a small `src/lib/analytics.ts` helper (`trackEvent(name, params)`) that safely calls `window.gtag('event', ...)` when present.
- Every "Call to Reserve" click (card and detail modal) fires `call_to_reserve` with `{ product_slug, product_name, phone: "407-497-1840" }` before navigation.

**Pages / routing**
- New `src/pages/TentRentals.tsx` modeled on `TableChairRentals.tsx` (hero → grid → SEO content), route in `App.tsx`, entry in `Rentals.tsx`, card in `AllCategoryCarousels.tsx`, nav/footer category links, and `public/sitemap.xml`.
- SEO: unique `SEOHead` title/description, single H1 ("Tent Rentals in Orlando, FL"), canonical `/tent-rentals`, and 250+ words of original supporting copy — what a high peak frame tent is, how a frame tent differs from a pole tent (no center poles, free-standing, usable floor area), surface options and anchoring on grass vs. concrete, HOA/park permit and wind considerations, sizing guidance for 40 seated guests, and the East Orlando delivery area. `BreadcrumbSchema` + `ServiceSchema` only — **no Product/Offer schema**, since the item is not transactable online.

**Admin**
- `InventoryDetail.tsx`: add `tents` to the category select, a "Bookable online" switch, and a repeatable label/value spec editor persisting to the new columns.
