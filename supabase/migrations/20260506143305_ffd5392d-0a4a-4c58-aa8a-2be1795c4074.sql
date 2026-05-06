-- Make product fields on bookings optional (legacy single-item rows still readable)
alter table public.bookings alter column product_id drop not null;
alter table public.bookings alter column product_name drop not null;
alter table public.bookings alter column product_price drop not null;

-- Add pickup time
alter table public.bookings add column if not exists event_end_time text;

-- Drop the old per-row unique index; uniqueness is now enforced via trigger on booking_items
drop index if exists public.bookings_unit_day_active;

-- Booking items
create table if not exists public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_price numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists booking_items_booking_id_idx on public.booking_items(booking_id);
create index if not exists booking_items_product_id_idx on public.booking_items(product_id);

alter table public.booking_items enable row level security;

create policy "anyone can create booking items"
on public.booking_items for insert
to anon, authenticated
with check (true);

create policy "admins read booking items"
on public.booking_items for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "admins update booking items"
on public.booking_items for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "admins delete booking items"
on public.booking_items for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Prevent double-booking trigger
create or replace function public.prevent_double_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event_date date;
  v_status booking_status;
  v_conflict_count int;
begin
  select event_date, status into v_event_date, v_status
  from public.bookings where id = new.booking_id;

  if v_status not in ('pending','confirmed') then
    return new;
  end if;

  select count(*) into v_conflict_count
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  where bi.product_id = new.product_id
    and b.event_date = v_event_date
    and b.status in ('pending','confirmed')
    and bi.booking_id <> new.booking_id;

  if v_conflict_count > 0 then
    raise exception 'Item % is already booked on %', new.product_name, v_event_date
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_double_booking_trg on public.booking_items;
create trigger prevent_double_booking_trg
before insert on public.booking_items
for each row execute function public.prevent_double_booking();

-- Batch lookup of booked dates for multiple products
create or replace function public.get_booked_dates_for_products(_product_ids text[])
returns table(product_id text, event_date date)
language sql
stable
security definer
set search_path = public
as $$
  select bi.product_id, b.event_date
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  where bi.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and b.event_date >= current_date
  union
  select b.product_id, b.event_date
  from public.bookings b
  where b.product_id is not null
    and b.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and b.event_date >= current_date
$$;