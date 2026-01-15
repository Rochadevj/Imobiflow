-- 1. Remover política atual que expõe dados sensíveis
DROP POLICY IF EXISTS "Property owners can view their analytics" ON public.property_views;

-- 2. Criar política que nega acesso direto à tabela base
CREATE POLICY "No direct access to property_views"
ON public.property_views
FOR SELECT
USING (false);

-- 3. Criar view segura que expõe apenas analytics agregados (sem dados pessoais)
CREATE OR REPLACE VIEW public.property_analytics
WITH (security_invoker = on)
AS
SELECT 
  property_id,
  COUNT(*) as total_views,
  COUNT(DISTINCT ip_address) as unique_views,
  DATE(viewed_at) as view_date
FROM public.property_views
GROUP BY property_id, DATE(viewed_at);

-- 4. Criar função segura para obter contagem de visualizações (para uso no frontend)
CREATE OR REPLACE FUNCTION public.get_property_view_count(p_property_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT ip_address)
  FROM public.property_views
  WHERE property_id = p_property_id
$$;

-- 5. Criar função segura para obter imóveis mais vistos (para uso no frontend)
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
SET search_path = public
AS $$
  SELECT 
    pv.property_id,
    COUNT(DISTINCT pv.ip_address) as unique_views
  FROM public.property_views pv
  INNER JOIN public.properties p ON p.id = pv.property_id
  WHERE p.status = 'available'
    AND (p_start_date IS NULL OR pv.viewed_at >= p_start_date)
    AND (p_end_date IS NULL OR pv.viewed_at <= p_end_date)
  GROUP BY pv.property_id
  ORDER BY unique_views DESC
  LIMIT p_limit
$$;