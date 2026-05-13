ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS discount_type text,
  ADD COLUMN IF NOT EXISTS discount_value numeric(10,2),
  ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subtotal numeric(10,2),
  ADD COLUMN IF NOT EXISTS discount_reason text;

DO $$ BEGIN
  ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_discount_type_check;
EXCEPTION WHEN others THEN NULL; END $$;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_discount_type_check
  CHECK (discount_type IS NULL OR discount_type IN ('amount', 'percent'));