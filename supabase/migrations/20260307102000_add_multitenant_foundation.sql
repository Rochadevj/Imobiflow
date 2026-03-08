BEGIN;

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  site_title TEXT,
  tagline TEXT,
  logo_url TEXT,
  support_email TEXT,
  phone TEXT,
  whatsapp TEXT,
  creci TEXT,
  city TEXT,
  state TEXT,
  primary_color TEXT NOT NULL DEFAULT '#f59e0b',
  secondary_color TEXT NOT NULL DEFAULT '#0f172a',
  accent_color TEXT NOT NULL DEFAULT '#22c55e',
  custom_domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tenants_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE TABLE IF NOT EXISTS public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tenant_users_role_check CHECK (role IN ('owner', 'manager', 'broker')),
  CONSTRAINT tenant_users_unique_membership UNIQUE (tenant_id, user_id)
);

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE RESTRICT;

ALTER TABLE public.property_views
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON public.properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_property_views_tenant_id ON public.property_views(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain ON public.tenants(custom_domain);

CREATE OR REPLACE FUNCTION public.slugify_text(input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  cleaned TEXT;
BEGIN
  cleaned := lower(regexp_replace(COALESCE(input, ''), '[^a-zA-Z0-9]+', '-', 'g'));
  cleaned := regexp_replace(cleaned, '(^-+|-+$)', '', 'g');
  cleaned := regexp_replace(cleaned, '-{2,}', '-', 'g');
  RETURN cleaned;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tu.tenant_id
  FROM public.tenant_users tu
  WHERE tu.user_id = auth.uid()
  ORDER BY
    CASE tu.role
      WHEN 'owner' THEN 0
      WHEN 'manager' THEN 1
      ELSE 2
    END,
    tu.created_at
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.create_tenant_for_current_user(
  p_name TEXT,
  p_slug TEXT DEFAULT NULL,
  p_support_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_whatsapp TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_existing_tenant UUID;
  v_name TEXT := NULLIF(trim(COALESCE(p_name, '')), '');
  v_slug TEXT := public.slugify_text(COALESCE(NULLIF(trim(COALESCE(p_slug, '')), ''), p_name));
  v_tenant_id UUID;
  v_demo_tenant_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado.';
  END IF;

  SELECT public.get_current_tenant_id() INTO v_existing_tenant;
  IF v_existing_tenant IS NOT NULL THEN
    RETURN v_existing_tenant;
  END IF;

  IF v_name IS NULL THEN
    RAISE EXCEPTION 'Informe o nome da imobiliária.';
  END IF;

  IF v_slug = '' THEN
    v_slug := 'imobiliaria-' || substr(v_user_id::text, 1, 8);
  END IF;

  IF EXISTS (SELECT 1 FROM public.tenants t WHERE t.slug = v_slug) THEN
    RAISE EXCEPTION 'Este identificador de site já está em uso.';
  END IF;

  INSERT INTO public.tenants (
    name,
    slug,
    site_title,
    support_email,
    phone,
    whatsapp,
    subdomain
  )
  VALUES (
    v_name,
    v_slug,
    v_name,
    NULLIF(trim(COALESCE(p_support_email, '')), ''),
    NULLIF(trim(COALESCE(p_phone, '')), ''),
    NULLIF(trim(COALESCE(p_whatsapp, '')), ''),
    v_slug
  )
  RETURNING id INTO v_tenant_id;

  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (v_tenant_id, v_user_id, 'owner');

  SELECT id
  INTO v_demo_tenant_id
  FROM public.tenants
  WHERE is_demo = true
  ORDER BY created_at
  LIMIT 1;

  UPDATE public.properties
  SET tenant_id = v_tenant_id
  WHERE user_id = v_user_id
    AND (tenant_id IS NULL OR tenant_id = v_demo_tenant_id);

  UPDATE public.property_views pv
  SET tenant_id = v_tenant_id
  FROM public.properties p
  WHERE p.id = pv.property_id
    AND p.user_id = v_user_id
    AND pv.tenant_id IS DISTINCT FROM v_tenant_id;

  RETURN v_tenant_id;
END;
$$;

DO $$
DECLARE
  v_demo_tenant_id UUID;
  v_user RECORD;
  v_tenant_id UUID;
  v_base_name TEXT;
  v_slug TEXT;
BEGIN
  INSERT INTO public.tenants (
    name,
    slug,
    site_title,
    tagline,
    support_email,
    phone,
    whatsapp,
    creci,
    city,
    state,
    is_demo,
    subdomain
  )
  VALUES (
    'Imobiflow Demo',
    'imobiflow-demo',
    'Imobiflow Demo',
    'Modelo de site imobiliário white-label',
    'contato@imobiflow.com',
    '(51) 99128-8418',
    '(51) 99128-8418',
    'CRECI 000000-XX',
    'Canoas',
    'RS',
    true,
    'demo'
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    name = EXCLUDED.name,
    site_title = EXCLUDED.site_title,
    tagline = EXCLUDED.tagline,
    support_email = EXCLUDED.support_email,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    creci = EXCLUDED.creci,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    is_demo = EXCLUDED.is_demo
  RETURNING id INTO v_demo_tenant_id;

  FOR v_user IN
    SELECT DISTINCT
      p.user_id,
      COALESCE(NULLIF(split_part(u.email, '@', 1), ''), 'cliente') AS base_name,
      u.email
    FROM public.properties p
    LEFT JOIN auth.users u ON u.id = p.user_id
    WHERE p.user_id IS NOT NULL
  LOOP
    IF EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = v_user.user_id) THEN
      CONTINUE;
    END IF;

    v_base_name := initcap(replace(v_user.base_name, '.', ' '));
    v_slug := public.slugify_text(v_user.base_name || '-' || substr(v_user.user_id::text, 1, 8));

    INSERT INTO public.tenants (
      name,
      slug,
      site_title,
      support_email,
      subdomain
    )
    VALUES (
      v_base_name || ' Imobiliária',
      v_slug,
      v_base_name || ' Imobiliária',
      v_user.email,
      v_slug
    )
    RETURNING id INTO v_tenant_id;

    INSERT INTO public.tenant_users (tenant_id, user_id, role)
    VALUES (v_tenant_id, v_user.user_id, 'owner');

    UPDATE public.properties
    SET tenant_id = v_tenant_id
    WHERE user_id = v_user.user_id
      AND tenant_id IS NULL;
  END LOOP;

  UPDATE public.properties
  SET tenant_id = v_demo_tenant_id
  WHERE tenant_id IS NULL;

  UPDATE public.property_views pv
  SET tenant_id = p.tenant_id
  FROM public.properties p
  WHERE p.id = pv.property_id
    AND pv.tenant_id IS NULL;
END $$;

ALTER TABLE public.properties
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE public.property_views
  ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active tenants" ON public.tenants;
DROP POLICY IF EXISTS "Tenant members can view own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Tenant owners can update own tenant" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenant memberships" ON public.tenant_users;
DROP POLICY IF EXISTS "Anyone can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view property images" ON public.property_images;
DROP POLICY IF EXISTS "Authenticated users can insert property images" ON public.property_images;
DROP POLICY IF EXISTS "Users can update own property images" ON public.property_images;
DROP POLICY IF EXISTS "Users can delete own property images" ON public.property_images;
DROP POLICY IF EXISTS "Anyone can insert property views" ON public.property_views;
DROP POLICY IF EXISTS "Authenticated users can read property views" ON public.property_views;
DROP POLICY IF EXISTS "No direct access to property_views" ON public.property_views;
DROP POLICY IF EXISTS "Property owners can view their analytics" ON public.property_views;

CREATE POLICY "Public can view active tenants"
ON public.tenants
FOR SELECT
USING (is_active = true);

CREATE POLICY "Tenant members can view own tenant"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = tenants.id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Tenant owners can update own tenant"
ON public.tenants
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = tenants.id
      AND tu.user_id = auth.uid()
      AND tu.role IN ('owner', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = tenants.id
      AND tu.user_id = auth.uid()
      AND tu.role IN ('owner', 'manager')
  )
);

CREATE POLICY "Users can view their tenant memberships"
ON public.tenant_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view available properties"
ON public.properties
FOR SELECT
USING (
  status = 'available'
  OR auth.uid() = user_id
  OR EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = properties.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND tenant_id = public.get_current_tenant_id()
);

CREATE POLICY "Users can update own tenant properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = properties.tenant_id
      AND tu.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = properties.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own tenant properties"
ON public.properties
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = properties.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.status = 'available'
        OR p.user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.tenant_users tu
          WHERE tu.tenant_id = p.tenant_id
            AND tu.user_id = auth.uid()
        )
      )
  )
);

