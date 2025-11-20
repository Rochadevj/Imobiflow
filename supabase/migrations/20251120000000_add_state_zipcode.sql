-- Add state and zipcode columns to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zipcode TEXT;

-- Update existing properties with default values
UPDATE public.properties
SET state = '', zipcode = ''
WHERE state IS NULL OR zipcode IS NULL;
