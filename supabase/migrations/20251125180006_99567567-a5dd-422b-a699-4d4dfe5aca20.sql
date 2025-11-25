-- Corrigir search_path das funções para maior segurança

-- Recriar função generate_property_code com search_path definido
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
$$ LANGUAGE plpgsql SET search_path = public;

-- Recriar função set_property_code com search_path definido
CREATE OR REPLACE FUNCTION set_property_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo IS NULL THEN
    NEW.codigo := generate_property_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;