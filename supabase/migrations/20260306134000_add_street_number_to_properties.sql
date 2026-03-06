-- Add dedicated street number field to improve address precision (e.g. Street View)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS street_number TEXT;
