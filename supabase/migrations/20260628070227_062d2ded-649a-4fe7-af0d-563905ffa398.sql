
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS google_reviews_count integer,
  ADD COLUMN IF NOT EXISTS google_rating numeric,
  ADD COLUMN IF NOT EXISTS google_reviews_updated_at timestamptz;

CREATE OR REPLACE FUNCTION public.get_public_google_reviews()
RETURNS TABLE(reviews_count integer, rating numeric, updated_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT google_reviews_count, google_rating, google_reviews_updated_at
  FROM public.app_settings WHERE id = 1
$$;

GRANT EXECUTE ON FUNCTION public.get_public_google_reviews() TO anon, authenticated;
