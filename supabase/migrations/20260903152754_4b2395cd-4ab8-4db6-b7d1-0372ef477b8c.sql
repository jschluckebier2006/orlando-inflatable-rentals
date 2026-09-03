CREATE OR REPLACE FUNCTION public.create_booking_with_items(p_booking jsonb, p_items jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id uuid;
  v_payload jsonb;
  v_cols text;
  v_sql text;
begin
  v_id := coalesce(nullif(p_booking->>'id', '')::uuid, gen_random_uuid());

  -- Only insert the columns actually supplied by the caller (plus id/timestamps).
  -- Everything else falls back to the column's own DEFAULT, so adding a new
  -- NOT NULL DEFAULT column can never break checkout again.
  v_payload := (p_booking - 'id' - 'created_at' - 'updated_at')
               || jsonb_build_object('id', v_id, 'created_at', now(), 'updated_at', now());

  -- Drop keys that aren't real columns, and drop explicit NULLs on NOT NULL
  -- columns that have a default (let the default win).
  select string_agg(format('%I', c.column_name), ', ' order by c.ordinal_position)
    into v_cols
  from information_schema.columns c
  join lateral (select v_payload ? c.column_name as present) k on true
  where c.table_schema = 'public'
    and c.table_name = 'bookings'
    and k.present
    and not (
      jsonb_typeof(v_payload -> c.column_name) = 'null'
      and c.is_nullable = 'NO'
      and c.column_default is not null
    );

  if v_cols is null then
    raise exception 'create_booking_with_items: no valid booking columns supplied';
  end if;

  v_sql := format(
    'insert into public.bookings (%s) select %s from jsonb_populate_record(null::public.bookings, $1)',
    v_cols, v_cols
  );
  execute v_sql using v_payload;

  insert into public.booking_items (booking_id, product_id, product_name, product_price, unit_price)
  select v_id,
         it->>'product_id',
         it->>'product_name',
         (it->>'product_price')::numeric,
         (it->>'unit_price')::numeric
  from jsonb_array_elements(p_items) as it;

  return v_id;
end;
$function$;