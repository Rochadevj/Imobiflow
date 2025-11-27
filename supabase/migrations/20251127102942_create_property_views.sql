-- Criar tabela para rastrear visualizações de imóveis
CREATE TABLE IF NOT EXISTS public.property_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhorar performance das queries
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON public.property_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_property_views_ip_property ON public.property_views(ip_address, property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_session ON public.property_views(session_id);

-- Criar índice composto para queries de visualizações únicas por IP
CREATE INDEX IF NOT EXISTS idx_property_views_unique_ip ON public.property_views(property_id, ip_address, viewed_at DESC);

-- Habilitar Row Level Security
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de qualquer um (anônimo ou autenticado)
CREATE POLICY "Anyone can insert property views"
  ON public.property_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Authenticated users can read property views"
  ON public.property_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Criar view materializada para estatísticas agregadas (atualizada periodicamente)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.property_view_stats AS
SELECT 
  p.id as property_id,
  p.title,
  p.property_type,
  p.price,
  p.location,
  p.city,
  COUNT(DISTINCT pv.ip_address) as unique_views,
  COUNT(*) as total_views,
  MAX(pv.viewed_at) as last_viewed_at,
  ARRAY_AGG(DISTINCT pi.image_url) FILTER (WHERE pi.is_primary = true) as primary_images
FROM public.properties p
LEFT JOIN public.property_views pv ON p.id = pv.property_id
LEFT JOIN public.property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title, p.property_type, p.price, p.location, p.city;

-- Criar índice na view materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_view_stats_property_id ON public.property_view_stats(property_id);
CREATE INDEX IF NOT EXISTS idx_property_view_stats_unique_views ON public.property_view_stats(unique_views DESC);

-- Função para refresh automático da view materializada
CREATE OR REPLACE FUNCTION refresh_property_view_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.property_view_stats;
END;
$$;

-- Comentários para documentação
COMMENT ON TABLE public.property_views IS 'Rastreia visualizações de imóveis com controle por IP para evitar duplicatas';
COMMENT ON COLUMN public.property_views.ip_address IS 'Endereço IP do visitante';
COMMENT ON COLUMN public.property_views.session_id IS 'ID da sessão do navegador para rastreamento adicional';
COMMENT ON MATERIALIZED VIEW public.property_view_stats IS 'Estatísticas agregadas de visualizações de imóveis, atualizada periodicamente';
