# Inventory Image Health Check

## Goal
Give admins a single screen that audits every inventory item's images and surfaces actionable problems before customers see broken cards.

## Where it lives
New tab inside the existing `/admin/inventory` page (above the items table) plus a top-of-page summary banner that shows when issues exist. Also surfaced as a small badge in the sidebar "Inventory" link when `issues > 0`.

```
Inventory page
 ├─ Banner: "3 items missing images" (only when issues > 0)
 └─ Tabs: [Items] [Image Health (3)]
       └─ Image Health tab → table of flagged items
```

No new route; same admin auth/RLS as today.

## What it checks
For every active `inventory_items` row, classify into one of these states (worst first):

1. **Broken** — `primary_image_url` is null, no rows in `inventory_images`, AND `legacy_image` is null OR the file isn't bundled in `src/assets/inventory/`. Customer sees the generic placeholder.
2. **Legacy fallback** — `primary_image_url` is null and no `inventory_images` rows, but `legacy_image` matches a bundled webp. Working today, but tied to bundled assets and won't survive an `id`/filename change.
3. **Stale primary** — `primary_image_url` is set but it doesn't match any row in `inventory_images` (e.g. the original was deleted from the gallery).
4. **No gallery** — has a primary image but `inventory_images` is empty (no extra photos for galleries/SEO).
5. **Healthy** — has primary + at least one `inventory_images` row.

Inactive items are listed in a separate collapsed section so they don't clutter the main count.

## UI
- **Summary cards** at top of the tab: Healthy / Legacy fallback / Stale primary / No gallery / Broken with counts.
- **Table** with columns: Thumbnail (current resolved image), Name, Category, Status badge, Source ("DB primary" / "Gallery" / "Bundled webp" / "Placeholder"), Quick actions (Open detail, Promote first gallery image to primary, Clear stale primary).
- Filters: status (multi-select) and category. Default view = everything except Healthy.
- "Re-run check" button to refetch.

## Quick-fix actions (one click each)
- **Promote gallery → primary**: when a `Stale primary` or `No gallery` item has at least one `inventory_images` row, set `primary_image_url` to the first image (`is_primary` first, then `sort_order`).
- **Clear stale primary**: null out `primary_image_url` so the resolver falls back to gallery/legacy.
- **Open detail**: links to existing `/admin/inventory/:id` for full upload UI.

No bulk uploader — that already exists on the detail page.

## Technical notes
- Bundled-asset list is exposed by reusing the `legacyAssetMap` already built in `src/lib/inventory.ts`. Export `legacyAssetFilenames: Set<string>` from that module so the audit can membership-check without re-globbing.
- Single Supabase fetch joins `inventory_items` with grouped counts from `inventory_images` (two queries client-side — items + all image rows — same pattern as `loadInventory`).
- Pure client-side classification; no DB schema change.
- Sidebar badge: small `useEffect` in `AdminSidebar` that calls a lightweight `count_image_issues()` helper (or just reuses the audit query) and shows a dot when > 0. Only loads inside the admin layout, so no public cost.

## Out of scope
- HTTP HEAD-checking remote `primary_image_url` URLs to verify they 200. Storage uploads come from our own bucket; trust them. (Can be added later as an opt-in "deep check".)
- Rewriting the resolver fallback chain.
- Auto-uploading replacements.

## Verification
After build: open `/admin/inventory`, switch to Image Health tab. With current DB (37 items, 0 gallery rows, all `primary_image_url` null), expect ~all rows in **Legacy fallback** plus any row whose `legacy_image` filename isn't in the bundled webp list (e.g. `marble-bounce-house.webp`, `snow-cone-machine.webp`) flagged as **Broken**.
