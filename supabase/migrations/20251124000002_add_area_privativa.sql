-- Add area_privativa column to properties table
ALTER TABLE public.properties ADD COLUMN area_privativa DECIMAL(10,2);
-- (Optional) Backfill: set area_privativa equal to area where you want initial value
-- UPDATE public.properties SET area_privativa = area WHERE area_privativa IS NULL;