-- 1. Criar função para anonimizar IP usando MD5 nativo (hash irreversível)
CREATE OR REPLACE FUNCTION public.anonymize_ip(ip_text text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  -- Retorna hash MD5 do IP com salt, impossível reverter para o IP original
  SELECT md5(ip_text || 'property_salt_2026_secure')
$$;

-- 2. Criar trigger para anonimizar IP automaticamente na inserção
CREATE OR REPLACE FUNCTION public.anonymize_property_view_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Anonimizar IP com hash irreversível
  NEW.ip_address := public.anonymize_ip(NEW.ip_address);
  -- Limpar user_agent para apenas tipo de dispositivo (mobile/desktop)
  NEW.user_agent := CASE 
    WHEN NEW.user_agent ILIKE '%mobile%' OR NEW.user_agent ILIKE '%android%' OR NEW.user_agent ILIKE '%iphone%' THEN 'mobile'
    ELSE 'desktop'
  END;
  -- Gerar novo session_id anonimizado
  NEW.session_id := LEFT(md5(COALESCE(NEW.session_id, gen_random_uuid()::text)), 16);
  RETURN NEW;
END;
$$;

-- 3. Aplicar trigger na tabela
DROP TRIGGER IF EXISTS anonymize_view_data ON public.property_views;
CREATE TRIGGER anonymize_view_data
  BEFORE INSERT ON public.property_views
  FOR EACH ROW
  EXECUTE FUNCTION public.anonymize_property_view_data();

-- 4. Criar função para limpar dados antigos (retenção de 90 dias)
CREATE OR REPLACE FUNCTION public.cleanup_old_property_views()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.property_views
  WHERE viewed_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 5. Anonimizar dados existentes na tabela (se houver)
UPDATE public.property_views
SET 
  ip_address = public.anonymize_ip(ip_address),
  user_agent = CASE 
    WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'mobile'
    ELSE 'desktop'
  END,
  session_id = LEFT(md5(COALESCE(session_id, gen_random_uuid()::text)), 16)
WHERE LENGTH(ip_address) != 32; -- Só atualiza se não for já um hash MD5

-- 6. Remover a view property_analytics se existir
DROP VIEW IF EXISTS public.property_analytics;