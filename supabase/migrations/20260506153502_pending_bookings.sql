-- Holds in-flight booking payloads while Stripe checkout is open
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

-- No client policies — service role only via edge functions.
