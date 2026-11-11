-- Requests from customers whose ZIP can't be booked online ("call" ZIPs).
-- Written only by the submit-delivery-request server function (service role);
-- only admins can read or manage them.
CREATE TABLE public.delivery_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  event_date date,
  event_zip text NOT NULL,
  items text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'new',
  CONSTRAINT delivery_requests_status_check CHECK (status IN ('new', 'contacted', 'booked', 'closed'))
);

GRANT SELECT, UPDATE, DELETE ON public.delivery_requests TO authenticated;
GRANT ALL ON public.delivery_requests TO service_role;

ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins read delivery requests" ON public.delivery_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update delivery requests" ON public.delivery_requests
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete delivery requests" ON public.delivery_requests
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX delivery_requests_created_at_idx ON public.delivery_requests (created_at DESC);

CREATE TRIGGER delivery_requests_set_updated_at
  BEFORE UPDATE ON public.delivery_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();