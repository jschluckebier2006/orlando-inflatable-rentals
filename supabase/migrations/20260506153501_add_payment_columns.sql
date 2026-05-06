-- Payment fields on bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS total_amount numeric;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN ('unpaid','deposit_paid','paid_in_full','refunded'));

CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_id_uniq
  ON public.bookings (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
