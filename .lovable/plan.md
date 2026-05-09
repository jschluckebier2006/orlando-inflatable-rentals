## What's actually happening

The Image Health tab is right — the website only *looks* fine. Here's what I found by comparing the database to the bundled image assets:

**7 items are flagged "Broken"** because their `legacy_image` filename in the database points to a file that doesn't exist in `src/assets/inventory/`. When that happens, the public site silently falls back to the generic placeholder (the 15ft Tropic Shock image), so visitors see *an* image — just the wrong one.

The 7 items:
1. Marble Bounce House → `marble-bounce-house.webp` (missing)
2. Module Bounce House → `module-bounce-house.webp` (missing)
3. Tropical Bounce House → `tropical-bounce-house.webp` (missing)
4. Snow Cone Machine → `snow-cone-machine.webp` (missing)
5. Tropical Cliff Combo → `tropical-cliff-combo.webp` (missing)
6. Twin Falls Combo → `twin-falls-combo.webp` (missing)
7. Volcano Island Combo → `volcano-island-combo.webp` (missing)

The other ~30 items flagged "Legacy fallback" are healthy — they're just using bundled webp files instead of uploaded photos. No action required there unless you want a higher-quality image.

## So do you have to re-upload?

**Yes — for those 7 items, you'll need to upload a real photo.** There's no clean shortcut: the file the DB is pointing to was never in the project. I can't conjure a Volcano Island Combo image from elsewhere.

## What I'll do to make this less misleading

Even though the fix requires your uploads, I can stop the public site from quietly showing the wrong image and make the admin view actually useful:

1. **Strengthen the resolver** in `src/lib/inventory.ts`: when `legacy_image` is set but missing from the bundle, treat it as no image instead of falling through to the placeholder. This way the public product card shows the neutral placeholder explicitly and the admin "Broken" flag matches what visitors would see.
2. **Clear the dead `legacy_image` values** for those 7 rows via a one-shot DB update so the resolver and Image Health agree on state. (This is reversible — I'll log each change to the audit log.)
3. **Surface a clearer hint** in the Image Health row for these 7: "Filename references a file that no longer exists — upload a replacement photo." Plus a one-click "Clear bad legacy reference" action so you can do it without me.

After that, the Image Health tab will only flag genuine issues, and the 7 broken items will be the exact list you need to upload photos for.

## Files touched

- `src/lib/inventory.ts` — tighten `resolveImage` fallback.
- `src/components/admin/InventoryImageHealth.tsx` — new "missing legacy file" sub-status, per-row Clear action, and audit log entry.
- One-shot DB update via the migration tool to null out the 7 stale `legacy_image` values (logged as `image.clear_legacy` in `admin_audit_log`).

No new tables, no migration of structure. Audit log already exists.

## Out of scope

- Auto-generating replacement photos.
- Bulk uploading images on your behalf.
