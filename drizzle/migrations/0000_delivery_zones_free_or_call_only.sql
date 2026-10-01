UPDATE public.delivery_zones SET status='call', fee=0 WHERE status='paid';
UPDATE public.delivery_zones SET fee=0 WHERE fee <> 0;
ALTER TABLE public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_status_check;
ALTER TABLE public.delivery_zones ADD CONSTRAINT delivery_zones_status_check CHECK (status IN ('free','call'));
ALTER TABLE public.delivery_zones ADD CONSTRAINT delivery_zones_fee_zero CHECK (fee = 0);