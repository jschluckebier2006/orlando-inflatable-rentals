ALTER TABLE public.booking_payments DROP CONSTRAINT IF EXISTS booking_payments_method_check;
ALTER TABLE public.booking_payments ADD CONSTRAINT booking_payments_method_check
  CHECK (method = ANY (ARRAY[
    'cash'::text,
    'check'::text,
    'card_external'::text,
    'stripe'::text,
    'stripe_link'::text,
    'stripe_deposit'::text,
    'stripe_captured'::text
  ]));