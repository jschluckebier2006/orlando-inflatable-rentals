
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS subtotal numeric,
  ADD COLUMN IF NOT EXISTS damage_waiver_selected boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS damage_waiver_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 0.07,
  ADD COLUMN IF NOT EXISTS tax_amount numeric NOT NULL DEFAULT 0;
