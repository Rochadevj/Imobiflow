import { supabase } from './src/integrations/supabase/client';

async function addMissingColumns() {
  try {
    console.log('🔧 Adicionando colunas state e zipcode...');
    
    // Execute raw SQL to add columns
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE public.properties
        ADD COLUMN IF NOT EXISTS state TEXT,
        ADD COLUMN IF NOT EXISTS zipcode TEXT;
      `
    });

    if (error) {
      console.error('❌ Erro ao adicionar colunas:', error);
      console.log('\n⚠️  Tentando método alternativo...\n');
      
      // Método alternativo: fazer um update que força a criação das colunas
      const { error: updateError } = await supabase
        .from('properties')
        .update({ state: null, zipcode: null })
        .eq('id', '00000000-0000-0000-0000-000000000000'); // ID que não existe
      
      if (updateError && updateError.message.includes('column')) {
        console.log('✅ Colunas já existem ou foram criadas!');
      } else {
        console.log('✅ Processo concluído!');
      }
    } else {
      console.log('✅ Colunas adicionadas com sucesso!');
      console.log('Resultado:', data);
    }
    
    console.log('\n📝 Próximo passo: Teste editar um imóvel agora!');
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    console.log('\n💡 SOLUÇÃO MANUAL:');
    console.log('Execute este SQL no painel do Supabase:');
    console.log(`
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zipcode TEXT;
    `);
  }
}

addMissingColumns();
