<div align="center">
  <h1>🏠 Sistema de Gestão Imobiliária</h1>
  <p><strong>Imobiflow</strong></p>
  <p>Plataforma completa para imobiliárias com vitrine pública, painel administrativo e arquitetura multiempresa</p>

  ![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)
  ![Supabase](https://img.shields.io/badge/Supabase-2.83.0-3ECF8E?logo=supabase)
</div>

---

## 📋 Sobre o Projeto

O **Imobiflow** é uma plataforma de gestão imobiliária com **landing page comercial**, **vitrine pública de imóveis** e **painel administrativo**.  
Hoje o projeto foi estruturado para funcionar no modelo **multiempresa (multi-tenant)**, permitindo que diferentes imobiliárias usem o mesmo sistema com **catálogo, identidade visual, contatos e domínio próprios**.

### 🎯 Principais Características

- ✨ Interface moderna e responsiva
- 🔐 Sistema de autenticação com Supabase
- 🏢 Arquitetura multiempresa com `tenant`
- 📱 Design mobile-first
- ⚡ Performance otimizada com Vite
- 🎨 Componentes elegantes com shadcn/ui
- 💾 Banco de dados PostgreSQL + storage com Supabase
- 🔍 Sistema de busca e filtros avançados
- ❤️ Sistema de favoritos por imobiliária
- ⭐ Destaques separados por seção
- 🎬 Upload de fotos e vídeos para imóveis
- 💬 Integração com WhatsApp para contato direto
- 📊 Ranking de imóveis mais visualizados
- 📄 Módulo jurídico com checklist e histórico da negociação
- 🌐 Suporte a demo pública e domínio próprio por cliente

---

## ✨ Funcionalidades

### Para Usuários

- 🖥️ **Landing Page do Software**: Página inicial para apresentar a plataforma
- 🏘️ **Vitrine Pública de Imóveis**: Visualização dos imóveis disponíveis da imobiliária
- 🚀 **Página de Lançamentos**: Área específica para empreendimentos e lançamentos
- 🔎 **Busca Avançada**: Filtros por tipo, preço, localização e características
- ❤️ **Lista de Favoritos**: Salve imóveis preferidos por imobiliária
- 📄 **Detalhes Completos**: Fotos, mapa, Street View, diferenciais e informações detalhadas
- 📱 **Contato Direto**: Entre em contato via WhatsApp com apenas um clique
- 📝 **Captação de Imóvel**: Formulário de anúncio para pré-cadastro e contato comercial

### Para Administradores

- 🔐 **Painel Administrativo**: Área de gestão interna da operação
- ➕ **Cadastro de Imóveis**: Adicione imóveis com fotos, vídeos e dados completos
- ✏️ **Edição**: Atualize informações dos imóveis existentes
- 🗑️ **Remoção**: Remova imóveis do sistema
- 📊 **Dashboard Operacional**: Visão geral da operação e estatísticas
- ⭐ **Destaques Personalizados**: Escolha onde cada imóvel será exibido
- 🚀 **Lançamentos**: Marcação e listagem dedicada para lançamentos
- 👤 **Autenticação**: Login, confirmação por e-mail e gerenciamento de sessão
- 📈 **Mais Visitados**: Ranking de imóveis por acessos reais
- ⚖️ **Jurídico**: Checklist e histórico da negociação por imóvel


---

## 🛠️ Tecnologias Utilizadas

### Frontend

- **[React](https://react.dev/)** `18.3.1` - Biblioteca JavaScript para interfaces
- **[TypeScript](https://www.typescriptlang.org/)** `5.9.3` - Tipagem estática
- **[Vite](https://vitejs.dev/)** `5.4.21` - Build tool moderna e rápida
- **[React Router](https://reactrouter.com/)** `6.30.1` - Roteamento da aplicação
- **[TanStack Query](https://tanstack.com/query/latest)** `5.83.0` - Estado assíncrono e cache

### Estilização

- **[Tailwind CSS](https://tailwindcss.com/)** `3.4.x` - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos acessíveis
- **[Lucide React](https://lucide.dev/)** `0.462.0` - Ícones modernos

### Backend e Banco de Dados

- **[Supabase](https://supabase.com/)** `2.83.0` - Backend como serviço
  - Autenticação
  - PostgreSQL
  - Storage
  - RPCs
  - Row Level Security

### Formulários e Validação

- **[React Hook Form](https://react-hook-form.com/)** `7.x`
- **[Zod](https://zod.dev/)** `3.25.x`

---

## 🧱 Arquitetura Atual

O projeto hoje funciona com **uma única base de código** e **um único projeto Supabase**, mas com separação por imobiliária usando `tenant_id`.

### Estrutura principal

- `tenants` -> cadastro da imobiliária cliente
- `tenant_users` -> vínculo do usuário autenticado com a imobiliária
- `properties.tenant_id` -> cada imóvel pertence a uma imobiliária
- `property_views.tenant_id` -> visualizações associadas ao tenant correto

### Resolução da imobiliária ativa

O sistema pode identificar a imobiliária por:

- `?tenant=slug`
- domínio próprio configurado no tenant
- tenant demo configurado para a vitrine pública

Arquivos centrais dessa lógica:

- `src/context/TenantContext.tsx`
- `src/lib/tenantBrand.ts`
- `src/lib/demoTenant.ts`
- `supabase/migrations/20260307102000_add_multitenant_foundation.sql`
- `supabase/migrations/20260308101000_fix_tenant_rls_recursion.sql`

---

## 🌐 Rotas Principais

- `/` → landing page da Imobiflow
- `/imobiliaria` → vitrine pública da imobiliária
- `/lancamentos` → página de lançamentos
- `/property/:id` → detalhe do imóvel
- `/favorites` → favoritos
- `/sobre` → página institucional
- `/anunciar` → captação de imóvel
- `/auth` → login e cadastro
- `/admin` → painel administrativo
- `/politica-privacidade` → política de privacidade

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **[Node.js](https://nodejs.org/)** 18 ou superior
- **[npm](https://www.npmjs.com/)** ou equivalente
- Uma conta no **[Supabase](https://supabase.com/)**

---

## 🚀 Como Executar o Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/imobiflow.git
cd Imobiflow
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Preencha:

```env
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_GOOGLE_MAPS_EMBED_KEY=sua_chave_google_maps_opcional
VITE_DEMO_TENANT_SLUG=slug_da_demo
```

Variáveis opcionais suportadas pelo projeto:

```env
VITE_GOOGLE_MAPS_API_KEY=
VITE_TURNSTILE_SITE_KEY=
VITE_DELETE_ACCOUNT_FUNCTION_NAME=
```

### 4️⃣ Configure o banco de dados

Se estiver usando Supabase CLI:

```bash
npx supabase link --project-ref <seu_project_id>
npx supabase db push
```

Se preferir, você também pode executar manualmente os SQLs da pasta `supabase/migrations` no editor SQL do Supabase.

### 5️⃣ Execute o projeto em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:

**http://localhost:8080**

### 6️⃣ Build para produção

```bash
npm run build
npm run preview
```

---

## 🗄️ Migrations Importantes

As migrations mais relevantes para o estado atual do projeto são:

- `20260305110000_harden_security_policies.sql`
- `20260305123000_restore_property_rls_visibility.sql`
- `20260307102000_add_multitenant_foundation.sql`
- `20260308101000_fix_tenant_rls_recursion.sql`

Se a base não tiver essas migrations aplicadas, partes da arquitetura multiempresa, demo pública e painel administrativo podem falhar.

---

## 🧪 Demo Pública e Painel Demo

### Demo pública

O botão `Ver demo` da landing abre a vitrine pública do tenant configurado para demonstração.

Exemplo:

```text
/imobiliaria?tenant=slug-da-demo
```

### Painel demo

O painel demo pode ser acessado em modo somente leitura:

```text
/admin?demo=1&tenant=slug-da-demo
```

Nesse modo:

- é possível navegar pelo painel
- ver imóveis e estrutura
- mas não editar, excluir ou alterar configurações sensíveis

---

## 📂 Estrutura do Projeto

```text
imobiflow/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   └── ui/          # Componentes do shadcn/ui
│   ├── context/         # Contextos como TenantContext
│   ├── integrations/    # Integrações externas
│   ├── lib/             # Utilitários e helpers
│   ├── pages/           # Páginas da aplicação
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entrada da aplicação
├── supabase/            # Migrations e configuração de banco
├── .env.example         # Variáveis de ambiente de exemplo
├── package.json         # Scripts e dependências
├── tailwind.config.ts   # Configuração do Tailwind
├── tsconfig.json        # Configuração do TypeScript
├── vercel.json          # Rewrite SPA para deploy
└── vite.config.ts       # Configuração do Vite
```

---

## 🎨 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build
npm run build:dev
npm run preview

# Qualidade
npm run lint
```

---

## 🌐 Deploy

### Vercel (Recomendado)

O projeto já possui `vercel.json` configurado com rewrite para SPA, evitando erro `404` ao atualizar páginas como:

- `/imobiliaria`
- `/property/:id`
- `/admin`

Passos mínimos:

1. Conectar o repositório à Vercel
2. Configurar as variáveis de ambiente
3. Garantir que o Supabase de produção já recebeu as migrations necessárias
4. Publicar

---

## 🤝 Como Contribuir

Contribuições são bem-vindas:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Envie para sua branch
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está licenciado sob a **MIT License**.  
Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

## 📧 Contato

Para dúvidas ou sugestões:

- 📩 E-mail: [henriquerocha1357@gmail.com](mailto:henriquerocha1357@gmail.com)
- 💼 GitHub: [@Rochadevj](https://github.com/Rochadevj)

---

## 🎉 Créditos

**Desenvolvido por [Rochadevj](https://github.com/Rochadevj)**

Projeto focado em performance, organização visual, experiência do usuário e estrutura real de produto SaaS para o mercado imobiliário.

---

<div align="center">
  <p>⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório.</p>
</div>
