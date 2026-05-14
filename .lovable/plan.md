## Goal

Close the reactivation gap: when a `bookings` row's `status` transitions back into `pending`/`confirmed` from another value (e.g. `cancelled` → `confirmed`), re-validate every associated `booking_items` row against current `inventory_blackouts` and overlapping active bookings. If any conflict exists, raise an exception so the UPDATE is aborted.

Out of scope (explicit): `get_booked_dates_for_products` stays byte-identical; no React/TS/edge-function changes; no changes to existing `prevent_double_booking` trigger or `is_date_range_available`.

---

## Single SQL migration

### 1. New trigger function `public.prevent_double_booking_on_reactivate()`

- Language: `plpgsql`, `SECURITY DEFINER`, `SET search_path = public`.
- Fires per row on `bookings` UPDATE.
- Guard clause: only run when `NEW.status IN ('pending','confirmed')` AND `OLD.status IS DISTINCT FROM NEW.status`. Otherwise `RETURN NEW` immediately. This excludes `confirmed → confirmed` no-ops and any status that isn't a re-activation into an active state.
- For each row in `public.booking_items WHERE booking_id = NEW.id`, perform the same two checks `prevent_double_booking()` already encodes, against the booking's own date range (`NEW.event_date`..`COALESCE(NEW.event_end_date, NEW.event_date)`):
  1. **Blackout check** — `EXISTS` in `inventory_blackouts` where `item_id = bi.product_id` and `daterange(start_date, end_date, '[]') && daterange(NEW.event_date, COALESCE(NEW.event_end_date, NEW.event_date), '[]')`. If hit → `RAISE EXCEPTION 'Cannot reactivate booking: % is unavailable on the requested dates (blackout).', bi.product_name USING ERRCODE = 'P0001';`
  2. **Stock-overlap check** — count overlapping `booking_items` joined to `bookings` where `b.status IN ('pending','confirmed')`, `b.id <> NEW.id`, and date ranges overlap; compare to `inventory_items.stock_count` (default 1). If `count >= stock` → `RAISE EXCEPTION 'Cannot reactivate booking: % is fully booked on the requested dates (% of % units used).', bi.product_name, count, stock USING ERRCODE = 'P0001';`
- `RETURN NEW` at the end.
- Mirrors the logic in the existing `prevent_double_booking()` trigger so behavior is consistent across INSERT-on-items and reactivate-on-bookings paths. (Reusing `is_date_range_available` would also work but it lacks the per-product error message, so we inline the same two checks for clearer exception text.)

### 2. New trigger `prevent_double_booking_on_reactivate`

```sql
DROP TRIGGER IF EXISTS prevent_double_booking_on_reactivate ON public.bookings;

CREATE TRIGGER prevent_double_booking_on_reactivate
BEFORE UPDATE OF status ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_double_booking_on_reactivate();
```

- `BEFORE UPDATE` so the exception aborts the row update cleanly before it commits (AFTER would also abort via transaction rollback, but BEFORE is the standard pattern for validation triggers and avoids any AFTER-trigger side effects firing first).
- `UPDATE OF status` keeps the trigger off the hot path for unrelated column updates (notes, totals, payment fields, etc.).
- `DROP ... IF EXISTS` for idempotent re-runs.

### 3. Permissions

Trigger function is invoked by the trigger itself (table-owner context), so no `EXECUTE` grants to `anon`/`authenticated` are needed. Migration will explicitly `REVOKE EXECUTE ... FROM PUBLIC, anon, authenticated` to stay consistent with the security-linter hardening shipped in migration `20260514180347`.

---

## Edge cases

| Case | Covered? | Behavior |
|---|---|---|
| `cancelled` → `confirmed` | Yes | Full re-validation; raises if conflict. |
| `cancelled` → `pending` | Yes | Same path. |
| `pending` → `confirmed` | Yes (transition into active state from a different value) | Re-validates. Acceptable — cheap and catches blackouts added between pending and confirm. |
| `confirmed` → `confirmed` (no-op or unrelated re-save) | Skipped via `OLD.status IS DISTINCT FROM NEW.status` guard. |
| `pending` → `pending` | Skipped via same guard. |
| `confirmed` → `cancelled` | Skipped — `NEW.status NOT IN ('pending','confirmed')`. |
| Active booking, `event_date` changed without status change | **Out of scope** for this trigger (status didn't transition). Reschedules already go through `RescheduleDialog` / admin flows that should validate up front; covering date-only edits would require a second trigger on `UPDATE OF event_date, event_end_date`. Flagged as a follow-up, not implemented here. |
| Booking with no `booking_items` rows (legacy single-product `bookings.product_id`) | Loop simply finds zero rows → no error. Legacy single-product path already covered by other constraints; not regressed. |

---

## Risks

- **False positives during admin "uncancel" flows.** If a booker legitimately re-confirms an old cancelled booking and the slot was rebooked, the UPDATE will fail. This is the desired behavior, but admins need a clear UI error. Error text uses `P0001` so client-side `code === 'P0001'` handlers (already used elsewhere in the app) will surface the message verbatim.
- **Self-conflict avoidance.** The stock-overlap query uses `b.id <> NEW.id` so the booking being reactivated does not count against itself.
- **Trigger ordering.** No other BEFORE UPDATE triggers exist on `bookings`, so ordering is not a concern.
- **No impact on `get_booked_dates_for_products`** — confirmed; that function is not touched.

---

## Deliverable

One migration file containing: `CREATE OR REPLACE FUNCTION public.prevent_double_booking_on_reactivate()`, `REVOKE EXECUTE` grants, `DROP TRIGGER IF EXISTS`, `CREATE TRIGGER`. After apply: re-run `supabase--linter` to confirm no new findings, and verify trigger registration via `pg_trigger`.