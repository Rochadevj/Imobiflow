-- Add transaction_type column to properties table
ALTER TABLE public.properties 
ADD COLUMN transaction_type TEXT DEFAULT 'venda' CHECK (transaction_type IN ('venda', 'aluguel'));

-- Update existing properties to have default value
UPDATE public.properties 
SET transaction_type = 'venda' 
WHERE transaction_type IS NULL;
