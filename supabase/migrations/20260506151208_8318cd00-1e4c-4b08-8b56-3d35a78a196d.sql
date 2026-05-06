-- Add duration tier fields to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS duration_type text NOT NULL DEFAULT '7hour',
  ADD COLUMN IF NOT EXISTS event_end_date date,
  ADD COLUMN IF NOT EXISTS price_multiplier numeric NOT NULL DEFAULT 1.0;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_duration_type_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_duration_type_check
  CHECK (duration_type IN ('7hour','overnight','weekend'));

UPDATE public.bookings
SET event_end_date = event_date
WHERE event_end_date IS NULL;

ALTER TABLE public.bookings
  ALTER COLUMN event_end_date SET NOT NULL,
  ALTER COLUMN event_end_date SET DEFAULT CURRENT_DATE;

-- Add unit_price (charged price after multiplier) to booking_items
ALTER TABLE public.booking_items
  ADD COLUMN IF NOT EXISTS unit_price numeric;

UPDATE public.booking_items SET unit_price = product_price WHERE unit_price IS NULL;

-- Replace prevent_double_booking trigger function to handle date ranges
CREATE OR REPLACE FUNCTION public.prevent_double_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_start date;
  v_end date;
  v_status booking_status;
  v_conflict_count int;
begin
  select event_date, coalesce(event_end_date, event_date), status
    into v_start, v_end, v_status
  from public.bookings where id = new.booking_id;

  if v_status not in ('pending','confirmed') then
    return new;
  end if;

  select count(*) into v_conflict_count
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  where bi.product_id = new.product_id
    and b.status in ('pending','confirmed')
    and bi.booking_id <> new.booking_id
    and daterange(b.event_date, coalesce(b.event_end_date, b.event_date), '[]')
        && daterange(v_start, v_end, '[]');

  if v_conflict_count > 0 then
    raise exception 'Item % is already booked in that date range', new.product_name
      using errcode = 'P0001';
  end if;

  return new;
end;
$function$;

DROP TRIGGER IF EXISTS prevent_double_booking_trg ON public.booking_items;
CREATE TRIGGER prevent_double_booking_trg
BEFORE INSERT ON public.booking_items
FOR EACH ROW EXECUTE FUNCTION public.prevent_double_booking();

-- Replace get_booked_dates_for_products to expand date ranges
CREATE OR REPLACE FUNCTION public.get_booked_dates_for_products(_product_ids text[])
RETURNS TABLE(product_id text, event_date date)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  select bi.product_id, d::date as event_date
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  cross join lateral generate_series(b.event_date, coalesce(b.event_end_date, b.event_date), '1 day'::interval) as d
  where bi.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and coalesce(b.event_end_date, b.event_date) >= current_date
  union
  select b.product_id, d::date as event_date
  from public.bookings b
  cross join lateral generate_series(b.event_date, coalesce(b.event_end_date, b.event_date), '1 day'::interval) as d
  where b.product_id is not null
    and b.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and coalesce(b.event_end_date, b.event_date) >= current_date
$function$;