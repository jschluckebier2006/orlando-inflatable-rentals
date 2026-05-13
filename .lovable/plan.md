# Manual Cancellation Flow — /admin/bookings (revised)

Five revisions applied: bug-line removed from Restore, SQL helper for availability, `actor_user_id` on activity rows, dedicated `cancelled`/`restored` kinds, secondary status filter retained on Active tab. Full Restore dialog copy written out.

Admin handles Stripe refunds in the Stripe Dashboard. This app only updates booking state, releases the calendar date, and keeps an audit trail. No emails, no Stripe API calls.

## Pre-flight findings

- `booking_activity.kind` is **plain text** — no check constraint, no enum. Verified via `pg_constraint` (only PK + 2 FKs). Safe to use new `'cancelled'` and `'restored'` values directly, no constraint migration needed.
- `booking_items.product_id` is **text**, not uuid (legacy slug-style ids). The SQL helper signature uses `text[]`.
- `booking_activity` currently has `actor_email` only — no `actor_user_id`. Migration adds it; `logActivity` is updated to populate both.

## Execution order

### 1. Migration: `supabase/migrations/<timestamp>_booking_cancellation.sql`

```sql
-- 1a. Cancellation columns on bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_at  timestamptz NULL,
  ADD COLUMN IF NOT EXISTS cancel_reason text        NULL;

-- 1b. Audit: capture the admin user id alongside email
ALTER TABLE public.booking_activity
  ADD COLUMN IF NOT EXISTS actor_user_id uuid NULL REFERENCES auth.users(id);

-- 1c. Availability helper — single source of truth, mirrors prevent_double_booking()
CREATE OR REPLACE FUNCTION public.is_date_range_available(
  p_product_ids text[],
  p_start date,
  p_end date,
  p_exclude_booking_id uuid
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT NOT EXISTS (
    -- Conflict from blackouts on any of the requested items
    SELECT 1 FROM public.inventory_blackouts ib
    WHERE ib.item_id = ANY(p_product_ids)
      AND daterange(ib.start_date, ib.end_date, '[]')
          && daterange(p_start, p_end, '[]')
  )
  AND NOT EXISTS (
    -- Conflict where another active booking has reached or exceeded stock
    -- on any of the requested items, in the requested range
    SELECT 1
    FROM public.booking_items bi
    JOIN public.bookings b ON b.id = bi.booking_id
    JOIN public.inventory_items ii ON ii.id = bi.product_id
    WHERE bi.product_id = ANY(p_product_ids)
      AND b.status IN ('pending','confirmed')
      AND b.id <> p_exclude_booking_id
      AND daterange(b.event_date, COALESCE(b.event_end_date, b.event_date), '[]')
          && daterange(p_start, p_end, '[]')
    GROUP BY bi.product_id, ii.stock_count
    HAVING COUNT(*) >= COALESCE(ii.stock_count, 1)
  );
$$;

REVOKE ALL ON FUNCTION public.is_date_range_available(text[], date, date, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_date_range_available(text[], date, date, uuid)
  TO authenticated;
```

Notes:
- `kind` is unconstrained text — no migration needed for new kind values.
- RLS on `booking_activity` already restricts insert/select to admins. New column inherits that gate.

### 2. `src/lib/adminActivity.ts` — capture user id

```ts
export type ActivityKind =
  | "note" | "status_change" | "payment" | "date_change"
  | "email_sent" | "created" | "edited"
  | "cancelled" | "restored";       // ← new

export async function logActivity(params: { ... }) {
  const { data: { session } } = await supabase.auth.getSession();
  await (supabase.from("booking_activity") as any).insert({
    booking_id:   params.bookingId   ?? null,
    customer_id:  params.customerId  ?? null,
    actor_email:  session?.user?.email ?? null,
    actor_user_id: session?.user?.id  ?? null,   // ← new
    kind:         params.kind,
    message:      params.message,
    metadata:     params.metadata ?? {},
  });
}
```

`ActivityFeed.tsx` `ICON` map gets entries for the two new kinds (e.g., `cancelled: XCircle`, `restored: RotateCcw`).

### 3. `src/pages/admin/Bookings.tsx` — Cancel confirmation dialog

Replace the one-click destructive Cancel with an `AlertDialog` (shadcn primitive at `src/components/ui/alert-dialog.tsx`).

