REVOKE ALL ON FUNCTION public.guard_and_audit_booking_delete() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.prevent_double_booking() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.prevent_double_booking_on_reactivate() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.recompute_booking_payment_totals() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.create_booking_with_items(jsonb, jsonb) FROM anon, authenticated, public;