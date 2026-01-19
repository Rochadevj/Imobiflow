-- Create storage bucket for property images (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  area DECIMAL(10, 2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spaces INTEGER,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create property_images table for multiple images per property
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Properties policies - public can view available properties
CREATE POLICY "Anyone can view available properties"
ON public.properties
FOR SELECT
USING (status = 'available' OR auth.uid() = user_id);

-- Authenticated users can insert their own properties
CREATE POLICY "Authenticated users can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own properties
CREATE POLICY "Users can update own properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own properties
CREATE POLICY "Users can delete own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Property images policies
CREATE POLICY "Anyone can view property images"
ON public.property_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_images.property_id 
    AND (status = 'available' OR user_id = auth.uid())
  )
);

CREATE POLICY "Authenticated users can insert property images"
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_images.property_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own property images"
ON public.property_images
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_images.property_id 
    AND user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for property images
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can update their property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');
