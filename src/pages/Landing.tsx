import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Handshake,
  LayoutGrid,
  Link2,
  LineChart,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Imobiliárias onboard", value: "120+" },
  { label: "Leads respondidos", value: "48h" },
  { label: "Visitas agendadas", value: "+32%" },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Sites que vendem",
    text: "Crie vitrines modernas e editáveis com SEO pronto e integração com portais.",
  },
  {
    icon: MessageCircle,
    title: "CRM com funil real",
    text: "Capte, distribua e acompanhe leads com histórico e tarefas automatizadas.",
  },
  {
    icon: LineChart,
    title: "Dados em tempo real",
    text: "Dashboards com conversão, ticket médio e desempenho por corretor.",
  },
  {
    icon: Bell,
    title: "Automações",
    text: "Notificações, follow-ups e campanhas segmentadas sem perder timing.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança jurídica",
    text: "Modelos de contrato, checklist e trilha de compliance para cada negócio.",
  },
  {
    icon: Globe,
    title: "Multisite",
    text: "Cada operação com seu domínio, catálogo e identidade visual própria.",
  },
];

const steps = [
  {
    step: "01",
    title: "Diagnóstico rápido",
    text: "Mapeamos equipe, portais e jornadas para configurar o CRM e o site certo.",
  },
  {
    step: "02",
    title: "Implantação guiada",
    text: "Importamos seu estoque e ativamos automações em até 7 dias úteis.",
  },
  {
    step: "03",
    title: "Crescimento contínuo",
    text: "Acompanhamos KPIs com você e destravamos novas campanhas mensalmente.",
  },
];

const modules = [
  {
    icon: Building2,
    title: "Gestão de estoque",
    text: "Unidades, tours, plantas e precificação inteligente em um único lugar.",
  },
  {
    icon: Users2,
    title: "Equipe sincronizada",
    text: "Escalas, comissões, metas e comunicação em um painel único.",
  },
  {
    icon: FileText,
    title: "Documentos e contratos",
    text: "Assinaturas, anexos e status de cada processo imobiliário.",
  },
  {
    icon: BarChart3,
    title: "Inteligência comercial",
    text: "Lead scoring, previsão de receita e alertas de oportunidade.",
  },
];

const testimonials = [
  {
    quote:
      "Em três meses reduzimos o tempo de resposta e dobramos as visitas agendadas. Tudo ficou centralizado.",
    name: "Carolina Nunes",
    role: "Diretora, ImobViva",
  },
  {
    quote:
      "O site ficou pronto em uma semana e os corretores hoje conseguem acompanhar cada lead sem planilhas.",
    name: "Andre Mota",
    role: "CEO, Atlas Imóveis",
  },
];

