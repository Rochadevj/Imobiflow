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