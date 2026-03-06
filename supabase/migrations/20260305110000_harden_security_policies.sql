-- Security hardening: RLS, storage policies and RPC boundaries

BEGIN;

-- Ensure RLS is enabled on main tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1) Harden storage policies for property-images bucket
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;
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
      AND p.user_id = auth.uid()
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
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'property-images'
  AND position('/' in name) > 0
  AND EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id::text = split_part(name, '/', 1)
      AND p.user_id = auth.uid()
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
      AND p.user_id = auth.uid()
  )
);

-- -----------------------------------------------------------------------------
-- 2) Lock down direct access to property_views table
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can insert property views" ON public.property_views;
DROP POLICY IF EXISTS "Authenticated users can read property views" ON public.property_views;
DROP POLICY IF EXISTS "No direct access to property_views" ON public.property_views;
DROP POLICY IF EXISTS "Property owners can view their analytics" ON public.property_views;

REVOKE ALL ON TABLE public.property_views FROM PUBLIC;
REVOKE ALL ON TABLE public.property_views FROM anon;
REVOKE ALL ON TABLE public.property_views FROM authenticated;

DO $$
BEGIN
  IF to_regclass('public.property_view_stats') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON MATERIALIZED VIEW public.property_view_stats FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON MATERIALIZED VIEW public.property_view_stats FROM anon';
    EXECUTE 'REVOKE ALL ON MATERIALIZED VIEW public.property_view_stats FROM authenticated';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 3) Expose only safe RPCs for views tracking
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_property_view(
  p_property_id uuid,
  p_ip_address text,
  p_user_agent text DEFAULT NULL,
  p_session_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_ip text := COALESCE(NULLIF(trim(p_ip_address), ''), 'unknown');
  v_session text := NULLIF(trim(COALESCE(p_session_id, '')), '');
BEGIN
  IF p_property_id IS NULL THEN
    RETURN false;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = p_property_id
      AND p.status = 'available'
  ) THEN
    RETURN false;
  END IF;

  -- Server-side anti-flood throttle (same property in the last 30s)
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
    ip_address,
    user_agent,
    session_id,
    viewed_at,
    created_at
  )
  VALUES (
    p_property_id,
    v_ip,
    p_user_agent,
    v_session,
    now(),
    now()
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_property_view_count(p_property_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COUNT(*)
  FROM public.property_views pv
  INNER JOIN public.properties p ON p.id = pv.property_id
  WHERE pv.property_id = p_property_id
    AND (p.status = 'available' OR p.user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.get_most_viewed_properties(
  p_limit integer DEFAULT 10,
  p_start_date timestamp with time zone DEFAULT NULL,
  p_end_date timestamp with time zone DEFAULT NULL
)
RETURNS TABLE(
  property_id uuid,
  unique_views bigint
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
  WHERE (p.status = 'available' OR p.user_id = auth.uid())
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

REVOKE ALL ON FUNCTION public.record_property_view(uuid, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_property_view_count(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_most_viewed_properties(integer, timestamp with time zone, timestamp with time zone) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.record_property_view(uuid, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_property_view_count(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_most_viewed_properties(integer, timestamp with time zone, timestamp with time zone) TO anon, authenticated;

DO $$
BEGIN
  IF to_regprocedure('public.cleanup_old_property_views()') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.cleanup_old_property_views() FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.cleanup_old_property_views() FROM anon';
    EXECUTE 'REVOKE ALL ON FUNCTION public.cleanup_old_property_views() FROM authenticated';
  END IF;

  IF to_regprocedure('public.refresh_property_view_stats()') IS NOT NULL THEN
    EXECUTE 'REVOKE ALL ON FUNCTION public.refresh_property_view_stats() FROM PUBLIC';
    EXECUTE 'REVOKE ALL ON FUNCTION public.refresh_property_view_stats() FROM anon';
    EXECUTE 'REVOKE ALL ON FUNCTION public.refresh_property_view_stats() FROM authenticated';
  END IF;
END $$;

COMMIT;