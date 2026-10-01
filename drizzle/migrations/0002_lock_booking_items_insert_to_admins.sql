DROP POLICY IF EXISTS "anyone can create booking items" ON public.booking_items;
CREATE POLICY "admins insert booking items" ON public.booking_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
REVOKE INSERT ON public.booking_items FROM anon;