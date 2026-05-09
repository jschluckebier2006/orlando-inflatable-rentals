## Goal
Stop the Image Health tab from doing two unbounded `select *` reads against `inventory_items` and `inventory_images` every time it mounts or the admin clicks "Re-run check". Replace the single full-table fetch with a paginated initial load and an incremental refresh keyed off `updated_at`.

## Current behavior (problem)

`useImageHealthRows` in `src/components/admin/InventoryImageHealth.tsx` runs once on mount and again on every reload:
- `inventory_items`: full table, ordered by category + name.
- `inventory_images`: full table.

Both hit Supabase's 1000-row default cap, both transfer everything every time, and there's no way to reuse work across reloads after a single image upload.

`updated_at` already exists on `inventory_items`. `inventory_images` only has `created_at` — we'll treat each row as immutable (insert/delete only) and use `created_at` as the high-water mark. (Confirmed in schema; the table has no update path in the app.)

## Design

### 1. Cached snapshot in `sessionStorage`

Key: `imageHealth.snapshot.v1`. Shape:
```
{
  itemsById: Record<string, ItemRow>,
  imagesByItem: Record<string, ImageRow[]>,
  itemsHighWater: string,   // max(updated_at) seen
  imagesHighWater: string,  // max(created_at) seen
  knownItemIds: string[],   // for delete reconciliation
  knownImageIds: string[],
}
```
Snapshot is per-tab (sessionStorage) so it doesn't go stale across days but doesn't bloat localStorage either. Versioned key lets us bump the schema later.

### 2. Initial load — paginated

When no snapshot exists:
- Fetch `inventory_items` in pages of 500 using `.range(from, to)`, ordered by `updated_at asc, id asc`. Loop until a page returns `< 500` rows.
- Fetch `inventory_images` in pages of 1000 ordered by `created_at asc, id asc`, same loop.
- Build the snapshot, persist it, derive rows.

Page size 500/1000 keeps us under Supabase's hard cap and lets the first paint stream in (we'll setRows after each page so the table fills progressively, with a "Scanning… page N" indicator).

### 3. Incremental refresh

When a snapshot exists, `reload()` does:
- `inventory_items`: `.gt("updated_at", snapshot.itemsHighWater)` paginated. Upsert into `itemsById`, advance high-water.
- `inventory_images`: `.gt("created_at", snapshot.imagesHighWater)` paginated. Append into `imagesByItem`, advance high-water.
- Reconcile deletes lazily: a separate lightweight call selects only `id` from both tables (paginated). Diff against `knownItemIds` / `knownImageIds`; drop missing rows. This is still cheaper than fetching full payloads and can be skipped on auto-reloads, only run when the admin clicks "Re-run check" with a Shift modifier or a "Full reconcile" button.

### 4. Auto-reload after a fix

`promote`, `clearPrimary`, `bulkPromote`, `bulkClearStale` already call `reload()`. After this change, that reload becomes an incremental delta against the rows we just touched (their `updated_at` advances), so it's an O(N changed) round-trip instead of O(table).

### 5. UX

- Status count cards keep working — they read from the in-memory `rows`, which is now the merged snapshot, so totals stay accurate.
- Add a small "Last scanned: 2m ago · N items" line in the filter bar with a "Full rescan" link that wipes the snapshot and reruns the paginated initial load.
- Loading state stays the same; for incremental reloads it'll typically flash off in <300ms.

## Files

- `src/components/admin/InventoryImageHealth.tsx`
  - Replace `load()` body with paginated + incremental logic.
  - Extract snapshot helpers (`readSnapshot`, `writeSnapshot`, `clearSnapshot`) into the same file (small, no need for a separate module).
  - Add "Last scanned …" + "Full rescan" affordance in the filter card.

No DB changes, no new tables, no migration. Audit log behavior unchanged.

## Out of scope

- Server-side aggregation / RPC for counts (would skip transferring rows entirely but is a bigger refactor; revisit if dataset grows past ~5k items).
- Realtime subscriptions on `inventory_items` / `inventory_images` (nice-to-have, but admin tab is rarely open passively).
- Persisting snapshot across tabs/devices.
