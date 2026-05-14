## Files to edit

1. `src/pages/admin/Inventory.tsx` — overflow menu items + AlertDialog + cascading hard-delete handler (Fix 1)
2. `src/pages/admin/InventoryDetail.tsx` — horizontally scrollable `TabsList` on mobile/tablet (Fix 2)

No other files. No new dependencies.

---

## Fix 1 — Overflow menu: add Delete product (hard delete + best-effort cascade)

**File:** `src/pages/admin/Inventory.tsx`

### New imports
- `@/components/ui/alert-dialog`: `AlertDialog`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogCancel`, `AlertDialogAction`
- `lucide-react`: extend existing import to add `Trash2`
- `@/components/ui/dropdown-menu`: extend existing import to add `DropdownMenuSeparator`

### New state
```ts
const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
const [deleting, setDeleting] = useState(false);
```

### Storage path convention (verified)
`InventoryDetail.tsx` uploads to `inventory-images` bucket using path `${id}/${Date.now()}-${safeName}`, where `id` is the inventory item id. So listing prefix `${item.id}/` and removing returned entries is the correct pattern.

### New handler — `deleteProduct`

Best-effort cascade in this exact order; only the final parent delete aborts on failure.

```ts
async function deleteProduct(item: Item) {
  setDeleting(true);

  // 1) inventory_images rows — best-effort
  {
    const { error } = await (supabase.from("inventory_images") as any).delete().eq("item_id", item.id);
    if (error) console.warn("[deleteProduct] inventory_images cleanup failed:", error.message);
  }

  // 2) inventory_blackouts rows — best-effort
  {
    const { error } = await (supabase.from("inventory_blackouts") as any).delete().eq("item_id", item.id);
    if (error) console.warn("[deleteProduct] inventory_blackouts cleanup failed:", error.message);
  }

  // 3) inventory_maintenance rows — best-effort
  {
    const { error } = await (supabase.from("inventory_maintenance") as any).delete().eq("item_id", item.id);
    if (error) console.warn("[deleteProduct] inventory_maintenance cleanup failed:", error.message);
  }

  // 4) Storage cleanup under `${item.id}/` — best-effort, never blocks
  try {
    const { data: files, error: listErr } = await supabase.storage
      .from("inventory-images")
      .list(`${item.id}/`);
    if (listErr) {
      console.warn("[deleteProduct] storage list failed:", listErr.message);
    } else if (files && files.length > 0) {
      const paths = files.map((f) => `${item.id}/${f.name}`);
      const { error: rmErr } = await supabase.storage.from("inventory-images").remove(paths);
      if (rmErr) console.warn("[deleteProduct] storage remove failed:", rmErr.message);
    }
  } catch (e: any) {
    console.warn("[deleteProduct] storage cleanup threw:", e?.message ?? e);
  }

  // 5) Parent row — only this step aborts on failure
  const { error: parentErr } = await (supabase.from("inventory_items") as any).delete().eq("id", item.id);
  if (parentErr) {
    setDeleting(false);
    toast({ title: "Delete failed", description: parentErr.message, variant: "destructive" });
    return;
  }

  setDeleting(false);
  toast({ title: "Product deleted" });
  setDeleteTarget(null);
  setItems((prev) => prev.filter((x) => x.id !== item.id));
  load();
}
```

Notes:
- `as any` casts only on `supabase.from(...)` calls (matching the existing file's pattern). Storage calls and `setItems`/toast remain typed.
- Local-state filter mirrors how `move`/`duplicate` rely on `load()` — we do both for instant UI feedback plus authoritative refresh.

### DropdownMenuContent — final order

1. **Move up** → `move(it, -1)`
2. **Move down** → `move(it, 1)`
3. **Show / Hide** → `toggleActive(it)` (label flips on `it.active`)
4. **Duplicate product** → `duplicate(it)` (label changed from "Duplicate")
5. `<DropdownMenuSeparator />`
6. **Delete product** → `setDeleteTarget(it)` — destructive styling:
   ```tsx
   <DropdownMenuItem
     className="text-destructive focus:text-destructive"
     onClick={() => setDeleteTarget(it)}
   >
     <Trash2 className="h-4 w-4 mr-2" />
     Delete product
   </DropdownMenuItem>
   ```

### AlertDialog (rendered once at the bottom, outside the row map)

```tsx
<AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o && !deleting) setDeleteTarget(null); }}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
      <AlertDialogDescription>
        This will permanently delete{deleteTarget ? ` "${deleteTarget.name}"` : ""} and all of its
        images, availability blackouts, and maintenance history. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        disabled={deleting}
        onClick={(e) => {
          e.preventDefault(); // prevent auto-close so we control it after the await
          if (deleteTarget) deleteProduct(deleteTarget);
        }}
      >
        {deleting ? "Deleting…" : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Desktop inline icon cluster (lg+) is **not** modified — no Delete icon added there.

---

## Fix 2 — Scrollable tabs on mobile/tablet (unchanged)

**File:** `src/pages/admin/InventoryDetail.tsx`

Wrap the existing `<TabsList>` in a horizontally-scrollable container and add `whitespace-nowrap` on each `TabsTrigger`. Desktop (lg+) is byte-identical to today.

```tsx
<div className="overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-border">
  <TabsList className="w-max lg:w-auto">
    <TabsTrigger value="details" className="whitespace-nowrap">Details & pricing</TabsTrigger>
    <TabsTrigger value="images" disabled={isNew} className="whitespace-nowrap">Images</TabsTrigger>
    <TabsTrigger value="blackouts" disabled={isNew} className="whitespace-nowrap">Availability</TabsTrigger>
    <TabsTrigger value="maintenance" disabled={isNew} className="whitespace-nowrap">Maintenance</TabsTrigger>
    <TabsTrigger value="history" disabled={isNew} className="whitespace-nowrap">Bookings</TabsTrigger>
  </TabsList>
</div>
```

- `overflow-x-auto` at <lg, neutralized at lg+ via `lg:overflow-visible`
- `-mx-6 px-6` lets the scroll area bleed to the screen edges within the page's `p-6` container; reset at lg+
- `w-max` on `TabsList` at <lg prevents shrink-to-fit truncation
- `whitespace-nowrap` on each trigger removes the "Mai…" clip
- Thin webkit scrollbar styling provides a subtle affordance

No imports change for Fix 2.

---

## Risks / things to confirm

1. **`booking_items.product_id` orphans:** `booking_items` keeps a denormalized `product_name` + `product_price` per row, so historical bookings will still display correctly. The InventoryDetail "Bookings" tab for the deleted item is unreachable (the parent row is gone) — expected for a hard delete.
2. **AlertDialog auto-close:** Confirm button uses `e.preventDefault()` so the dialog stays open during the awaited cascade and is closed explicitly via `setDeleteTarget(null)` on success. On failure, the dialog stays open so the admin sees the destructive toast and can retry.
3. **Storage list pagination:** `supabase.storage.list()` returns up to 100 entries by default. Per-item upload counts are well under 100 in practice (admin-only tool), so a single `list()` call is sufficient. If a future item has more, leftover blobs become orphans (cosmetic only) — flagging here but not solving in this pass.
4. **WebKit-only scrollbar styling:** Firefox shows its default thin scrollbar; acceptable for an admin-only page.