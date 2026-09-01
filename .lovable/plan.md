# Show manual blackout dates on the admin calendar

Display and management only — nothing changes about how blackouts are created.

## What gets added

**1. Item-level blackouts on the grid**
Each `inventory_blackouts` row renders on every date in its range as its own calendar entry: the product name in strikethrough, muted color, with a small ban icon. Customer bookings keep rendering exactly as today (status dot + first/last name). Struck-through muted text vs. plain text with a colored dot reads as different at a glance.

**2. Global blackouts as a banner**
Each `global_blackouts` row renders as a single full-width row pinned to the top of the day cell: "Closed — [reason]" (just "Closed" if no reason), in the destructive style. Not one line per product. The existing red day-cell tint and ban icon in the date header stay.

**3. Multi-day ranges**
Both types expand inclusively across `start_date`..`end_date`, same as bookings already do, so a range shows on every day it covers — not just the start date.

**4. Click to inspect and remove**
Clicking a blackout entry opens a popover anchored to that entry (clicking it does not open the day sheet). It shows:
- Product name, or "All products" for a global block
- Full date range, formatted (single date if start = end)
- The reason text in full, wrapped, not truncated
- Created date (both tables store `created_at`; only `global_blackouts` stores a creator id, so global blocks show the creator when it resolves, item blocks show the date only)
- A destructive "Remove blackout" button that switches the popover into a confirm step ("Remove this block? The date becomes bookable again." → Cancel / Remove) before deleting

On delete the row is removed from `inventory_blackouts`/`global_blackouts` and the calendar reloads. A toast confirms, errors surface as a destructive toast.

**5. Day sheet**
The day detail sheet also lists the blackouts for that date — item-level ones struck through with their reason, global ones in the existing red panel — each with the same remove-with-confirm control, since the grid cell only shows the first few entries.

No show/hide toggle. Blackouts always render.

**6. Overlapping holds on the same item and date**
When two or more blackouts cover the same item on the same day, each of those entries gets a warning indicator (amber triangle + amber tint) and the popover notes "N holds on this item for this date", so a stale or conflicting hold is visible instead of silently stacking.

**7. Truncation never hides a blackout**
When a day cell overflows, at least one blackout entry is always kept in the visible slots — bookings give up a slot first. The "+N more" counter covers everything hidden. A fully-committed date can never look open in month view.

## Verification


Against the live holds: 2026-09-06 shows `18' Tiki Plunge Dual Lane Water Slide` (two rows exist for that date — an owner-offline hold and a "sewing reinforcement" hold, both will show) plus `4-in-1 Aqua Palms Combo` (9/6–9/7); 2026-09-19 shows `15' Tropic Shock Dual Lane Water Slide`. All struck through, alongside any real bookings on those dates. The long "Handled offline by owner…" reason must be fully readable in the popover.

## Technical notes

Single file: `src/pages/admin/Calendar.tsx`.

- Extend `load()` with a fourth query: `inventory_blackouts` joined to `inventory_items(name)` for the product label.
- Add an `itemBlackoutMap` keyed `yyyy-MM-dd` using the same `eachDayOfInterval` expansion as `dayMap`/`blackoutMap`.
- Grid cells: render the global banner first, then bookings, then item blackouts, keeping the existing per-view truncation counts ("+N more" includes blackouts).
- Popover via the existing shadcn `Popover`; the trigger is a nested element inside the day button, so its click handler stops propagation so the day sheet does not open.
- Deletes run through the existing `supabase.from(...).delete().eq("id", …)`; admin-only RLS on both tables already covers them.
- Mobile month view keeps the compact dot row and adds a small ban marker when any blackout covers the day; the full list stays in the day sheet.
