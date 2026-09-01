-- 1. Constraints preventing inverted date ranges
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_event_dates_ordered CHECK (event_end_date >= event_date);

ALTER TABLE public.inventory_blackouts
  ADD CONSTRAINT inventory_blackouts_dates_ordered CHECK (end_date >= start_date);

ALTER TABLE public.global_blackouts
  ADD CONSTRAINT global_blackouts_dates_ordered CHECK (end_date >= start_date);

-- 2. Harden range-building functions with least()/greatest()

CREATE OR REPLACE FUNCTION public.get_booked_dates_for_products(_product_ids text[])
 RETURNS TABLE(product_id text, event_date date)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select bi.product_id, d::date as event_date
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  cross join lateral generate_series(
    least(b.event_date, coalesce(b.event_end_date, b.event_date)),
    greatest(b.event_date, coalesce(b.event_end_date, b.event_date)),
    '1 day'::interval) as d
  where bi.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and greatest(b.event_date, coalesce(b.event_end_date, b.event_date)) >= current_date
  union
  select b.product_id, d::date as event_date
  from public.bookings b
  cross join lateral generate_series(
    least(b.event_date, coalesce(b.event_end_date, b.event_date)),
    greatest(b.event_date, coalesce(b.event_end_date, b.event_date)),
    '1 day'::interval) as d
  where b.product_id is not null
    and b.product_id = any(_product_ids)
    and b.status in ('pending','confirmed')
    and greatest(b.event_date, coalesce(b.event_end_date, b.event_date)) >= current_date
  union
  select ib.item_id as product_id, d::date as event_date
  from public.inventory_blackouts ib
  cross join lateral generate_series(least(ib.start_date, ib.end_date), greatest(ib.start_date, ib.end_date), '1 day'::interval) as d
  where ib.item_id = any(_product_ids)
    and greatest(ib.start_date, ib.end_date) >= current_date
  union
  select pid as product_id, d::date as event_date
  from public.global_blackouts gb
  cross join lateral unnest(_product_ids) as pid
  cross join lateral generate_series(least(gb.start_date, gb.end_date), greatest(gb.start_date, gb.end_date), '1 day'::interval) as d
  where greatest(gb.start_date, gb.end_date) >= current_date
$function$;

CREATE OR REPLACE FUNCTION public.is_date_range_available(p_product_ids text[], p_start date, p_end date, p_exclude_booking_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.global_blackouts gb
    WHERE daterange(least(gb.start_date, gb.end_date), greatest(gb.start_date, gb.end_date), '[]')
          && daterange(least(p_start, p_end), greatest(p_start, p_end), '[]')
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.inventory_blackouts ib
    WHERE ib.item_id = ANY(p_product_ids)
      AND daterange(least(ib.start_date, ib.end_date), greatest(ib.start_date, ib.end_date), '[]')
          && daterange(least(p_start, p_end), greatest(p_start, p_end), '[]')
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.booking_items bi
    JOIN public.bookings b ON b.id = bi.booking_id
    JOIN public.inventory_items ii ON ii.id = bi.product_id
    WHERE bi.product_id = ANY(p_product_ids)
      AND b.status IN ('pending','confirmed')
      AND b.id <> p_exclude_booking_id
      AND daterange(
            least(b.event_date, COALESCE(b.event_end_date, b.event_date)),
            greatest(b.event_date, COALESCE(b.event_end_date, b.event_date)), '[]')
          && daterange(least(p_start, p_end), greatest(p_start, p_end), '[]')
    GROUP BY bi.product_id, ii.stock_count
    HAVING COUNT(*) >= COALESCE(ii.stock_count, 1)
  );
$function$;

CREATE OR REPLACE FUNCTION public.prevent_double_booking()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_start date;
  v_end date;
  v_raw_start date;
  v_raw_end date;
  v_status booking_status;
  v_stock int;
  v_overlap_count int;
  v_blackout_count int;
  v_global_count int;