CREATE POLICY "Authenticated users can insert property images"
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

CREATE POLICY "Users can update own property images"
ON public.property_images
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

CREATE POLICY "Users can delete own property images"
ON public.property_images
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

GRANT SELECT ON public.tenants TO anon, authenticated;
GRANT UPDATE ON public.tenants TO authenticated;
GRANT SELECT ON public.tenant_users TO authenticated;
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT ON public.property_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_images TO authenticated;

DROP POLICY IF EXISTS "Public can read property images" ON storage.objects;
DROP POLICY IF EXISTS "Owners can upload own property images" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update own property images" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete own property images" ON storage.objects;

CREATE POLICY "Public can read property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

CREATE POLICY "Owners can upload own property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
  AND position('/' in name) > 0
  AND EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id::text = split_part(name, '/', 1)
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

CREATE POLICY "Owners can update own property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND position('/' in name) > 0
  AND EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id::text = split_part(name, '/', 1)
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
)
WITH CHECK (
  bucket_id = 'property-images'
  AND position('/' in name) > 0
  AND EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id::text = split_part(name, '/', 1)
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

CREATE POLICY "Owners can delete own property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND position('/' in name) > 0
  AND EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id::text = split_part(name, '/', 1)
      AND EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
  )
);

REVOKE ALL ON TABLE public.property_views FROM PUBLIC;
REVOKE ALL ON TABLE public.property_views FROM anon;
REVOKE ALL ON TABLE public.property_views FROM authenticated;

