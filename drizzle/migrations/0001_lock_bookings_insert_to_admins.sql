DROP POLICY IF EXISTS "anyone can create booking" ON public.bookings;
CREATE POLICY "admins insert bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
REVOKE INSERT ON public.bookings FROM anon;