begin
  select event_date, coalesce(event_end_date, event_date), status
    into v_raw_start, v_raw_end, v_status
  from public.bookings where id = new.booking_id;

  if v_status not in ('pending','confirmed') then
    return new;
  end if;

  v_start := least(v_raw_start, v_raw_end);
  v_end := greatest(v_raw_start, v_raw_end);

  select count(*) into v_global_count
  from public.global_blackouts gb
  where daterange(least(gb.start_date, gb.end_date), greatest(gb.start_date, gb.end_date), '[]')
        && daterange(v_start, v_end, '[]');
  if v_global_count > 0 then
    raise exception 'All rentals are blocked on the requested dates (company-wide blackout).'
      using errcode = 'P0001';
  end if;

  select count(*) into v_blackout_count
  from public.inventory_blackouts
  where item_id = new.product_id
    and daterange(least(start_date, end_date), greatest(start_date, end_date), '[]')
        && daterange(v_start, v_end, '[]');
  if v_blackout_count > 0 then
    raise exception 'Item % is unavailable in that date range (blackout).', new.product_name
      using errcode = 'P0001';
  end if;

  select coalesce(stock_count, 1) into v_stock
  from public.inventory_items where id = new.product_id;
  if v_stock is null then v_stock := 1; end if;

  select count(*) into v_overlap_count
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  where bi.product_id = new.product_id
    and b.status in ('pending','confirmed')
    and bi.booking_id <> new.booking_id
    and daterange(
          least(b.event_date, coalesce(b.event_end_date, b.event_date)),
          greatest(b.event_date, coalesce(b.event_end_date, b.event_date)), '[]')
        && daterange(v_start, v_end, '[]');

  if v_overlap_count >= v_stock then
    raise exception 'Item % is fully booked in that date range (% of % units used).', new.product_name, v_overlap_count, v_stock
      using errcode = 'P0001';
  end if;

  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.prevent_double_booking_on_reactivate()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_start date;
  v_end date;
  r record;
  v_stock int;
  v_overlap_count int;
  v_blackout_count int;
  v_global_count int;
begin
  if new.status not in ('pending','confirmed') then
    return new;
  end if;
  if old.status is not distinct from new.status then
    return new;
  end if;

  v_start := least(new.event_date, coalesce(new.event_end_date, new.event_date));
  v_end := greatest(new.event_date, coalesce(new.event_end_date, new.event_date));

  select count(*) into v_global_count
  from public.global_blackouts gb
  where daterange(least(gb.start_date, gb.end_date), greatest(gb.start_date, gb.end_date), '[]')
        && daterange(v_start, v_end, '[]');
  if v_global_count > 0 then
    raise exception 'Cannot reactivate booking: company-wide blackout covers the requested dates.'
      using errcode = 'P0001';
  end if;

  for r in
    select bi.product_id, bi.product_name
    from public.booking_items bi
    where bi.booking_id = new.id
  loop
    select count(*) into v_blackout_count
    from public.inventory_blackouts ib
    where ib.item_id = r.product_id
      and daterange(least(ib.start_date, ib.end_date), greatest(ib.start_date, ib.end_date), '[]')
          && daterange(v_start, v_end, '[]');

    if v_blackout_count > 0 then
      raise exception 'Cannot reactivate booking: % is unavailable on the requested dates (blackout).', r.product_name
        using errcode = 'P0001';
    end if;

    select coalesce(stock_count, 1) into v_stock
    from public.inventory_items where id = r.product_id;
    if v_stock is null then v_stock := 1; end if;

    select count(*) into v_overlap_count
    from public.booking_items bi2
    join public.bookings b2 on b2.id = bi2.booking_id
    where bi2.product_id = r.product_id
      and b2.status in ('pending','confirmed')
      and bi2.booking_id <> new.id
      and daterange(
            least(b2.event_date, coalesce(b2.event_end_date, b2.event_date)),
            greatest(b2.event_date, coalesce(b2.event_end_date, b2.event_date)), '[]')
          && daterange(v_start, v_end, '[]');

    if v_overlap_count >= v_stock then
      raise exception 'Cannot reactivate booking: % is fully booked on the requested dates (% of % units used).',
        r.product_name, v_overlap_count, v_stock
        using errcode = 'P0001';
    end if;
  end loop;

  return new;
end;
$function$;