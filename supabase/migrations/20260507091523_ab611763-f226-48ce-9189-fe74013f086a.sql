
create policy "deny client select on pending bookings"
on public.pending_bookings for select to authenticated, anon using (false);
create policy "deny client insert on pending bookings"
on public.pending_bookings for insert to authenticated, anon with check (false);
create policy "deny client update on pending bookings"
on public.pending_bookings for update to authenticated, anon using (false) with check (false);
create policy "deny client delete on pending bookings"
on public.pending_bookings for delete to authenticated, anon using (false);