const plans = [
  {
    name: "Start",
    price: "R$ 289",
    description: "Para operações menores que querem se organizar.",
    features: [
      "Site responsivo com SEO",
      "CRM básico e funil",
      "2 usuários inclusos",
      "Importação de estoque",
    ],
  },
  {
    name: "Growth",
    price: "R$ 549",
    description: "Para equipes em crescimento e time comercial ativo.",
    features: [
      "Tudo do Start",
      "Automações e campanhas",
      "Portal do corretor",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Sob medida",
    description: "Operações com múltiplas unidades e alta demanda.",
    features: [
      "Multisite e multi-domínio",
      "Integrações dedicadas",
      "BI e alertas avançados",
      "Onboarding dedicado",
    ],
  },
];

const faqs = [
  {
    question: "Consigo usar meu domínio atual?",
    answer:
      "Sim. Mantemos seu domínio e apontamos para o novo site com DNS assistido.",
  },
  {
    question: "Posso integrar com portais de anúncio?",
    answer:
      "Integrações com portais e redes sociais fazem parte dos planos Growth e Scale.",
  },
  {
    question: "Quanto tempo leva a implantação?",
    answer:
      "Em média 7 dias úteis para site e CRM, dependendo do volume de estoque.",
  },
  {
    question: "Tenho suporte para minha equipe?",
    answer:
      "Sim. Treinamentos ao vivo, base de conhecimento e suporte pelo WhatsApp.",
  },
];

const pillars = [
  {
    icon: Rocket,
    title: "Velocidade comercial",
    text: "Centralize captação, atendimento e negociação para reduzir ciclo de venda.",
  },
  {
    icon: Link2,
    title: "Integrações que destravam escala",
    text: "Conecte portais, WhatsApp e fluxos de mídia sem retrabalho operacional.",
  },
  {
    icon: Handshake,
    title: "Confiança em cada etapa",
    text: "Trilha de atendimento, documentação e governança para decisões seguras.",
  },
];

const workflowComparison = [
  {
    title: "Operação fragmentada",
    points: [
      "Leads perdidos entre planilhas e mensagens",
      "Baixa previsibilidade de conversão",
      "Equipe sem visão clara de prioridades",
    ],
  },
  {
    title: "Operação orientada por sistema",
    points: [
      "Pipeline único com funil rastreável",
      "Rotinas automáticas de follow-up",
      "Metas, desempenho e carteira em tempo real",
    ],
  },
];

const trustSignals = [
  "Onboarding guiado por especialistas",
  "Implementação rápida sem parar a operação",
  "Suporte humano para equipe comercial",
  "Estrutura pronta para escalar com segurança",
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#15263d_0%,#1c3250_34%,#223d5f_68%,#162b46_100%)] text-white font-['Manrope']">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 right-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.32),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute top-16 -left-32 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.28),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute bottom-10 right-24 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.2),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(15,23,42,0.55)_0%,_transparent_35%,_transparent_65%,_rgba(15,23,42,0.5)_100%)]" />
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_center,_rgba(226,232,240,0.14)_1px,_transparent_1px)] [background-size:22px_22px]" />
        </div>
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-80" />

        <header className="container mx-auto px-4 pt-8">
          <div className="flex items-center justify-between gap-6 rounded-2xl border border-white/20 bg-slate-800/55 px-4 py-3 shadow-[0_16px_32px_rgba(2,6,23,0.45)] backdrop-blur sm:px-6">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_25px_rgba(251,146,60,0.35)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-['Space Grotesk'] font-semibold tracking-tight">
                  Imobiflow
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Sistema de Gestão</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
              <a href="#diferenciais" className="hover:text-amber-300 transition">Diferenciais</a>
              <a href="#recursos" className="hover:text-amber-300 transition">Recursos</a>
              <a href="#como-funciona" className="hover:text-amber-300 transition">Como funciona</a>
              <a href="#planos" className="hover:text-amber-300 transition">Planos</a>
              <a href="#faq" className="hover:text-amber-300 transition">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-slate-200 hover:text-white"
                asChild
              >
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button
                className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 shadow-[0_12px_28px_rgba(251,146,60,0.3)] transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                asChild
              >
                <Link to="/imobiliaria">
                  Ver demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="container mx-auto px-4 pb-20 pt-16">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/55 bg-slate-800/45 px-4 py-2 text-xs uppercase tracking-[0.25em] text-amber-200 shadow-[0_8px_24px_rgba(251,191,36,0.2)] backdrop-blur">
                Software completo para operações modernas
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-['Space Grotesk'] font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Sua operação imobiliária operando em
                  <span className="block bg-gradient-to-r from-white via-slate-200 to-amber-300 text-transparent bg-clip-text">
                    modo produto.
                  </span>
                </h1>
                <p className="text-lg text-slate-300 max-w-xl">
                  Sites rápidos, CRM inteligente, automações e relatórios que transformam leads em contratos.
                  Tudo pronto para sua equipe vender mais, com previsibilidade.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 shadow-[0_14px_30px_rgba(251,146,60,0.28)] transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                  size="lg"
                  asChild
                >
                  <Link to="/auth">Quero entrar agora</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/30 bg-white/10 text-white transition-transform hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white/20"
                  asChild
                >
                  <Link to="/imobiliaria">Ver site demo</Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-70" />
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                {[
                  "Implantação em 7 dias",
                  "Suporte humano",
                  "Sem cartão de crédito",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 shadow-sm">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-up-delay-1">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-tr from-amber-200/40 via-transparent to-sky-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-slate-800/58 p-6 shadow-2xl transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(2,6,23,0.5)]">
                <div className="absolute -right-10 top-12 h-40 w-40 rounded-full bg-amber-300/25 blur-2xl" />
                <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-300/25 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300">
                    <span>Painel ao vivo</span>
                    <span className="text-amber-300">Hoje</span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Novos leads", value: "148" },
                      { label: "Visitas", value: "26" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-sm"
                      >
                        <p className="text-xs text-slate-300">{item.label}</p>
                        <p className="text-2xl font-semibold text-white">{item.value}</p>
                        <p className="text-xs text-emerald-600">+12% esta semana</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Pipeline de vendas</span>
                      <span>72%</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                      <span>Contato</span>
                      <span>Visita</span>
                      <span>Proposta</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
                      <p className="text-xs text-slate-300">Melhor corretor</p>
                      <p className="text-lg font-semibold text-white">Fernanda</p>
                      <p className="text-xs text-emerald-600">14 contratos</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-3">
                      <p className="text-xs text-slate-300">Receita projetada</p>
                      <p className="text-lg font-semibold text-white">R$ 1.2M</p>
                      <p className="text-xs text-emerald-600">+18% mês</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto px-4 py-10 animate-fade-up rounded-[28px] border border-slate-700/75 bg-[linear-gradient(130deg,#1a304a_0%,#223b58_52%,#1a2f48_100%)] shadow-[0_25px_60px_rgba(2,6,23,0.45)]">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
          Confiado por operações digitais em todo o Brasil
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm uppercase tracking-[0.35em] text-slate-400 sm:grid-cols-4 lg:grid-cols-6">
          {[
            "Viva Imob",
            "Prime One",
            "Urbana",
            "Atlas",
            "NovaCasa",
            "VilaSul",
          ].map((brand) => (
            <span
              key={brand}
              className="rounded-full border border-slate-400/70 bg-slate-800/45 px-3 py-2 text-center text-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-white hover:shadow-md"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section id="diferenciais" className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3049_0%,#213853_52%,#2b435e_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Diferenciais de produto</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Design de software pensado para equipes comerciais de alta performance.
              </h2>
              <p className="text-slate-300">
                A estrutura combina velocidade operacional, gestão centralizada e visão executiva de funil.
                O resultado é mais eficiência no dia a dia e melhor previsibilidade de receita.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {pillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="group rounded-2xl border border-white/15 bg-white/5 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200/30 to-sky-200/30 text-amber-200">
                      <pillar.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-white">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{pillar.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {workflowComparison.map((column, index) => (
                <div
                  key={column.title}
                  className={`rounded-2xl border p-6 shadow-sm ${
                    index === 0
                      ? "border-slate-400/70 bg-slate-800/45"
                      : "border-emerald-400/35 bg-emerald-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {index === 0 ? (
                      <TimerReset className="h-4 w-4 text-slate-300" />
                    ) : (
                      <BadgeCheck className="h-4 w-4 text-emerald-300" />
                    )}
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                      {column.title}
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {column.points.map((point) => (
                      <p key={point} className="flex items-start gap-2 text-sm text-slate-200">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                  Camada de confiança
                </p>
                <div className="mt-4 grid gap-3">
                  {trustSignals.map((signal) => (
                    <p key={signal} className="flex items-start gap-2 text-sm text-slate-200">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                      {signal}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3048_0%,#223a56_52%,#2c4661_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Recursos principais</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Tudo que sua operação precisa para vender com método.
              </h2>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
              <p className="text-slate-300">
                Centralize dados, processos e pessoas em uma única plataforma. Sem planilhas, sem
                retrabalho e com total visibilidade de cada etapa.
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Zap className="h-4 w-4 text-sky-300" />
                Ative novos módulos em minutos.
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-300/60 hover:bg-white/10 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/25 text-amber-300 shadow-sm">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1b314a_0%,#243d59_55%,#2d4866_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Como funciona</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Um processo simples para escalar sem estresse.
              </h2>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-sky-400 opacity-70" />
                  <div className="relative">
                    <span className="text-sm text-amber-300">{step.step}</span>
                    <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-600/70 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 p-10 text-white shadow-2xl">
          <div className="absolute -top-20 right-0 h-60 w-60 rounded-full bg-amber-400/25 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Módulos inteligentes</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Uma plataforma modular para cada fase do negócio.
              </h2>
              <p className="text-white/70 max-w-xl">
                Comece com o essencial e evolua para analytics, BI e integrações conforme o time cresce.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-white/30 bg-white/10 text-white transition-transform hover:-translate-y-0.5 hover:bg-white/20"
              asChild
            >
              <Link to="/auth">
                Solicitar onboarding
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.title}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-lg transition hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                <div className="relative">
                  <module.icon className="h-5 w-5 text-amber-300" />
                  <h3 className="mt-4 text-lg font-semibold">{module.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{module.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3049_0%,#233c58_55%,#2d4967_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Resultados reais</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Times comerciais com clareza total do funil.
              </h2>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
              <p className="text-slate-300">
                Saia do modo reativo. Entenda quais campanhas convertem, quais corretores precisam de apoio
                e onde estão os melhores negócios.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Lead scoring e roteamento",
                  "Calendário de visitas",
                  "Relatórios financeiros",
                  "Integrações com WhatsApp",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-70" />
                  <p className="text-slate-100">“{testimonial.quote}”</p>
                  <p className="mt-4 text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-slate-300">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3049_0%,#233c58_52%,#2c4662_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="absolute -right-24 top-10 h-52 w-52 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              Sem fidelidade e sem setup oculto
            </div>
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300/55 bg-amber-400/12 px-5 py-2.5 text-base font-semibold text-amber-200 shadow-sm">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Planos
            </div>
            <h2 className="mt-4 text-4xl font-['Space Grotesk'] font-semibold sm:text-5xl">
              Escolha o ritmo ideal para sua operação.
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-3xl border p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlight
                    ? "border-amber-300/70 bg-gradient-to-br from-amber-400/20 via-slate-800/64 to-amber-300/18 shadow-lg ring-2 ring-amber-300/40"
                    : "border-white/15 bg-slate-800/48 shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1 text-xs uppercase tracking-widest text-slate-900 shadow-sm">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{plan.price}</p>
                <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-6 w-full rounded-full transition-transform hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                      : "bg-white/12 text-white hover:bg-white/20"
                  }`}
                  asChild
                >
                  <Link to="/auth">Começar agora</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3049_0%,#243d59_54%,#2c4866_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">FAQ</p>
              <h2 className="mt-4 text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Tudo claro antes de começar.
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
              <p className="mt-4 text-slate-300">
                Se precisar de uma resposta personalizada, nosso time responde em até 1 dia útil.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-white/15 bg-white/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white">
                    {faq.question}
                    <span className="text-amber-500 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-300">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 animate-fade-up">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-700/80 bg-[linear-gradient(140deg,#1a3049_0%,#243d59_52%,#1a3049_100%)] p-10 text-white shadow-[0_25px_60px_rgba(2,6,23,0.5)]">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Pronto para crescer?</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Transforme sua operação em um negócio previsível.
              </h2>
              <p className="text-slate-300 max-w-xl">
                Um único painel para marketing, vendas, estoque e relacionamento com clientes.
              </p>
              <div className="flex flex-wrap gap-2">
                {["CRM + Site + BI", "Onboarding assistido", "Escalável para múltiplas equipes"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-slate-100 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 shadow-[0_12px_26px_rgba(251,146,60,0.28)] transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                size="lg"
                asChild
              >
                <Link to="/auth">Agendar demo</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/35 bg-white/10 text-white transition-transform hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white/20"
                asChild
              >
                <Link to="/imobiliaria">Explorar demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer id="contato" className="border-t border-slate-500/55 bg-[#182f4a]/92">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-lg font-['Space Grotesk'] font-semibold">Imobiflow</p>
              <p className="text-sm text-slate-300">
                Software de gestão para negócios imobiliários.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                Suporte humano
              </span>
              <span className="inline-flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Implantação rápida
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <a href="mailto:contato@imobiflow.com">Falar com vendas</a>
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <span>Imobiflow · {new Date().getFullYear()} · Todos os direitos reservados</span>
            <span>Política de privacidade</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
