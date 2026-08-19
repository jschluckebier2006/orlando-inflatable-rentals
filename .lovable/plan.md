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

**Liability copy rules (highest priority on this page)**
- No specific wind ratings or wind-speed thresholds, no permit requirements or thresholds, no occupancy limits, no setback distances. No numbers of that kind anywhere on the page.
- Permit/HOA guidance is general, in this spirit: "Requirements vary by venue, neighborhood, and municipality. Check with your venue, HOA, or local parks department about tent permits before your event date, and let us know about any restrictions when you call."
- Weather: we monitor conditions and work with the customer on scheduling — no thresholds. Any borderline sentence gets left out.

**/tent-rentals SEO plan**
- Keywords — primary: *tent rentals Orlando FL*, *tent rental Orlando*. Secondary: party tent rental Orlando, wedding tent rental Orlando, 20x20 tent rental, frame tent rental, backyard party tent, graduation party tent rental, tent delivery and setup Orlando, high peak tent rental, canopy tent rental Orlando. Worked in naturally — no stuffing.
- `SEOHead` title: "Tent Rentals in Orlando, FL | 20x20 High Peak Frame Tent | Orlando Inflatables". Meta description includes "tent rentals Orlando", "delivery and setup", and 407-497-1840. Canonical `/tent-rentals`.
- Single H1: "Tent Rentals in Orlando, FL". H2s in this exact order:

```text
20x20 High Peak Frame Tent Rental
Frame Tent vs. Pole Tent — What's the Difference?
What Size Tent Do You Need?
Tent Delivery and Setup Across Orlando
Weddings, Graduations, and Backyard Parties
Tent Rental FAQs
```

- 250+ words of original customer-facing copy across those sections, uniquely worded (no reuse of other category-page prose). No invented stats or claims about inventory or experience.
- **Service area — verified against existing pages.** `DeliveryAreaLinks.tsx`, `WaterSlideRentals.tsx`, and `TableChairRentals.tsx` all list the same 10 cities: Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield. **No difference** — the tent page uses this same list, in prose, with the same `/water-slide-and-bounce-house-rental-<slug>` internal links.
- FAQ block with `FAQPageSchema` (allowed — not a product offer), in this order: Do you deliver and set up tent rentals in Orlando? / Can a tent be set up on grass, concrete, or pavement? / How many guests fit under a 20x20 tent? / Can I rent a tent for a backyard party or graduation? / Do I need a permit or HOA approval for a tent? (general answer per the liability rules) / Does the tent rental include tables and chairs? (verbatim answer below) / How do I reserve the tent? (by phone at 407-497-1840 — not bookable online).
- **"How far in advance should I book?" is removed** — the supplied answer came through as the literal placeholder `[PASTE YOUR UNCLE'S ANSWER]`, so per your instruction the question is dropped entirely rather than invented. Send the wording later and it can be added.
- Page closes with a "Call to Reserve" CTA block using the same `tel:+14074971840` link and the `call_to_reserve` GA4 event.
- Schema: `BreadcrumbSchema` + `ServiceSchema` + `FAQPageSchema` only — **no Product/Offer schema**, since the item is not transactable online.

**Tent-only messaging (no tables or chairs included)**
- FAQ item "Does the tent rental include tables and chairs?" answer, verbatim: "No — the 20x20 High Peak Frame Tent is the tent only. Tables and chairs can be added to your reservation for an additional fee. Just let us know what you need when you call and we'll quote it with your tent."
- Product detail modal only (card stays compact): a line directly under the spec table — "Tent only. Tables and chairs available as add-ons." in `text-xs text-muted-foreground`, matching the phone-number line styling.
- "What Size Tent Do You Need?" section: both figures (40 with tables, 67 without) are framed as planning guidance for what comfortably fits under the canopy — never as a capacity limit or occupancy figure — and seating is not included.
- One natural in-copy cross-link to `/table-chair-rentals` with descriptive anchor text such as "table and chair rentals" (no banner, no callout).
- No mention of a bundled tent + table + chair package anywhere — no teaser, "coming soon", or waitlist.

**Admin**
- `InventoryDetail.tsx`: add `tents` to the category select, a "Bookable online" switch, and a repeatable label/value spec editor persisting to the new columns.
