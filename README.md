<div align="center">
  <h1>🏠 Sistema de Gestão Imobiliária</h1>
  <p><strong>Corretor Alexandre</strong></p>
  <p>Sistema completo e moderno para gerenciamento de imobiliárias</p>
  
  ![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)
  ![Supabase](https://img.shields.io/badge/Supabase-2.83.0-3ECF8E?logo=supabase)
</div>

---

## 📋 Sobre o Projeto

O **Corretor Alexandre** é uma plataforma completa de gestão imobiliária desenvolvida com as tecnologias mais modernas do mercado. O sistema permite o cadastro, edição e remoção de imóveis disponíveis para **compra, aluguel e lançamentos**, oferecendo uma experiência intuitiva tanto para administradores quanto para usuários finais.

### 🎯 Principais Características

- ✨ Interface moderna e responsiva
- 🔐 Sistema de autenticação seguro
- 📱 Design mobile-first
- ⚡ Performance otimizada com Vite
- 🎨 Componentes elegantes com shadcn/ui
- 💾 Banco de dados em tempo real com Supabase
- 🔍 Sistema de busca e filtros avançados
- ❤️ Sistema de favoritos
- 💬 Integração com WhatsApp para contato direto

---

## ✨ Funcionalidades

### Para Usuários
- 🏘️ **Navegação de Imóveis**: Visualize todos os imóveis disponíveis organizados por categorias
- 🔎 **Busca Avançada**: Filtre imóveis por tipo, preço, localização e mais
- ❤️ **Lista de Favoritos**: Salve seus imóveis preferidos para consulta posterior
- 📄 **Detalhes Completos**: Visualize informações detalhadas, fotos e características de cada imóvel
- 💬 **Contato Direto**: Entre em contato via WhatsApp com apenas um clique
- 📱 **Anunciar Imóvel**: Usuários podem submeter seus próprios imóveis para venda/aluguel

### Para Administradores
- 🔐 **Painel Administrativo**: Acesso exclusivo para gerenciar todo o sistema
- ➕ **Cadastro de Imóveis**: Adicione novos imóveis com fotos e informações detalhadas
- ✏️ **Edição**: Atualize informações de imóveis existentes
- 🗑️ **Remoção**: Remova imóveis do sistema
- 📊 **Gerenciamento**: Visualize e gerencie todas as propriedades cadastradas
- 👤 **Autenticação**: Sistema seguro de login e gerenciamento de sessões

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[React](https://react.dev/)** `18.3.1` - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** `5.8.3` - Superset JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** `5.4.19` - Build tool moderna e rápida
- **[React Router](https://reactrouter.com/)** `6.30.1` - Roteamento para aplicações React
- **[TanStack Query](https://tanstack.com/query/latest)** `5.83.0` - Gerenciamento de estado assíncrono

### Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** `3.4.17` - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis e acessíveis
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos não estilizados
- **[Lucide React](https://lucide.dev/)** - Ícones modernos e personalizáveis

### Backend e Autenticação
- **[Supabase](https://supabase.com/)** `2.83.0` - Backend como serviço (BaaS)
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - Storage para imagens
  - Real-time subscriptions

### Formulários e Validação
- **[React Hook Form](https://react-hook-form.com/)** `7.61.1` - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** `3.25.76` - Validação de schemas TypeScript-first

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[npm](https://www.npmjs.com/)** ou **[yarn](https://yarnpkg.com/)** ou **[bun](https://bun.sh/)**
- Uma conta no **[Supabase](https://supabase.com/)** (gratuita)

---

## 🚀 Como Executar o Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/Rochadevj/corretor-alexandre.git
cd corretor-alexandre
```

### 2️⃣ Instale as dependências

```bash
npm install
# ou
yarn install
# ou
bun install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`:

```bash
cp .env.example .env
```

Preencha as variáveis de ambiente com suas credenciais do Supabase:

```env
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
```

> 💡 **Como obter as credenciais do Supabase:**
> 1. Acesse [supabase.com](https://supabase.com) e faça login
> 2. Crie um novo projeto ou selecione um existente
> 3. Vá em Settings > API
> 4. Copie a URL do projeto e a chave pública (anon key)

### 4️⃣ Configure o banco de dados

Execute os scripts SQL disponíveis na pasta `supabase/` para criar as tabelas necessárias no seu projeto Supabase.

### 5️⃣ Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

A aplicação estará disponível em: **http://localhost:5173**

### 6️⃣ Build para produção

```bash
# Criar build de produção
npm run build

# Visualizar build localmente
npm run preview
```

---

## 📂 Estrutura do Projeto

```
corretor-alexandre/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   └── ui/         # Componentes do shadcn/ui
│   ├── hooks/          # Custom React Hooks
│   ├── integrations/   # Integrações com serviços externos
│   ├── lib/            # Utilitários e configurações
│   ├── pages/          # Páginas da aplicação
│   │   ├── Index.tsx       # Página inicial
│   │   ├── Admin.tsx       # Painel administrativo
│   │   ├── Auth.tsx        # Autenticação
│   │   ├── PropertyDetail.tsx  # Detalhes do imóvel
│   │   ├── PropertySubmit.tsx  # Anunciar imóvel
│   │   ├── Favorites.tsx   # Imóveis favoritos
│   │   ├── About.tsx       # Sobre
│   │   └── ...
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── supabase/           # Scripts e configurações do Supabase
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências e scripts
├── tailwind.config.ts  # Configuração do Tailwind
├── tsconfig.json       # Configuração do TypeScript
└── vite.config.ts      # Configuração do Vite
```

---

## 🎨 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run build:dev    # Cria build em modo desenvolvimento
npm run preview      # Visualiza build de produção localmente

# Qualidade de Código
npm run lint         # Executa ESLint para verificar código
```

---

## 🌐 Deploy

O projeto pode ser facilmente implantado em diversas plataformas:

### Vercel (Recomendado)
1. Faça fork do repositório
2. Conecte sua conta Vercel ao GitHub
3. Importe o projeto
4. Configure as variáveis de ambiente
5. Deploy!

### Netlify
1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

### Outras plataformas
O projeto é compatível com qualquer plataforma que suporte aplicações React/Vite como Railway, Render, AWS Amplify, etc.

---

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📧 Contato

Para dúvidas ou sugestões, entre em contato:

- 📱 WhatsApp: +55 51 99128-8418
- 💼 GitHub: [@Rochadevj](https://github.com/Rochadevj)

---

## 🎉 Créditos

**Desenvolvido com ❤️ por [Rochadevj](https://github.com/Rochadevj)**

Este projeto foi criado utilizando as melhores práticas de desenvolvimento web moderno, com foco em performance, acessibilidade e experiência do usuário.

### 💼 Sobre o Desenvolvedor

**Rochadevj** é um desenvolvedor apaixonado por criar soluções web inovadoras e eficientes, com experiência em tecnologias modernas como React, TypeScript, e arquitetura de aplicações escaláveis.

---

<div align="center">
  <p>⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!</p>
  <p>Made with ❤️ and ☕ by Rochadevj</p>
</div>
