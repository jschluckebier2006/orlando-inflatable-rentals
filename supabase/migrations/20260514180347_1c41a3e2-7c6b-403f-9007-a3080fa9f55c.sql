-- Chip 1 Option A: tighten linter findings without altering booking logic.

-- (1) Trigger-only functions: revoke direct EXECUTE. Triggers continue to fire
-- because triggers run as the table owner, not the calling role.
REVOKE EXECUTE ON FUNCTION public.prevent_double_booking() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recompute_booking_payment_totals() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;

-- (2) has_role: revoke from anon (idempotent if already revoked).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;

-- (3) Storage: drop the broad anon LIST/SELECT policy on inventory-images.
-- The bucket is public, so direct CDN URLs (/object/public/...) still serve files
-- without RLS. Removing this policy only blocks the list-all API, which is what
-- the linter flags. Admin upload/update/delete policies are untouched.
DROP POLICY IF EXISTS "public reads inventory images bucket" ON storage.objects;