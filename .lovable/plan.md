# Self-Booking System (Phase 1 — No Payments Yet)

Replaces the current Jotform reservation flow with a native booking system on Lovable Cloud. Customers pick a unit, pick a date, fill in event details, and reserve. The system blocks double-booking at the database level. Stripe deposits get added in Phase 2.

Note: This overrides the existing project rule that all forms go through Jotform. Confirming you want to proceed with a custom system anyway (yes, given you explicitly asked).

## What the customer sees

1. On any product card / product grid, the "Book Your Date" / "Check Availability" button opens a Booking Modal (instead of the Jotform modal).
2. Booking Modal flow:
   - Step 1 — Pick a date on a calendar. Dates already booked for that specific unit are visually disabled.
   - Step 2 — Enter customer info: name, email, phone, event address (street, city, ZIP), event start time, event type, notes.
   - Step 3 — Review summary (unit, date, price, contact) and submit.
3. On submit: reservation is created with status `pending`. Customer sees a confirmation screen with a reservation ID and a message that we'll confirm shortly. They also get an email confirmation (basic transactional email via Lovable Cloud).
4. A simple `/booking/:id` page lets the customer revisit their reservation status via the link in the email.

## What you (admin) see

A new `/admin/bookings` page (protected by auth + admin role) that lists all reservations with filters by status (pending / confirmed / cancelled) and date range. Each row has actions: Confirm, Cancel, mark Completed. A small calendar view shows unit availability per day.

## How double-booking is prevented

- Each reservation row has `product_id`, `event_date` (DATE, not timestamp — one rental per day per unit), and `status`.
- A **partial unique index** on `(product_id, event_date) WHERE status IN ('pending','confirmed')` makes it impossible at the DB level for two active reservations on the same unit/day. Cancelled reservations don't block.
- Availability lookup endpoint returns the set of booked dates per unit for the next ~12 months; the calendar disables those dates.
- On submit, the insert is wrapped so a unique-violation returns a friendly "this date was just booked, please pick another" error.

## Removing Jotform

- Replace `JotformModal` usage in `ProductGrid`, `ProductCard`, `CTASection`, `StickyBookButton`, hero buttons, and category page CTAs with the new `BookingModal`.
- Keep `JotformEmbed` / `JotformModal` files in place (unused) for one release cycle in case of rollback, then delete.
- Contact page keeps a simple contact form (also native, not Jotform) — separate from bookings.

## Technical plan

### Database (migration)

```
-- enums
create type booking_status as enum ('pending','confirmed','cancelled','completed');
create type app_role as enum ('admin','staff','user');

-- bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,            -- matches Product.id from inventory.ts
  product_name text not null,           -- snapshot for history
  product_price numeric(10,2) not null, -- snapshot
  event_date date not null,
  event_start_time text,                -- e.g. "2:00 PM"
  event_type text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  event_address_line text not null,
  event_city text not null,
  event_zip text not null,
  notes text,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- prevent double-booking
create unique index bookings_unit_day_active
  on public.bookings (product_id, event_date)
  where status in ('pending','confirmed');

-- roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

-- RLS
alter table public.bookings enable row level security;
alter table public.user_roles enable row level security;

-- public can INSERT a booking (anonymous customers)
create policy "anyone can create booking" on public.bookings
  for insert to anon, authenticated with check (true);

-- only admins can SELECT/UPDATE bookings
create policy "admins read bookings" on public.bookings
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update bookings" on public.bookings
  for update to authenticated using (public.has_role(auth.uid(),'admin'));

-- a public RPC returns just booked dates per product (no PII)
create or replace function public.get_booked_dates(_product_id text)
returns table(event_date date) language sql stable security definer set search_path=public as $$
  select event_date from public.bookings
  where product_id = _product_id and status in ('pending','confirmed')
    and event_date >= current_date
$$;
```

### Edge function `submit-booking`

Validates input with Zod, inserts the booking using service-role, catches unique violation (Postgres code `23505`) → returns 409 with friendly message. On success, sends confirmation email via Lovable AI / Resend (using `RESEND_API_KEY` if configured later — for v1, just store and skip email or use a basic SMTP-via-edge approach). Returns booking id.

### Frontend

- `src/components/booking/BookingModal.tsx` — 3-step wizard using existing `Dialog`, `Calendar`, `Input`, `Label`, `Button`.
- `src/hooks/useBookedDates.ts` — calls `get_booked_dates` RPC, returns `Date[]` to feed `Calendar`'s `disabled` prop.
- `src/lib/booking.ts` — Zod schema + `submitBooking()` wrapper.
- `src/pages/BookingConfirmation.tsx` — `/booking/:id` shows status.
- `src/pages/admin/Login.tsx` + `src/pages/admin/Bookings.tsx` — email/password auth (no Google for admin), table + filters + actions.
- Replace all `<JotformModal>` usages with `<BookingModal product={...} />`. For non-product CTAs (hero, sticky button), open the modal with no preselected product — first step asks them to pick a category + unit.

### Auth

- Enable email/password auth (auto-confirm ON for admin convenience — only you sign up).
- After you sign up your admin email, I'll insert a `user_roles` row granting `admin`.
- Customers do NOT need accounts; bookings are created as anon inserts.

## Out of scope for this phase

- Stripe deposit (Phase 2 — will add `deposit_paid`, `stripe_payment_intent_id` columns and gate `confirmed` status on payment).
- Multi-day rentals (current model: one day per unit).
- Time-slot bookings (whole-day only — matches party rental industry norm).
- SMS notifications.

## Files to add / change

Add: migration, `supabase/functions/submit-booking/index.ts`, `BookingModal.tsx`, `useBookedDates.ts`, `lib/booking.ts`, `BookingConfirmation.tsx`, `admin/Login.tsx`, `admin/Bookings.tsx`, route entries in `App.tsx`.

Edit: `ProductGrid.tsx`, `ProductCard.tsx`, `CTASection.tsx`, `StickyBookButton.tsx`, `HeroSection.tsx`, all category page hero CTAs (BounceHouseRentals, WaterSlideRentals, BounceSlideComboRentals, etc.) — swap Jotform for BookingModal.

Confirm and I'll build it.
