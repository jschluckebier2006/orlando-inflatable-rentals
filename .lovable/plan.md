## Admin Dashboard Overhaul

A clean sidebar layout for `/admin/bookings` with calendar as the default landing view. Built with shadcn `Sidebar` (collapsible to icon strip) for a state-of-the-art feel that stays simple.

### Layout

```text
+----------------+--------------------------------+
| [Logo]         |  Header: page title · Sign out |
| Calendar     ✓ +--------------------------------+
| Bookings       |                                |
| Customers      |  <Active tab content>          |
| New Reservation|                                |
| Activity Log   |  (Calendar shown by default)   |
| Settings       |                                |
+----------------+--------------------------------+
```

Routes: `/admin` → Calendar, `/admin/bookings`, `/admin/customers`, `/admin/customers/:id`, `/admin/new`, `/admin/activity`, `/admin/settings`. The current `/admin/bookings` keeps working.

### Tabs

**1. Calendar (landing page)**
- Month / Week / Day toggle.
- Color-coded dots per booking by status (pending=yellow, confirmed=green, completed=blue, cancelled=red).
- Click a day → side panel slides in showing that day's bookings + a "New reservation on this date" button (pre-fills the date).
- Click a booking in the panel → opens the Booking detail drawer.

**2. Bookings**
- Existing filterable table (kept, polished). Row click → Booking detail drawer.

**3. Customers**
- Searchable table: Name · Email · Phone · # bookings · Lifetime $ · Last booking.
- Click a row → Customer detail page with editable contact info + booking history + threaded notes.
- Backfilled from existing bookings (one customer per unique email).

