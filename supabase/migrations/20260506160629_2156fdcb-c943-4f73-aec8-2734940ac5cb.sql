ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'awaiting_payment' BEFORE 'pending';

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS amount_paid numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_due numeric,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS total_amount numeric;

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN ('unpaid','deposit_paid','paid_in_full','refunded'));

CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_id_uniq
  ON public.bookings (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.pending_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  amount_total numeric NOT NULL,
  deposit_amount numeric NOT NULL,
  amount_charged numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pending_bookings ENABLE ROW LEVEL SECURITY;