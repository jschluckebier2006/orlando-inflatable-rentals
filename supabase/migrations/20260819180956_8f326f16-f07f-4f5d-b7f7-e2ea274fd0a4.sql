ALTER TABLE public.inventory_items
  ADD COLUMN IF NOT EXISTS bookable_online boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS specs jsonb NOT NULL DEFAULT '[]'::jsonb;