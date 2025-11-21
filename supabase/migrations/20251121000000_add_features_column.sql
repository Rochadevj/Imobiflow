-- Add features column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS features TEXT[];

-- Add comment to the column
COMMENT ON COLUMN public.properties.features IS 'Array of property features/amenities';
