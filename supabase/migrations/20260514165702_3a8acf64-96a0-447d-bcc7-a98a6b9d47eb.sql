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
  union
  select ib.item_id as product_id, d::date as event_date
  from public.inventory_blackouts ib
  cross join lateral generate_series(ib.start_date, ib.end_date, '1 day'::interval) as d
  where ib.item_id = any(_product_ids)
    and ib.end_date >= current_date
$function$;