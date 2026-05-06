
-- enums
create type public.booking_status as enum ('pending','confirmed','cancelled','completed');
create type public.app_role as enum ('admin','staff','user');

-- bookings table
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_name text not null,
  product_price numeric(10,2) not null,
  event_date date not null,
  event_start_time text,
  event_type text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  event_address_line text not null,
  event_city text not null,
  event_zip text not null,
  notes text,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index bookings_unit_day_active
  on public.bookings (product_id, event_date)
  where status in ('pending','confirmed');

create index bookings_event_date_idx on public.bookings (event_date);

-- user roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger update_bookings_updated_at
before update on public.bookings
for each row execute function public.update_updated_at_column();

-- RLS
alter table public.bookings enable row level security;
alter table public.user_roles enable row level security;

create policy "anyone can create booking"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

create policy "admins read bookings"
  on public.bookings for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "admins update bookings"
  on public.bookings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "admins delete bookings"
  on public.bookings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "users read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "admins read all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- public RPC for booked dates (no PII)
create or replace function public.get_booked_dates(_product_id text)
returns table(event_date date)
language sql stable security definer set search_path = public
as $$
  select event_date from public.bookings
  where product_id = _product_id
    and status in ('pending','confirmed')
    and event_date >= current_date
$$;

grant execute on function public.get_booked_dates(text) to anon, authenticated;
