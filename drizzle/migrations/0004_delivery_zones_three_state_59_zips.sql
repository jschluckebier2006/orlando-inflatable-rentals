-- Delivery zones become three-state: free / fee / call.
ALTER TABLE public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_status_check;
ALTER TABLE public.delivery_zones DROP CONSTRAINT IF EXISTS delivery_zones_fee_zero;
ALTER TABLE public.delivery_zones
  ADD CONSTRAINT delivery_zones_status_check CHECK (status IN ('free', 'fee', 'call'));
-- A "fee" ZIP must carry a real fee; "free" and "call" ZIPs always carry 0.
ALTER TABLE public.delivery_zones
  ADD CONSTRAINT delivery_zones_fee_matches_status CHECK (
    (status = 'fee' AND fee > 0 AND fee <= 500)
    OR (status IN ('free', 'call') AND fee = 0)
  );

-- Replace the whole ZIP list (DB rows override the code copies at runtime,
-- so no old row may survive).
DELETE FROM public.delivery_zones WHERE zip IS NOT NULL;
INSERT INTO public.delivery_zones (zip, city, fee, status) VALUES
  ('32701', 'Altamonte Springs', 0, 'free'),
  ('32707', 'Casselberry', 0, 'free'),
  ('32708', 'Winter Springs', 0, 'free'),
  ('32709', 'Christmas', 0, 'free'),
  ('32730', 'Casselberry', 0, 'free'),
  ('32733', 'Goldenrod', 0, 'free'),
  ('32751', 'Maitland', 0, 'free'),
  ('32765', 'Oviedo', 0, 'free'),
  ('32766', 'Chuluota', 0, 'free'),
  ('32789', 'Winter Park', 0, 'free'),
  ('32792', 'Aloma / Winter Park', 0, 'free'),
  ('32801', 'Orlando', 0, 'free'),
  ('32803', 'Orlando', 0, 'free'),
  ('32804', 'Orlando', 0, 'free'),
  ('32805', 'Orlando', 0, 'free'),
  ('32806', 'Orlando', 0, 'free'),
  ('32807', 'Azalea Park', 0, 'free'),
  ('32809', 'Orlando', 0, 'free'),
  ('32812', 'Orlando', 0, 'free'),
  ('32814', 'Baldwin Park', 0, 'free'),
  ('32817', 'Orlando', 0, 'free'),
  ('32819', 'Orlando / Doctor Phillips', 0, 'free'),
  ('32820', 'Bithlo', 0, 'free'),
  ('32822', 'Orlando', 0, 'free'),
  ('32824', 'Orlando', 0, 'free'),
  ('32825', 'Orlando', 0, 'free'),
  ('32826', 'Alafaya', 0, 'free'),
  ('32827', 'Orlando / Lake Nona', 0, 'free'),
  ('32828', 'Avalon Park / Waterford Lakes', 0, 'free'),
  ('32829', 'Alafaya', 0, 'free'),
  ('32831', 'Orlando', 0, 'free'),
  ('32832', 'Lake Nona', 0, 'free'),
  ('32833', 'Wedgefield', 0, 'free'),
  ('32837', 'Orlando', 0, 'free'),
  ('32839', 'Orlando', 0, 'free'),
  ('32703', 'Apopka', 50, 'fee'),
  ('32714', 'Altamonte Springs', 50, 'fee'),
  ('32746', 'Lake Mary', 50, 'fee'),
  ('32750', 'Longwood', 50, 'fee'),
  ('32771', 'Sanford', 50, 'fee'),
  ('32773', 'Sanford', 50, 'fee'),
  ('32779', 'Longwood', 50, 'fee'),
  ('32808', 'Orlando', 50, 'fee'),
  ('32810', 'Orlando', 50, 'fee'),
  ('32811', 'Orlando', 50, 'fee'),
  ('32818', 'Orlando', 50, 'fee'),
  ('32821', 'Orlando', 50, 'fee'),
  ('32835', 'Orlando', 50, 'fee'),
  ('32836', 'Orlando / Doctor Phillips', 50, 'fee'),
  ('34734', 'Gotha', 50, 'fee'),
  ('34761', 'Ocoee', 50, 'fee'),
  ('34786', 'Windermere', 50, 'fee'),
  ('34787', 'Winter Garden', 50, 'fee'),
  ('32712', 'Apopka', 0, 'call'),
  ('32830', 'Orlando', 0, 'call'),
  ('34711', 'Clermont', 0, 'call'),
  ('34714', 'Clermont', 0, 'call'),
  ('34715', 'Clermont', 0, 'call'),
  ('34760', 'Oakland', 0, 'call');