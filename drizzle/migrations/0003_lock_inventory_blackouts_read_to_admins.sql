DROP POLICY IF EXISTS "anyone reads blackouts" ON public.inventory_blackouts;
REVOKE SELECT ON public.inventory_blackouts FROM anon;