```tsx
const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
const [cancelReason, setCancelReason] = useState("");
const [refundConfirmed, setRefundConfirmed] = useState(false);
const [cancelSubmitting, setCancelSubmitting] = useState(false);

// Cancel button onClick (replaces inline updateStatus(..., 'cancelled')):
<Button size="sm" variant="destructive"
  onClick={() => { setCancelTarget(b); setCancelReason(""); setRefundConfirmed(false); }}>
  Cancel
</Button>

async function confirmCancel() {
  if (!cancelTarget || !refundConfirmed) return;
  setCancelSubmitting(true);
  const prev = cancelTarget.status;
  const { error } = await supabase.from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancel_reason: cancelReason.trim() || null,
    })
    .eq("id", cancelTarget.id);
  if (error) {
    toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
  } else {
    await logActivity({
      bookingId: cancelTarget.id,
      kind: "cancelled",
      message: cancelReason.trim()
        ? `Booking cancelled — ${cancelReason.trim()}`
        : "Booking cancelled",
      metadata: { reason: cancelReason.trim() || null, previous_status: prev },
    });
    setBookings(b => b.map(x => x.id === cancelTarget.id
      ? { ...x, status: "cancelled", cancelled_at: new Date().toISOString(),
              cancel_reason: cancelReason.trim() || null }
      : x));
    toast({ title: "Booking cancelled" });
    setCancelTarget(null);
  }
  setCancelSubmitting(false);
}
```

Cancel dialog markup:

```tsx
<AlertDialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
      <AlertDialogDescription>
        This will release the date on the calendar and move the booking to the
        Cancelled tab. This app does NOT issue a Stripe refund automatically —
        you must have already refunded the deposit (and any balance charged) in
        the Stripe Dashboard before continuing.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <label className="flex items-start gap-2 text-sm">
      <Checkbox checked={refundConfirmed} onCheckedChange={(v) => setRefundConfirmed(!!v)} />
      <span>I have refunded this booking in the Stripe Dashboard.</span>
    </label>

    <Textarea placeholder="Reason for cancellation (optional)"
      value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} />

    <AlertDialogFooter>
      <AlertDialogCancel>Keep booking</AlertDialogCancel>
      <AlertDialogAction
        disabled={!refundConfirmed || cancelSubmitting}
        onClick={(e) => { e.preventDefault(); confirmCancel(); }}
        className={buttonVariants({ variant: "destructive" })}
      >
        Cancel booking
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 4. `src/pages/admin/Bookings.tsx` — Tabs + retained status filter

Tabs sync to URL via `useSearchParams`. The existing Select dropdown (pending/confirmed/completed) **stays**, but only renders inside the Active tab.

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const tab = (searchParams.get("tab") === "cancelled" ? "cancelled" : "active") as "active" | "cancelled";
const setTab = (t: "active" | "cancelled") =>
  setSearchParams((p) => { const np = new URLSearchParams(p); np.set("tab", t); return np; });

// 'all' here means all *active* statuses; 'cancelled' is excluded entirely from this dropdown.
const activeAll = bookings.filter(b => b.status !== "cancelled");
const activeFiltered = filter === "all" ? activeAll : activeAll.filter(b => b.status === filter);
const cancelledList  = bookings.filter(b => b.status === "cancelled");

<Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
  <TabsList>
    <TabsTrigger value="active">Active ({activeAll.length})</TabsTrigger>
    <TabsTrigger value="cancelled">Cancelled ({cancelledList.length})</TabsTrigger>
  </TabsList>

  <TabsContent value="active" className="space-y-4">
    {/* Secondary status filter — RETAINED, scoped to active statuses only */}
    <div className="flex justify-end">
      <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          {/* No 'cancelled' here — that's the other tab */}
        </SelectContent>
      </Select>
    </div>

    <BookingsCalendar bookings={bookings} />
    <UpcomingWeekList bookings={bookings} />
    {/* existing full Table fed activeFiltered */}
  </TabsContent>

  <TabsContent value="cancelled">
    <CancelledBookingsTable
      rows={cancelledList}
      onRestore={(b) => setRestoreTarget(b)}
      onView={(b) => { setEditing(b as any); setFormOpen(true); }}
    />
  </TabsContent>
</Tabs>
```

The header-row Select that currently sits next to "New booking / Refresh / Sign out" is removed (replaced by the in-tab one above) so it doesn't double up.

### 5. `src/components/admin/CancelledBookingsTable.tsx` — new component

Slim table, columns: Customer, Event date, Items, Paid, Cancelled, Reason (truncated, `title=` for full), Actions (Pencil → BookingFormModal, Restore button). Same shape as the prior plan.

`Booking` type in `Bookings.tsx` gains `cancelled_at?: string|null; cancel_reason?: string|null;` — already returned by `select("*")`.

