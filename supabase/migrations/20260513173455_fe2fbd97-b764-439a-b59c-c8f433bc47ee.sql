
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_at  timestamptz NULL,
  ADD COLUMN IF NOT EXISTS cancel_reason text        NULL;

ALTER TABLE public.booking_activity
  ADD COLUMN IF NOT EXISTS actor_user_id uuid NULL REFERENCES auth.users(id);

CREATE OR REPLACE FUNCTION public.is_date_range_available(
  p_product_ids text[],
  p_start date,
  p_end date,
  p_exclude_booking_id uuid
) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.inventory_blackouts ib
    WHERE ib.item_id = ANY(p_product_ids)
      AND daterange(ib.start_date, ib.end_date, '[]')
          && daterange(p_start, p_end, '[]')
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.booking_items bi
    JOIN public.bookings b ON b.id = bi.booking_id
    JOIN public.inventory_items ii ON ii.id = bi.product_id
    WHERE bi.product_id = ANY(p_product_ids)
      AND b.status IN ('pending','confirmed')
      AND b.id <> p_exclude_booking_id
      AND daterange(b.event_date, COALESCE(b.event_end_date, b.event_date), '[]')
          && daterange(p_start, p_end, '[]')
    GROUP BY bi.product_id, ii.stock_count
    HAVING COUNT(*) >= COALESCE(ii.stock_count, 1)
  );
$$;

REVOKE ALL ON FUNCTION public.is_date_range_available(text[], date, date, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_date_range_available(text[], date, date, uuid) TO authenticated;
