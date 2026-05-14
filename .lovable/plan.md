# Fix mobile layout of /admin/inventory rows (compact overflow menu at < lg)

## Files to edit

- `src/pages/admin/Inventory.tsx` — only the row markup inside the `filtered.map((it) => ...)` block. No other file changes; the existing shadcn `DropdownMenu` at `src/components/ui/dropdown-menu.tsx` is reused as-is.

Customer-facing pages, cart, StartHereModal, hero, and layout components are untouched. The search bar, category Select, Tabs (Items / Image health), and the "items need image attention" banner are left exactly as they are.

## High-level changes

### New imports in `Inventory.tsx`
- Add `MoreHorizontal` to the existing `lucide-react` import.
- Add `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` from `@/components/ui/dropdown-menu`.

### Row JSX restructure (mobile/tablet vs desktop via Tailwind only)

Keep one row container; switch internal layout with responsive utilities so desktop (≥1024px) is unchanged.

Current (single flex row, everything inline):
```text
[thumb] [name + badges]            [price]  [↑][↓][👁][⎘]
```

New layout at <lg (mobile + portrait tablet):
```text
[thumb] [name                        ] [⋯]
        [price · Stock N · Hidden    ]
```

New desktop (lg and up): identical to today.

Concretely inside the row:
1. Thumbnail block (`w-14 h-14 ...`) — unchanged.
2. Middle block (`flex-1 min-w-0`):
   - Line 1: item name `Link` (unchanged, already `truncate block`).
   - Line 2 wrapper becomes a single-row flex with `flex items-center flex-wrap gap-2 mt-1`:
     - On mobile/tablet, render the price here as a small chip: `<span className="lg:hidden font-semibold text-sm">${base_price}</span>` followed by `<span className="lg:hidden text-xs text-muted-foreground">/ day</span>`.
     - Existing badges (`category`, `Hidden`, `Stock N`) remain. The `category` badge gets `hidden lg:inline-flex` so mobile/tablet shows only Stock + Hidden (keeps the line short).
3. Desktop-only price column: wrap the existing `<div class="text-right">…</div>` with `hidden lg:block` so it stays on desktop and disappears on mobile/tablet (price already shown inline there).
4. Action icons cluster (the four `Button size="icon"` items):
   - Wrap the existing four buttons in a `<div class="hidden lg:flex items-center gap-1">` so desktop behavior is byte-identical.
   - Add a sibling mobile/tablet-only overflow trigger:
     ```tsx
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Row actions">
           <MoreHorizontal className="h-4 w-4" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-44">
         <DropdownMenuItem onClick={() => move(it, -1)}><ArrowUp className="h-4 w-4 mr-2"/>Move up</DropdownMenuItem>
         <DropdownMenuItem onClick={() => move(it, 1)}><ArrowDown className="h-4 w-4 mr-2"/>Move down</DropdownMenuItem>
         <DropdownMenuItem onClick={() => toggleActive(it)}>
           {it.active ? <><EyeOff className="h-4 w-4 mr-2"/>Hide</> : <><Eye className="h-4 w-4 mr-2"/>Show</>}
         </DropdownMenuItem>
         <DropdownMenuItem onClick={() => duplicate(it)}><Copy className="h-4 w-4 mr-2"/>Duplicate</DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
     ```
   - Handlers reuse the exact functions already defined (`move`, `toggleActive`, `duplicate`) — no logic changes.

### Tailwind summary
- Added: `hidden lg:flex` on existing icon cluster, `hidden lg:block` on existing price column, `lg:hidden` on new mobile/tablet price chip + overflow button, `flex-wrap gap-2` on the badges line, `hidden lg:inline-flex` on the category badge.
- Removed: nothing structural; existing classes preserved on desktop path.

No changes to: state, queries, handlers, sort logic, banner, tabs, search, filter, bulk-price dialog, image health tab.

## Risks / things to confirm

1. **Category badge on mobile/tablet**: plan hides it at <lg to keep line 2 to one row. If you want it visible there too, say so — it just changes one class.
2. **MoreHorizontal icon**: standard lucide icon, already used elsewhere in the project bundle — no new dependency.
3. **Dropdown z-index inside `Card overflow-hidden`**: shadcn `DropdownMenuContent` portals to `body`, so the parent `Card`'s `overflow-hidden` will not clip it. Verified by reading `dropdown-menu.tsx` (uses `DropdownMenuPrimitive.Portal`).
4. **Accessibility**: overflow button gets `aria-label="Row actions"`; menu items have visible text labels.
