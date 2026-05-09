# Admin Audit Log (Image-Health Edition)

## Goal
Persist a tamper-resistant trail of every one-click inventory image fix (single + bulk) showing **who** changed **what**, **when**, and the exact **before → after** value. Designed to expand later to settings changes, email template edits, etc.

## Database

New table `admin_audit_log` (separate from `booking_activity`, which is booking-scoped):

| column | type | notes |
|---|---|---|
| `id` | uuid PK | gen_random_uuid |
| `created_at` | timestamptz | default now() |
| `actor_email` | text | from current session, nullable |
| `entity_type` | text | e.g. `inventory_item` |
| `entity_id` | text | item id |
| `action` | text | `image.promote_primary` / `image.clear_primary` (extensible) |
| `summary` | text | human-readable line for the log feed |
| `before` | jsonb | `{ "primary_image_url": "..." }` |
| `after` | jsonb | `{ "primary_image_url": "..." }` |
| `metadata` | jsonb | source (`single` / `bulk`), category, item_name, gallery_count |

RLS:
- `admins read audit log` — admins SELECT only.
- `admins insert audit log` — admins INSERT only.
- No UPDATE / DELETE policies (immutable trail).

Indexes: `(entity_type, entity_id)`, `(created_at desc)`.

## Logger helper
`src/lib/adminAuditLog.ts` exporting:
```ts
logAudit({ entity_type, entity_id, action, summary, before?, after?, metadata? })
```
Pulls `actor_email` from `supabase.auth.getSession()` exactly like `adminActivity.ts`. Best-effort — failures are console-warned, not thrown, so a logging hiccup never blocks the actual fix.

## Wiring in `InventoryImageHealth.tsx`
Four call sites, all already in this file:

1. `promote(r)` — log `image.promote_primary` with `before={primary_image_url:r.primary_image_url}`, `after={primary_image_url:r.first_gallery_url}`, `metadata={source:"single", item_name, category, gallery_count}`.
2. `clearPrimary(r)` — log `image.clear_primary` with before/after and `source:"single"`.
3. `bulkPromote()` — `Promise.all` writes; for each successful row, log one entry with `source:"bulk"` and a shared `batch_id` (random uuid) so the UI can group them.
4. `bulkClearStale()` — single `IN (ids)` update; loop the list to insert one log row per item with the same `batch_id`.

Logs are written **after** the DB update succeeds so we never record a change that didn't happen.

## Surfacing the log
Update `/admin/activity` to use Tabs:
- **Bookings** — current `booking_activity` feed, unchanged.
- **System** — new feed of `admin_audit_log` (last 200, filterable by `entity_type` and `action`).
  - Each row shows: action label, summary, actor, timestamp, and a small expandable diff (`before` → `after`) rendered as two stacked code blocks. Bulk entries collapse by `batch_id` and show "12 items promoted via bulk action" with an expand-to-list affordance.
  - Entries with `entity_type === "inventory_item"` link to `/admin/inventory/{entity_id}`.

## Out of scope (for this pass)
- Logging non-image admin actions (settings, email templates) — the table is built generically so we can add those later by importing the same helper.
- Restore / undo from a log entry. Manual today via the existing detail page; auto-undo can come later by replaying `before`.
- Pagination beyond the latest 200.

## Verification
1. Run migration → table + RLS visible in Cloud.
2. Apply a single "Promote gallery" — see one row in `admin_audit_log` with both before/after URLs and the current admin email.
3. Apply "Promote first gallery → primary (N)" bulk — see N rows sharing one `batch_id`, displayed grouped in `/admin/activity` System tab.
4. Confirm RLS: `select` from a non-admin session returns empty.
