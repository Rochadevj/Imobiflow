-- Adicionar coluna codigo à tabela properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS codigo TEXT UNIQUE;

-- Criar sequência para gerar códigos numéricos
CREATE SEQUENCE IF NOT EXISTS property_code_seq START 1000;

-- Função para gerar código único no formato IMV-XXXX
CREATE OR REPLACE FUNCTION generate_property_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar código no formato IMV-XXXX (IMV = Imóvel)
    new_code := 'IMV-' || LPAD(nextval('property_code_seq')::TEXT, 4, '0');
    
    -- Verificar se o código já existe
    SELECT EXISTS(SELECT 1 FROM properties WHERE codigo = new_code) INTO code_exists;
    
    -- Se não existir, retornar o código
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código automaticamente ao inserir novo imóvel
CREATE OR REPLACE FUNCTION set_property_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL THEN
    NEW.codigo := generate_property_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS trigger_set_property_code ON public.properties;
CREATE TRIGGER trigger_set_property_code
  BEFORE INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION set_property_code();

-- Atualizar imóveis existentes que não têm código
UPDATE public.properties 
SET codigo = generate_property_code() 
WHERE codigo IS NULL;

-- Criar índice para busca rápida por código
CREATE INDEX IF NOT EXISTS idx_properties_codigo ON public.properties(codigo);