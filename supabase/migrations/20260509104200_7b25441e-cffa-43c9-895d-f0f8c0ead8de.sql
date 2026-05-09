-- App-wide pricing settings (single row, id = 1)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  tax_rate numeric NOT NULL DEFAULT 0.07,
  damage_waiver_rate numeric NOT NULL DEFAULT 0.10,
  default_deposit numeric NOT NULL DEFAULT 50,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text,
  CONSTRAINT app_settings_singleton CHECK (id = 1)
);

INSERT INTO public.app_settings (id, tax_rate, damage_waiver_rate, default_deposit)
VALUES (1, 0.07, 0.10, 50)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads app settings"
  ON public.app_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write app settings"
  ON public.app_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER app_settings_set_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Delivery zones
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  zip text PRIMARY KEY,
  city text NOT NULL,
  fee numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('free','paid','call')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads delivery zones"
  ON public.delivery_zones FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write delivery zones"
  ON public.delivery_zones FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER delivery_zones_set_updated_at
  BEFORE UPDATE ON public.delivery_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed delivery zones with current static values
INSERT INTO public.delivery_zones (zip, city, fee, status) VALUES
  ('32801','Orlando',0,'free'),
  ('32803','Orlando',0,'free'),
  ('32804','Orlando',0,'free'),
  ('32805','Orlando',0,'free'),
  ('32806','Orlando',0,'free'),
  ('32807','Azalea Park',0,'free'),
  ('32808','Orlando',0,'free'),
  ('32809','Orlando',0,'free'),
  ('32811','Orlando',0,'free'),
  ('32812','Orlando',0,'free'),
  ('32814','Baldwin Park',0,'free'),
  ('32817','Orlando',0,'free'),
  ('32818','Orlando',0,'free'),
  ('32822','Orlando',0,'free'),
  ('32824','Orlando',0,'free'),
  ('32825','Orlando',0,'free'),
  ('32826','Alafaya',0,'free'),
  ('32827','Orlando / Lake Nona',0,'free'),
  ('32829','Alafaya',0,'free'),
  ('32831','Orlando',0,'free'),
  ('32833','Wedgefield',0,'free'),
  ('32835','Orlando',0,'free'),
  ('32837','Orlando',0,'free'),
  ('32733','Goldenrod',0,'free'),
  ('32789','Winter Park',0,'free'),
  ('32792','Aloma / Winter Park',0,'free'),
  ('32707','Casselberry',0,'free'),
  ('32701','Altamonte Springs',0,'free'),
  ('32714','Altamonte Springs',0,'free'),
  ('32765','Oviedo',0,'free'),
  ('32766','Chuluota',0,'free'),
  ('32819','Orlando / Doctor Phillips',50,'paid'),
  ('32828','Avalon Park / Waterford Lakes',50,'paid'),
  ('32832','Lake Nona',50,'paid'),
  ('32708','Winter Springs',75,'paid'),
  ('32836','Orlando / Doctor Phillips',75,'paid'),
  ('34761','Ocoee',75,'paid'),
  ('34786','Windermere',75,'paid'),
  ('32709','Christmas',0,'call'),
  ('32820','Bithlo',0,'call')
ON CONFLICT (zip) DO NOTHING;