-- Migration to update property_type values to use snake_case format
-- This ensures consistency between the database and the application

UPDATE properties
SET property_type = CASE property_type
  WHEN 'Apartamento' THEN 'apartamento'
  WHEN 'Casa' THEN 'casa'
  WHEN 'Casa em Condomínio' THEN 'casa_condominio'
  WHEN 'Cobertura' THEN 'cobertura'
  WHEN 'Sala Comercial' THEN 'sala_comercial'
  WHEN 'Sobrado' THEN 'sobrado'
  WHEN 'Sobrado em Condomínio' THEN 'sobrado_condominio'
  WHEN 'Terreno' THEN 'terreno'
  ELSE property_type
END
WHERE property_type IN (
  'Apartamento',
  'Casa',
  'Casa em Condomínio',
  'Cobertura',
  'Sala Comercial',
  'Sobrado',
  'Sobrado em Condomínio',
  'Terreno'
);
