CREATE OR REPLACE FUNCTION public.guard_and_audit_booking_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_actor text;
  v_authorized boolean;
begin
  -- A deliberate purge run through public.purge_paid_booking() marks itself
  -- authorized for exactly one booking id, for the duration of one transaction.
  v_authorized := coalesce(current_setting('app.purge_authorized', true), '') = old.id::text;

  if v_authorized then
    -- purge_paid_booking() already wrote a richer audit row (full snapshot of
    -- booking + items + payments + activity), so do not duplicate it here.
    return old;
  end if;

  if coalesce(old.amount_paid, 0) > 0 or old.stripe_payment_intent_id is not null then
    raise exception 'Booking % has a captured payment and cannot be deleted. Cancel and archive it instead.', old.id
      using errcode = 'P0001';
  end if;

  begin
    v_actor := coalesce(
      nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', ''),
      'system/service'
    );
  exception when others then
    v_actor := 'system/service';
  end;

  insert into public.admin_audit_log (actor_email, entity_type, entity_id, action, summary, before, after, metadata)
  values (
    v_actor,
    'booking',
    old.id::text,
    'hard_delete',
    format('Hard-deleted booking for %s (%s) on %s', coalesce(old.customer_name,'unknown'), coalesce(old.customer_email,'no email'), old.event_date),
    to_jsonb(old),
    '{}'::jsonb,
    jsonb_build_object(
      'customer_name', old.customer_name,
      'customer_email', old.customer_email,
      'customer_phone', old.customer_phone,
      'event_date', old.event_date,
      'event_end_date', old.event_end_date,
      'status', old.status,
      'total_amount', old.total_amount,
      'amount_paid', old.amount_paid,
      'stripe_session_id', old.stripe_session_id,
      'stripe_payment_intent_id', old.stripe_payment_intent_id,
      'deleted_at', now()
    )
  );

  return old;
end;
$function$;

CREATE OR REPLACE FUNCTION public.purge_paid_booking(p_booking_id uuid, p_reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_actor text;
  v_booking public.bookings%rowtype;
  v_items jsonb;
  v_payments jsonb;
  v_activity jsonb;
  v_audit_id uuid;
begin
  if auth.uid() is null or not public.has_role(auth.uid(), 'admin') then
    raise exception 'Only admins can permanently delete a booking.' using errcode = '42501';
  end if;

  if p_reason is null or length(btrim(p_reason)) < 3 then
    raise exception 'A written reason is required to permanently delete a booking.' using errcode = 'P0001';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id;
  if not found then
    raise exception 'Booking % not found.', p_booking_id using errcode = 'P0002';
  end if;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at), '[]'::jsonb) into v_items
  from public.booking_items t where t.booking_id = p_booking_id;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at), '[]'::jsonb) into v_payments
  from public.booking_payments t where t.booking_id = p_booking_id;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.created_at), '[]'::jsonb) into v_activity
  from public.booking_activity t where t.booking_id = p_booking_id;

  v_actor := coalesce(
    nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', ''),
    auth.uid()::text
  );

  insert into public.admin_audit_log (actor_email, entity_type, entity_id, action, summary, before, after, metadata)
  values (
    v_actor,
    'booking',
    p_booking_id::text,
    'hard_delete',
    format('Permanently deleted booking for %s (%s) on %s — %s',
           coalesce(v_booking.customer_name,'unknown'),
           coalesce(v_booking.customer_email,'no email'),
           v_booking.event_date,
           btrim(p_reason)),
    jsonb_build_object(
      'booking', to_jsonb(v_booking),
      'booking_items', v_items,
      'booking_payments', v_payments,
      'booking_activity', v_activity
    ),
    '{}'::jsonb,
    jsonb_build_object(
      'purge', true,
      'reason', btrim(p_reason),
      'customer_name', v_booking.customer_name,
      'customer_email', v_booking.customer_email,
      'customer_phone', v_booking.customer_phone,
      'event_date', v_booking.event_date,
      'event_end_date', v_booking.event_end_date,
      'status', v_booking.status,
      'total_amount', v_booking.total_amount,
      'amount_paid', v_booking.amount_paid,
      'stripe_session_id', v_booking.stripe_session_id,
      'stripe_payment_intent_id', v_booking.stripe_payment_intent_id,
      'stripe_charge_untouched', true,
      'items_count', jsonb_array_length(v_items),
      'payments_count', jsonb_array_length(v_payments),
      'activity_count', jsonb_array_length(v_activity),
      'deleted_at', now()
    )
  )
  returning id into v_audit_id;

  perform set_config('app.purge_authorized', p_booking_id::text, true);

  delete from public.booking_items where booking_id = p_booking_id;
  delete from public.booking_payments where booking_id = p_booking_id;
  delete from public.booking_activity where booking_id = p_booking_id;
  delete from public.bookings where id = p_booking_id;

  perform set_config('app.purge_authorized', '', true);

  return jsonb_build_object(
    'audit_id', v_audit_id,
    'booking_id', p_booking_id,
    'items_deleted', jsonb_array_length(v_items),
    'payments_deleted', jsonb_array_length(v_payments),
    'activity_deleted', jsonb_array_length(v_activity)
  );
end;
$function$;

REVOKE ALL ON FUNCTION public.purge_paid_booking(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.purge_paid_booking(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.purge_paid_booking(uuid, text) TO authenticated;