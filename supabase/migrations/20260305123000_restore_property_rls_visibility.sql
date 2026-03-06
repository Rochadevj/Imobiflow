-- Restore core RLS policies for properties and property_images
-- Use this after hardening if listing/admin data became invisible.

BEGIN;

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1) properties: public visibility for available listings + owner access
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view available properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;

CREATE POLICY "Anyone can view available properties"
ON public.properties
FOR SELECT
USING (status = 'available' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2) property_images: public read only for available/owned properties
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view property images" ON public.property_images;
DROP POLICY IF EXISTS "Authenticated users can insert property images" ON public.property_images;
DROP POLICY IF EXISTS "Users can update own property images" ON public.property_images;
DROP POLICY IF EXISTS "Users can delete own property images" ON public.property_images;

CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (p.status = 'available' OR p.user_id = auth.uid())
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
      AND p.user_id = auth.uid()
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
      AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_images.property_id
      AND p.user_id = auth.uid()
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
      AND p.user_id = auth.uid()
  )
);

-- Keep grants explicit (RLS still enforces row-level access)
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;

GRANT SELECT ON public.property_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_images TO authenticated;

COMMIT;