
-- Lock down email_templates: admins only
DROP POLICY IF EXISTS "anyone reads email templates" ON public.email_templates;
CREATE POLICY "admins read email templates" ON public.email_templates
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Lock down app_settings: admins only; expose public pricing via SECURITY DEFINER RPC
DROP POLICY IF EXISTS "anyone reads app settings" ON public.app_settings;
CREATE POLICY "admins read app settings" ON public.app_settings
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_public_pricing()
RETURNS TABLE (
  tax_rate numeric,
  damage_waiver_rate numeric,
  default_deposit numeric,
  online_checkout_fee_rate numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tax_rate, damage_waiver_rate, default_deposit, online_checkout_fee_rate
  FROM public.app_settings WHERE id = 1
$$;

GRANT EXECUTE ON FUNCTION public.get_public_pricing() TO anon, authenticated;