**4. New Reservation**
- Wizard: pick customer (autocomplete existing or "+ create new") → pick items + dates → pricing summary (uses existing `computeBreakdown` incl. delivery zone) → Payment step.
- **Payment options on the form:**
  - Save without payment (status: pending)
  - Record cash (input amount)
  - Record check (amount + check #)
  - Record card on site / Square / external (amount + last 4 optional)
  - Send Stripe payment link by email (creates Stripe Checkout link via existing `create-booking-checkout`, emails it via app emails)
- "Send confirmation email to customer" checkbox (default on) — uses existing booking confirmation email.

**5. Activity Log**
- Global feed of recent admin actions and booking notes across all bookings (latest first).

**6. Settings**
- Lightweight: tax rate, damage waiver %, default deposit, delivery zones link (read-only mention of `deliveryZones.ts`). Keeps things non-confusing by not duplicating code-config.

### Booking Detail Drawer (used everywhere)

Opens from any booking row / calendar dot. Sections:
- **Header:** customer name, status badge, payment badge.
- **Customer info:** inline editable (name, email, phone, address, city, zip). Save updates both the booking AND the linked customer record.
- **Schedule:** event date, end date, start/end time, **"Edit date" button** → date picker. On save, runs availability check; if conflict, shows a warning dialog with the conflicting booking(s) and an "Override and save anyway" button.
- **Items & pricing:** read-only item list + breakdown.
- **Payments:** existing amount paid + "Record payment" button (same multi-method form as New Reservation).
- **Notes (single field):** the existing `bookings.notes` quick-scratch field, editable inline.
- **Activity log (threaded):** timestamped entries (note added, status changed, payment recorded, date changed, email sent). "+ Add note" inputs a new threaded entry.
- **Actions:** change status, send confirmation email, cancel.

### Database changes

```sql
-- customers: one row per unique customer email
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  address_line text, city text, zip text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- link bookings to customers (nullable for safety; backfilled)
alter table public.bookings add column customer_id uuid references public.customers(id);

-- threaded activity log entries (per booking + global)
create table public.booking_activity (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  actor_email text,        -- admin who performed action
  kind text not null,      -- 'note' | 'status_change' | 'payment' | 'date_change' | 'email_sent' | 'created'
  message text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- payments ledger (multi-method)
create table public.booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  method text not null,    -- 'cash' | 'check' | 'card_external' | 'stripe' | 'stripe_link'
  amount numeric not null,
  reference text,          -- check #, last 4, stripe session, etc.
  recorded_by text,
  created_at timestamptz default now()
);
```
- All three tables: RLS — admins (via `has_role`) full CRUD; anon/authenticated denied.
- Backfill SQL: insert distinct customers from `bookings` grouped by lower(email); update `bookings.customer_id` to match.
- Trigger on `booking_payments` insert → recompute `bookings.amount_paid` and `payment_status` (deposit_paid / paid_in_full).

### Reschedule conflict logic

Reuse `get_booked_dates_for_products` to check overlap when admin changes `event_date`/`event_end_date`. If conflicts exist:
1. Show list of conflicting bookings (link to each).
2. Buttons: "Cancel" / "Override and save anyway".
3. On override, bypass the `prevent_double_booking` trigger by temporarily updating only the parent `bookings` row dates (the trigger fires on `booking_items` insert, not date change — so the update will succeed; we just warn the admin).

### Manual reservation — payment & email flow

- Save without payment → `bookings.status = 'pending'`, no payment row, optional confirmation email.
- Cash/check/card-external → insert `booking_payments` row, trigger updates totals, status auto-set (`confirmed` if any payment, `paid_in_full` if covers total).
- Stripe payment link → call existing `create-booking-checkout` to mint a Checkout Session URL, then send via app emails (new transactional template `payment-link`). Booking created as `pending` until webhook confirms.

### Activity log behavior

Every admin action writes a `booking_activity` row automatically:
- Booking created (manual) · Status changed · Date changed (with old/new) · Payment recorded · Email sent · Note added.
- The Notes section in the drawer is the threaded view of `kind = 'note'`. The single `bookings.notes` field stays as quick-scratch separate from this.

### Files

**New:**
- `src/components/admin/AdminLayout.tsx` — sidebar shell using shadcn `Sidebar`.
- `src/components/admin/AdminSidebar.tsx`
- `src/pages/admin/Calendar.tsx` — month/week/day calendar + day detail drawer.
- `src/pages/admin/Customers.tsx` + `CustomerDetail.tsx`.
- `src/pages/admin/NewReservation.tsx` — multi-step wizard.
- `src/pages/admin/Activity.tsx` — global activity feed.
- `src/pages/admin/Settings.tsx`.
- `src/components/admin/BookingDetailDrawer.tsx` — shared drawer.
- `src/components/admin/RecordPaymentDialog.tsx` — multi-method payment form.
- `src/components/admin/RescheduleDialog.tsx` — date picker + conflict warning.
- `src/components/admin/ActivityFeed.tsx` — threaded notes/log component.
- `src/components/admin/CustomerPicker.tsx` — autocomplete in New Reservation.
- DB migration (tables + RLS + backfill + payment-totals trigger).
- Edge function `record-manual-payment` (server-side validation + activity log write).

**Edited:**
- `src/App.tsx` — add nested admin routes.
- `src/pages/admin/Bookings.tsx` — refactor to render inside `AdminLayout`, extract calendar code into the new Calendar page, row click opens `BookingDetailDrawer`.
- `supabase/functions/_shared/email.ts` — add Stripe payment-link email template.

### Out of scope (call out so we don't bloat)

- No SMS notifications.
- No calendar sync to Google/iCal (can add later).
- No drag-to-reschedule on calendar (you said use Edit Date inside the booking — confirmed).
- No inventory management UI (still in `inventory.ts`).
- No multi-admin user management (existing roles stay).

### Validation

- Backfill: count customers = count distinct emails in bookings.
- Manual reservation: with no payment → pending; with $50 cash → amount_paid=50, status=confirmed, payment row visible.
- Reschedule to free date → updates silently. Reschedule to conflicting date → warning dialog appears with conflicting booking listed, override succeeds.
- Sidebar collapses to icon strip and trigger remains visible.
- Mobile: sidebar becomes off-canvas drawer.

This is a sizable build but each piece is self-contained — approve and I'll ship it in one pass.