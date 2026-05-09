-- 1. Customers table
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  address_line text,
  city text,
  zip text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index customers_email_lower_idx on public.customers (lower(email));

alter table public.customers enable row level security;

create policy "admins read customers" on public.customers
  for select to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins insert customers" on public.customers
  for insert to authenticated with check (has_role(auth.uid(), 'admin'::app_role));
create policy "admins update customers" on public.customers
  for update to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins delete customers" on public.customers
  for delete to authenticated using (has_role(auth.uid(), 'admin'::app_role));

create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.update_updated_at_column();

-- 2. Add customer_id to bookings
alter table public.bookings add column customer_id uuid references public.customers(id) on delete set null;
create index bookings_customer_id_idx on public.bookings (customer_id);

-- 3. Backfill customers from existing bookings
insert into public.customers (name, email, phone, address_line, city, zip)
select distinct on (lower(b.customer_email))
  b.customer_name,
  lower(b.customer_email),
  b.customer_phone,
  b.event_address_line,
  b.event_city,
  b.event_zip
from public.bookings b
where b.customer_email is not null and length(b.customer_email) > 0
order by lower(b.customer_email), b.created_at desc;

update public.bookings b
set customer_id = c.id
from public.customers c
where lower(b.customer_email) = lower(c.email)
  and b.customer_id is null;

-- 4. Booking activity (threaded log)
create table public.booking_activity (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  actor_email text,
  kind text not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index booking_activity_booking_idx on public.booking_activity (booking_id, created_at desc);
create index booking_activity_customer_idx on public.booking_activity (customer_id, created_at desc);
create index booking_activity_created_idx on public.booking_activity (created_at desc);

alter table public.booking_activity enable row level security;

create policy "admins read activity" on public.booking_activity
  for select to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins insert activity" on public.booking_activity
  for insert to authenticated with check (has_role(auth.uid(), 'admin'::app_role));
create policy "admins update activity" on public.booking_activity
  for update to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins delete activity" on public.booking_activity
  for delete to authenticated using (has_role(auth.uid(), 'admin'::app_role));

-- 5. Booking payments ledger
create table public.booking_payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  method text not null check (method in ('cash','check','card_external','stripe','stripe_link')),
  amount numeric not null check (amount > 0),
  reference text,
  recorded_by text,
  notes text,
  created_at timestamptz not null default now()
);

create index booking_payments_booking_idx on public.booking_payments (booking_id, created_at desc);

alter table public.booking_payments enable row level security;

create policy "admins read payments" on public.booking_payments
  for select to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins insert payments" on public.booking_payments
  for insert to authenticated with check (has_role(auth.uid(), 'admin'::app_role));
create policy "admins update payments" on public.booking_payments
  for update to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "admins delete payments" on public.booking_payments
  for delete to authenticated using (has_role(auth.uid(), 'admin'::app_role));

-- 6. Trigger to recompute booking totals after payment changes
create or replace function public.recompute_booking_payment_totals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking_id uuid;
  v_paid numeric;
  v_total numeric;
  v_deposit numeric;
  v_status text;
begin
  v_booking_id := coalesce(new.booking_id, old.booking_id);

  select coalesce(sum(amount), 0) into v_paid
  from public.booking_payments where booking_id = v_booking_id;

  select coalesce(total_amount, 0), coalesce(deposit_amount, 0)
  into v_total, v_deposit
  from public.bookings where id = v_booking_id;

  if v_paid <= 0 then
    v_status := 'unpaid';
  elsif v_total > 0 and v_paid >= v_total then
    v_status := 'paid_in_full';
  else
    v_status := 'deposit_paid';
  end if;

  update public.bookings
  set amount_paid = v_paid,
      balance_due = greatest(coalesce(total_amount, 0) - v_paid, 0),
      payment_status = v_status,
      updated_at = now()
  where id = v_booking_id;

  return coalesce(new, old);
end;
$$;

create trigger booking_payments_recompute
after insert or update or delete on public.booking_payments
for each row execute function public.recompute_booking_payment_totals();