-- 1. needs_review + finalize_error on bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS needs_review_at timestamptz,
  ADD COLUMN IF NOT EXISTS finalize_error text;

CREATE INDEX IF NOT EXISTS bookings_needs_review_idx
  ON public.bookings (needs_review_at DESC) WHERE needs_review;

-- 2. durable cart snapshot on the email log
ALTER TABLE public.email_send_log
  ADD COLUMN IF NOT EXISTS payload_snapshot jsonb;

-- 3. idempotency: one booking per PaymentIntent
CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_payment_intent_uniq
  ON public.bookings (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

-- 4. webhook event ledger (idempotency by Stripe event.id)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  session_id text,
  payment_intent_id text,
  status text NOT NULL DEFAULT 'processing',
  result text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read webhook events"
  ON public.webhook_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER webhook_events_set_updated_at
  BEFORE UPDATE ON public.webhook_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. atomic booking + items creation
CREATE OR REPLACE FUNCTION public.create_booking_with_items(p_booking jsonb, p_items jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_id uuid;
begin
  insert into public.bookings select * from jsonb_populate_record(null::public.bookings, p_booking)
  returning id into v_id;

  insert into public.booking_items (booking_id, product_id, product_name, product_price, unit_price)
  select v_id,
         it->>'product_id',
         it->>'product_name',
         (it->>'product_price')::numeric,
         (it->>'unit_price')::numeric
  from jsonb_array_elements(p_items) as it;

  return v_id;
end;
$$;

REVOKE ALL ON FUNCTION public.create_booking_with_items(jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_booking_with_items(jsonb, jsonb) TO service_role;

-- 6. pending_bookings retention: 6 hours -> 30 days
SELECT cron.unschedule('purge-stale-pending-bookings');
SELECT cron.schedule(
  'purge-stale-pending-bookings',
  '0 * * * *',
  $cron$ delete from public.pending_bookings where created_at < now() - interval '30 days'; $cron$
);

-- 7. daily Stripe reconciliation at 11:00 UTC (7:00 AM Eastern)
SELECT cron.schedule(
  'stripe-reconcile-daily',
  '0 11 * * *',
  $cron$
  select net.http_post(
    url := 'https://wwyyfgngdwaabzwzvlml.supabase.co/functions/v1/stripe-reconcile',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'x-cron-secret','0733f340537774e7fcf4f4eed2892f2edafbcbdc6a2c8e70'
    ),
    body := jsonb_build_object('mode','cron','environment','live','days',30)
  );
  $cron$
);