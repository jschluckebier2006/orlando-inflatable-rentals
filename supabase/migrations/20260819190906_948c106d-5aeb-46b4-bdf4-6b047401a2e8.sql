REVOKE UPDATE, DELETE, TRUNCATE ON public.email_template_versions FROM authenticated, anon;

DROP POLICY IF EXISTS "No one can update email template versions" ON public.email_template_versions;
DROP POLICY IF EXISTS "No one can delete email template versions" ON public.email_template_versions;

CREATE POLICY "No one can update email template versions"
ON public.email_template_versions
AS RESTRICTIVE
FOR UPDATE
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "No one can delete email template versions"
ON public.email_template_versions
AS RESTRICTIVE
FOR DELETE
TO authenticated, anon
USING (false);