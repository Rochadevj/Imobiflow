BEGIN;

ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.tenant_users;

CREATE POLICY "Users can view their tenant memberships"
ON public.tenant_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

NOTIFY pgrst, 'reload schema';

COMMIT;
