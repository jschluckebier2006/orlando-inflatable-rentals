-- Inventory tables
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  category text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  description text,
  dimensions text,
  capacity text,
  age_range text,
  features text[],
  legacy_image text,
  primary_image_url text,
  stock_count int NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inventory_items_category_idx ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS inventory_items_sort_idx ON public.inventory_items(category, sort_order);

CREATE TABLE IF NOT EXISTS public.inventory_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text,
  sort_order int NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inventory_images_item_idx ON public.inventory_images(item_id, sort_order);

CREATE TABLE IF NOT EXISTS public.inventory_blackouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS inventory_blackouts_item_idx ON public.inventory_blackouts(item_id, start_date);

CREATE TABLE IF NOT EXISTS public.inventory_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
  performed_at date NOT NULL DEFAULT CURRENT_DATE,
  kind text NOT NULL DEFAULT 'note',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inventory_maintenance_item_idx ON public.inventory_maintenance(item_id, performed_at DESC);

DROP TRIGGER IF EXISTS trg_inventory_items_updated_at ON public.inventory_items;
CREATE TRIGGER trg_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_blackouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads inventory items" ON public.inventory_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone reads inventory images" ON public.inventory_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone reads blackouts" ON public.inventory_blackouts FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admins write items" ON public.inventory_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write images" ON public.inventory_images FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "admins write blackouts" ON public.inventory_blackouts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "admins all maintenance" ON public.inventory_maintenance FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory-images', 'inventory-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public reads inventory images bucket"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'inventory-images');

CREATE POLICY "admins upload inventory images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'inventory-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update inventory images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'inventory-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete inventory images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'inventory-images' AND has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.prevent_double_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_start date;
  v_end date;
  v_status booking_status;
  v_stock int;
  v_overlap_count int;
  v_blackout_count int;
begin
  select event_date, coalesce(event_end_date, event_date), status
    into v_start, v_end, v_status
  from public.bookings where id = new.booking_id;

  if v_status not in ('pending','confirmed') then
    return new;
  end if;

  select count(*) into v_blackout_count
  from public.inventory_blackouts
  where item_id = new.product_id
    and daterange(start_date, end_date, '[]') && daterange(v_start, v_end, '[]');
  if v_blackout_count > 0 then
    raise exception 'Item % is unavailable in that date range (blackout).', new.product_name
      using errcode = 'P0001';
  end if;

  select coalesce(stock_count, 1) into v_stock
  from public.inventory_items where id = new.product_id;
  if v_stock is null then v_stock := 1; end if;

  select count(*) into v_overlap_count
  from public.booking_items bi
  join public.bookings b on b.id = bi.booking_id
  where bi.product_id = new.product_id
    and b.status in ('pending','confirmed')
    and bi.booking_id <> new.booking_id
    and daterange(b.event_date, coalesce(b.event_end_date, b.event_date), '[]')
        && daterange(v_start, v_end, '[]');

  if v_overlap_count >= v_stock then
    raise exception 'Item % is fully booked in that date range (% of % units used).', new.product_name, v_overlap_count, v_stock
      using errcode = 'P0001';
  end if;

  return new;
end;
$function$;