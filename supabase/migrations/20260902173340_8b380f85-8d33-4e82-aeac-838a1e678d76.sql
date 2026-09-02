ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.guard_and_audit_booking_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor text;
begin
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
$$;

DROP TRIGGER IF EXISTS bookings_guard_and_audit_delete ON public.bookings;
CREATE TRIGGER bookings_guard_and_audit_delete
BEFORE DELETE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.guard_and_audit_booking_delete();

CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON public.bookings (stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent_id ON public.bookings (stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_archived ON public.bookings (archived);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status_updated ON public.webhook_events (status, updated_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_entity ON public.admin_audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action_created ON public.admin_audit_log (action, created_at DESC);