### 6. `src/pages/admin/Bookings.tsx` — Restore flow (corrected handler)

Bug line removed. Conflict check delegated to the SQL helper; no JS date math.

```tsx
const [restoreTarget, setRestoreTarget] = useState<Booking | null>(null);
const [restoreSubmitting, setRestoreSubmitting] = useState(false);

async function confirmRestore() {
  if (!restoreTarget) return;
  setRestoreSubmitting(true);
  const b = restoreTarget;

  // 1. Get product_ids for this booking's items (text[], slug-style ids)
  const { data: items, error: itemsErr } = await supabase
    .from("booking_items").select("product_id").eq("booking_id", b.id);
  if (itemsErr) {
    toast({ title: "Restore failed", description: itemsErr.message, variant: "destructive" });
    setRestoreSubmitting(false); return;
  }
  const productIds = (items ?? []).map((x: any) => x.product_id).filter(Boolean) as string[];

  // 2. SQL-side availability check (mirrors prevent_double_booking)
  if (productIds.length) {
    const { data: ok, error: rpcErr } = await supabase.rpc("is_date_range_available", {
      p_product_ids: productIds,
      p_start: b.event_date,
      p_end: b.event_end_date ?? b.event_date,
      p_exclude_booking_id: b.id,
    });
    if (rpcErr) {
      toast({ title: "Restore failed", description: rpcErr.message, variant: "destructive" });
      setRestoreSubmitting(false); return;
    }
    if (!ok) {
      toast({
        title: "Cannot restore — the date is no longer available.",
        variant: "destructive",
      });
      setRestoreSubmitting(false); setRestoreTarget(null); return;
    }
  }

  // 3. Flip the row back to confirmed
  const { error } = await supabase.from("bookings")
    .update({ status: "confirmed", cancelled_at: null }).eq("id", b.id);
  if (error) {
    toast({ title: "Restore failed", description: error.message, variant: "destructive" });
  } else {
    await logActivity({
      bookingId: b.id,
      kind: "restored",
      message: "Booking restored from cancellation",
      metadata: { previous_status: "cancelled" },
    });
    setBookings(prev => prev.map(x => x.id === b.id
      ? { ...x, status: "confirmed", cancelled_at: null } : x));
    toast({ title: "Booking restored" });
    setTab("active");
  }
  setRestoreSubmitting(false); setRestoreTarget(null);
}
```

Restore dialog markup (full copy):

```tsx
<AlertDialog open={!!restoreTarget} onOpenChange={(o) => !o && setRestoreTarget(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Restore this booking?</AlertDialogTitle>
      <AlertDialogDescription>
        This will return the booking to <strong>confirmed</strong> and re-block
        the event date on the calendar. If the same item has already been booked
        by someone else for this date, the restore will fail and the booking
        will stay cancelled.
        <br /><br />
        The original cancellation reason will be kept on the booking for history.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Keep cancelled</AlertDialogCancel>
      <AlertDialogAction
        disabled={restoreSubmitting}
        onClick={(e) => { e.preventDefault(); confirmRestore(); }}
      >
        Restore booking
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 7. Verification

1. Migration applies; `bookings.cancelled_at`, `cancel_reason`, `booking_activity.actor_user_id`, and `is_date_range_available()` all present.
2. `select is_date_range_available(ARRAY['some-slug'], '2026-06-01', '2026-06-01', gen_random_uuid())` returns `true` for an open date.
3. Cancel an active booking → confirm button gated by checkbox; reason persisted; row moves to Cancelled tab; calendar releases the date.
4. `booking_activity` row written with `kind='cancelled'`, `actor_user_id` populated, `metadata.previous_status` and `metadata.reason` set.
5. Restore the same row → returns to Active as `confirmed`, calendar re-blocks; activity row `kind='restored'` written.
6. Create a competing confirmed booking on the same item+date, then Restore another cancelled one → blocked with toast, remains cancelled.
7. URL `?tab=cancelled` deep-links correctly; secondary status filter inside Active tab still narrows pending/confirmed/completed.
8. `bunx tsc --noEmit` clean.

### Known gap (not fixed here)

Cancelling does not zero out `payment_status`, `amount_paid`, or `balance_due`. Admin reconciles these against Stripe manually.

### Out of scope

- No Stripe API calls, no `charge.refunded` webhook handling.
- No customer or admin emails on cancel/restore.
- No changes to pricing, tax, deposit, or balance flow.
- No changes to `prevent_double_booking()` or `get_booked_dates_for_products()` — they already filter to `('pending','confirmed')`, so cancel/restore work end-to-end with no edits.
