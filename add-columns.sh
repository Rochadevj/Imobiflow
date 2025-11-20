#!/bin/bash

# Configurações do Supabase
SUPABASE_URL="https://poyeihvifrmnusapuhdk.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveWVpaHZpZnJtbnVzYXB1aGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MjY0MjMsImV4cCI6MjA3OTEwMjQyM30.AvjPQr_pFMQS827hnDTcN-Xx9IQiJsX6h6IUyM4Bxhk"

echo "🔧 Tentando adicionar colunas state e zipcode..."
echo ""

# Tenta fazer um UPDATE com as novas colunas para forçar a criação
curl -X PATCH "${SUPABASE_URL}/rest/v1/properties?id=eq.test-id-that-does-not-exist" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"state": "SP", "zipcode": "00000-000"}'

echo ""
echo "⚠️  Como esperado, isso não funcionará porque não temos permissão para executar DDL."
echo ""
echo "📋 VOCÊ PRECISA EXECUTAR ESTE SQL MANUALMENTE:"
echo ""
echo "1. Acesse: https://supabase.com/dashboard/project/poyeihvifrmnusapuhdk/editor"
echo ""
echo "2. Clique em 'SQL Editor' no menu lateral"
echo ""
echo "3. Cole e execute este SQL:"
echo ""
echo "ALTER TABLE public.properties"
echo "ADD COLUMN IF NOT EXISTS state TEXT,"
echo "ADD COLUMN IF NOT EXISTS zipcode TEXT;"
echo ""
echo "4. Clique em 'Run' ou pressione Ctrl+Enter"
echo ""
echo "✅ Depois disso, o sistema funcionará perfeitamente!"