CREATE OR REPLACE FUNCTION public.record_property_view(
  p_property_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_ip TEXT := COALESCE(NULLIF(trim(p_ip_address), ''), 'unknown');
  v_session TEXT := NULLIF(trim(COALESCE(p_session_id, '')), '');
  v_tenant_id UUID;
BEGIN
  IF p_property_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT p.tenant_id
  INTO v_tenant_id
  FROM public.properties p
  WHERE p.id = p_property_id
    AND p.status = 'available';

  IF v_tenant_id IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.property_views pv
    WHERE pv.property_id = p_property_id
      AND COALESCE(pv.viewed_at, pv.created_at, now()) >= now() - interval '30 seconds'
      AND (
        (v_session IS NOT NULL AND (pv.session_id = left(md5(v_session), 16) OR pv.session_id = v_session))
        OR pv.ip_address = md5(v_ip || 'property_salt_2026_secure')
        OR pv.ip_address = v_ip
      )
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO public.property_views (
    property_id,
    tenant_id,
    ip_address,
    user_agent,
    session_id,
    viewed_at,
    created_at
  )
  VALUES (
    p_property_id,
    v_tenant_id,
    v_ip,
    p_user_agent,
    v_session,
    now(),
    now()
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_property_view_count(p_property_id UUID)
RETURNS BIGINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COUNT(*)
  FROM public.property_views pv
  INNER JOIN public.properties p ON p.id = pv.property_id
  WHERE pv.property_id = p_property_id
    AND (
      p.status = 'available'
      OR EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
    )
$$;

CREATE OR REPLACE FUNCTION public.get_most_viewed_properties(
  p_limit INTEGER DEFAULT 10,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE(
  property_id UUID,
  unique_views BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    pv.property_id,
    COUNT(*) AS unique_views
  FROM public.property_views pv
  INNER JOIN public.properties p ON p.id = pv.property_id
  WHERE (
      p.status = 'available'
      OR EXISTS (
        SELECT 1
        FROM public.tenant_users tu
        WHERE tu.tenant_id = p.tenant_id
          AND tu.user_id = auth.uid()
      )
    )
    AND (
      p_start_date IS NULL
      OR COALESCE(pv.viewed_at, pv.created_at) >= p_start_date
    )
    AND (
      p_end_date IS NULL
      OR COALESCE(pv.viewed_at, pv.created_at) <= p_end_date
    )
  GROUP BY pv.property_id
  ORDER BY COUNT(*) DESC, MAX(COALESCE(pv.viewed_at, pv.created_at)) DESC
  LIMIT p_limit
$$;

REVOKE ALL ON FUNCTION public.create_tenant_for_current_user(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_current_tenant_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_property_view(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_property_view_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_most_viewed_properties(INTEGER, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_tenant_for_current_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_property_view(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_property_view_count(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_most_viewed_properties(INTEGER, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO anon, authenticated;

COMMENT ON TABLE public.tenants IS 'Tenant record for each real-estate client using the SaaS.';
COMMENT ON TABLE public.tenant_users IS 'Maps authenticated users to the tenant they belong to.';
COMMENT ON COLUMN public.properties.tenant_id IS 'Tenant owner of the property.';
COMMENT ON COLUMN public.property_views.tenant_id IS 'Tenant tied to the viewed property.';

COMMIT;
