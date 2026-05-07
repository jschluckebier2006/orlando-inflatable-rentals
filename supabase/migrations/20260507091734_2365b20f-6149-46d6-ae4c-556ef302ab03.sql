
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.prevent_double_booking() from public, anon, authenticated;

revoke execute on function public.has_role(uuid, app_role) from public, anon;
grant execute on function public.has_role(uuid, app_role) to authenticated, service_role;

revoke execute on function public.get_booked_dates(text) from public;
grant execute on function public.get_booked_dates(text) to anon, authenticated, service_role;

revoke execute on function public.get_booked_dates_for_products(text[]) from public;
grant execute on function public.get_booked_dates_for_products(text[]) to anon, authenticated, service_role;
