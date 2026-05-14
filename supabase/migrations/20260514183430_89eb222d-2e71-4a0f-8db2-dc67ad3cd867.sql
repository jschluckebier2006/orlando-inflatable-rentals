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
begin
  -- Only run when status transitions INTO an active state from a different value.
  if new.status not in ('pending','confirmed') then
    return new;
  end if;
  if old.status is not distinct from new.status then
    return new;
  end if;

  v_start := new.event_date;
  v_end := coalesce(new.event_end_date, new.event_date);

  for r in
    select bi.product_id, bi.product_name
    from public.booking_items bi
    where bi.booking_id = new.id
  loop
    -- Blackout check
    select count(*) into v_blackout_count
    from public.inventory_blackouts ib
    where ib.item_id = r.product_id
      and daterange(ib.start_date, ib.end_date, '[]') && daterange(v_start, v_end, '[]');

    if v_blackout_count > 0 then
      raise exception 'Cannot reactivate booking: % is unavailable on the requested dates (blackout).', r.product_name
        using errcode = 'P0001';
    end if;

    -- Stock-overlap check (exclude self)
    select coalesce(stock_count, 1) into v_stock
    from public.inventory_items where id = r.product_id;
    if v_stock is null then v_stock := 1; end if;

    select count(*) into v_overlap_count
    from public.booking_items bi2
    join public.bookings b2 on b2.id = bi2.booking_id
    where bi2.product_id = r.product_id
      and b2.status in ('pending','confirmed')
      and bi2.booking_id <> new.id
      and daterange(b2.event_date, coalesce(b2.event_end_date, b2.event_date), '[]')
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

REVOKE EXECUTE ON FUNCTION public.prevent_double_booking_on_reactivate() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_double_booking_on_reactivate ON public.bookings;

CREATE TRIGGER prevent_double_booking_on_reactivate
BEFORE UPDATE OF status ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.prevent_double_booking_on_reactivate();