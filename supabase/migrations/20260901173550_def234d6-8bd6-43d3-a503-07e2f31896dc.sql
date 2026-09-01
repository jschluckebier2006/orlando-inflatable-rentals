CREATE OR REPLACE FUNCTION public.create_booking_with_items(p_booking jsonb, p_items jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id uuid;
  v_defaults jsonb;
begin
  v_id := coalesce(nullif(p_booking->>'id', '')::uuid, gen_random_uuid());

  -- jsonb_populate_record(null::bookings, ...) yields NULL for every key the
  -- payload omits, which would violate the NOT NULL columns that normally rely
  -- on a column default. Seed those defaults explicitly, then let the caller's
  -- payload override anything it actually supplies.
  v_defaults := jsonb_build_object(
    'id', v_id,
    'created_at', now(),
    'updated_at', now(),
    'status', 'pending',
    'duration_type', '7hour',
    'price_multiplier', 1,
    'deposit_amount', 0,
    'amount_paid', 0,
    'payment_status', 'unpaid',
    'damage_waiver_selected', false,
    'damage_waiver_amount', 0,
    'tax_rate', 0,
    'tax_amount', 0,
    'delivery_fee', 0,
    'checkout_fee_amount', 0,
    'discount_amount', 0,
    'needs_review', false
  );

  insert into public.bookings
  select * from jsonb_populate_record(null::public.bookings, v_defaults || p_booking || jsonb_build_object('id', v_id));

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