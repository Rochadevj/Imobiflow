import { useEffect, useState } from "react";
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
  Users2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/contact";

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
    price: "R$ 199",
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
    price: "R$ 349",
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

const renderSentenceTitle = (text: string) => {
  const parts = text.split(/(?<=\.)\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return text;
  }

  return parts.map((part, index) => (
    <span key={`${part}-${index}`} className="block">
      {part}
    </span>
  ));
};

const Landing = () => {
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const nextOffset = Math.min((window.scrollY || 0) * 0.12, 24);
      setHeaderOffset(nextOffset);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#15263d_0%,#1c3250_34%,#223d5f_68%,#162b46_100%)] text-white font-['Manrope']">
      <header
        className="fixed inset-x-0 top-0 z-50 pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${headerOffset}px)` }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="pointer-events-auto relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/20 bg-slate-800/65 px-4 py-3 shadow-[0_16px_32px_rgba(2,6,23,0.45)] backdrop-blur sm:gap-6 sm:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-80" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label="Voltar ao início da landing page"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_25px_rgba(251,146,60,0.35)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-['Space Grotesk'] font-semibold tracking-tight">
                  Imobiflow
                </p>
                <p className="hidden text-xs uppercase tracking-[0.3em] text-slate-300 sm:block">Sistema de Gestão</p>
              </div>
            </button>

            <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
              <a href="#diferenciais" className="hover:text-amber-300 transition">Diferenciais</a>
              <a href="#recursos" className="hover:text-amber-300 transition">Recursos</a>
              <a href="#como-funciona" className="hover:text-amber-300 transition">Como funciona</a>
              <a href="#planos" className="hover:text-amber-300 transition">Planos</a>
              <a href="#faq" className="hover:text-amber-300 transition">FAQ</a>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                className="h-10 rounded-full border border-white/15 bg-white/8 px-3 text-sm text-slate-100 hover:bg-white/12 hover:text-white sm:px-4"
                asChild
              >
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button
                className="h-10 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-3 text-sm text-slate-900 shadow-[0_12px_28px_rgba(251,146,60,0.3)] transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400 sm:px-5"
                asChild
              >
                <Link to="/imobiliaria">
                  <span className="sm:hidden">Demo</span>
                  <span className="hidden sm:inline">Ver demo</span>
                  <ArrowRight className="hidden h-4 w-4 sm:inline-flex" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 right-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.32),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute top-16 -left-32 h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.28),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute bottom-10 right-24 h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.2),_transparent_70%)] blur-3xl float-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,_rgba(15,23,42,0.55)_0%,_transparent_35%,_transparent_65%,_rgba(15,23,42,0.5)_100%)]" />
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_center,_rgba(226,232,240,0.14)_1px,_transparent_1px)] [background-size:22px_22px]" />
        </div>
        <section className="container mx-auto px-4 pb-20 pt-16">
          <div className="grid gap-14 xl:grid-cols-[1.02fr_0.98fr] xl:items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.26em] text-amber-200 shadow-[0_8px_24px_rgba(251,191,36,0.18)] backdrop-blur">
                Plataforma para imobiliárias que querem vender com método
              </div>

              <div className="space-y-6">
                <h1 className="max-w-3xl text-4xl font-['Space Grotesk'] font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Mais resposta, menos retrabalho e uma operação que passa confiança.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  A Imobiflow organiza site, estoque, atendimento, automações e visão comercial em uma única
                  camada. O cliente enxerga profissionalismo. Sua equipe enxerga prioridade.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 shadow-[0_14px_30px_rgba(251,146,60,0.28)] transition-transform hover:-translate-y-0.5 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                  size="lg"
                  asChild
                >
                  <Link to="/auth">Quero ver a plataforma</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/30 bg-white/10 text-white transition-transform hover:-translate-y-0.5 hover:border-amber-300 hover:bg-white/20"
                  asChild
                >
                  <Link to="/imobiliaria">Explorar site demo</Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Operações ativas", value: "120+", note: "implantação e expansão assistidas" },
                  { label: "Tempo de resposta", value: "< 5 min", note: "com fila, alertas e automações" },
                  { label: "Visitas agendadas", value: "+32%", note: "média após organizar o funil" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/45 px-5 py-5 shadow-[0_18px_40px_rgba(2,6,23,0.24)] transition hover:-translate-y-1 hover:bg-slate-900/60 hover:shadow-[0_24px_54px_rgba(2,6,23,0.32)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-80" />
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">{item.label}</p>
                    <p className="mt-4 text-sm text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                {[
                  "Venda, locação e lançamentos no mesmo fluxo",
                  "Site, CRM, atendimento e BI na mesma plataforma",
                  "Gestores, corretores e marketing olhando a mesma verdade",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 shadow-sm backdrop-blur"
                  >
                    <BadgeCheck className="h-4 w-4 text-emerald-300" />
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

      <section className="container mx-auto px-4 py-10 animate-fade-up">
        <div className="rounded-[32px] border border-slate-600/70 bg-[linear-gradient(135deg,#132a43_0%,#1b3552_52%,#10243a_100%)] p-6 shadow-[0_25px_60px_rgba(2,6,23,0.42)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Percepção de valor</p>
              <h2 className="mt-4 text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                {renderSentenceTitle("A imobiliária ganha gestão. O cliente final percebe confiança.")}
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">
                A Imobiflow não entrega só um painel interno. Ela entrega presença digital profissional,
                atendimento mais rápido e uma experiência mais organizada para quem quer comprar, alugar ou
                anunciar um imóvel.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
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
                    className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  value: "7 dias",
                  label: "para colocar site e CRM no ar",
                  note: "implantação assistida sem travar o time",
                },
                {
                  value: "1 painel",
                  label: "para gestor, corretor e marketing",
                  note: "menos retrabalho e mais previsibilidade",
                },
                {
                  value: "24/7",
                  label: "captura de leads com automações",
                  note: "fila, alerta e resposta padronizada",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/7 p-5 shadow-[0_18px_42px_rgba(2,6,23,0.22)]"
                >
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="mt-3 text-sm font-medium text-slate-100">{item.label}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="diferenciais" className="scroll-mt-32 container mx-auto px-4 py-20 animate-fade-up">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-slate-700/75 bg-[linear-gradient(145deg,#142c45_0%,#1b3551_52%,#223b57_100%)] p-6 shadow-[0_24px_58px_rgba(2,6,23,0.42)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Diferenciais de produto</p>
            <h2 className="mt-4 text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
              Do primeiro clique ao fechamento, tudo conversa na mesma lógica.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              A experiência melhora para quem lidera a operação, para quem atende e para quem está comprando,
              alugando ou avaliando um imóvel. O ganho não é só visual, é operacional.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="group rounded-3xl border border-white/15 bg-white/6 p-5 transition hover:-translate-y-1 hover:bg-white/9 hover:shadow-lg"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300/18 to-sky-300/18 text-amber-200">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {workflowComparison.map((column, index) => (
                <div
                  key={column.title}
                  className={`rounded-[30px] border p-6 shadow-[0_18px_40px_rgba(2,6,23,0.22)] ${
                    index === 0
                      ? "border-white/15 bg-slate-900/45"
                      : "border-emerald-300/35 bg-[linear-gradient(160deg,rgba(16,185,129,0.12),rgba(15,23,42,0.38))]"
                  }`}
                >
                  <p className={`text-xs uppercase tracking-[0.28em] ${index === 0 ? "text-slate-400" : "text-emerald-200"}`}>
                    {index === 0 ? "Rotina que trava crescimento" : "Fluxo pronto para escalar"}
                  </p>
                  <h3 className="mt-3 text-2xl font-['Space Grotesk'] font-semibold text-white">{column.title}</h3>
                  <div className="mt-6 space-y-3">
                    {column.points.map((point) => (
                      <p key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 ${index === 0 ? "text-slate-400" : "text-emerald-300"}`} />
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[30px] border border-white/15 bg-[linear-gradient(140deg,rgba(15,23,42,0.72),rgba(15,23,42,0.46))] p-6 shadow-[0_18px_42px_rgba(2,6,23,0.24)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Camada de confiança</p>
                  <h3 className="mt-3 text-2xl font-['Space Grotesk'] font-semibold text-white">
                    Estrutura pronta para crescer sem virar bagunça.
                  </h3>
                </div>
                <Link to="/auth" className="inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition hover:text-amber-100">
                  Quero ver isso no meu fluxo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {trustSignals.map((signal) => (
                  <div key={signal} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm text-slate-200">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>{signal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="scroll-mt-32 container mx-auto px-4 py-20 animate-fade-up">
        <div className="grid gap-6 xl:grid-cols-[1.03fr_0.97fr]">
          <div className="rounded-[32px] border border-slate-700/75 bg-[linear-gradient(145deg,#142c45_0%,#1b3551_52%,#233d5a_100%)] p-6 shadow-[0_24px_58px_rgba(2,6,23,0.42)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Recursos principais</p>
            <h2 className="mt-4 text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
              {renderSentenceTitle("O cliente percebe velocidade e confiança. O time percebe organização de verdade.")}
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Uma boa plataforma imobiliária precisa resolver experiência pública e rotina interna ao mesmo tempo.
              É isso que cria valor visível, adoção e retenção no dia a dia.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: LayoutGrid,
                  title: "Captação e vitrine",
                  text: "Cadastre, publique e mantenha o estoque consistente em poucos passos.",
                },
                {
                  icon: MessageCircle,
                  title: "Atendimento centralizado",
                  text: "Toda conversa com lead e proprietário fica registrada e acionável.",
                },
                {
                  icon: Zap,
                  title: "Automação útil",
                  text: "Alertas, distribuição e follow-up sem aquele caos de tarefas manuais.",
                },
                {
                  icon: BarChart3,
                  title: "Gestão com previsibilidade",
                  text: "Veja o que está convertendo, quem precisa de apoio e onde agir primeiro.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-3xl border border-white/15 bg-white/6 p-5 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-amber-300">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-amber-300/25 bg-[linear-gradient(135deg,rgba(251,191,36,0.14),rgba(15,23,42,0.24))] p-6 shadow-[0_18px_42px_rgba(2,6,23,0.2)]">
              <p className="text-xs uppercase tracking-[0.28em] text-amber-200">Percepção de valor</p>
              <h3 className="mt-3 text-2xl font-['Space Grotesk'] font-semibold text-white">
                A mesma plataforma ajuda a captar melhor, atender melhor e apresentar melhor o estoque.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                Isso deixa a landing mais convincente porque ela para de parecer só uma peça visual e passa a
                comunicar um produto que realmente organiza a imobiliária.
              </p>
            </div>
          </div>

          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const isFeaturedCard = index === 0;
              const cardTone =
                index % 3 === 0
                  ? "bg-[linear-gradient(145deg,rgba(15,23,42,0.72),rgba(15,23,42,0.42))]"
                  : index % 3 === 1
                    ? "bg-[linear-gradient(145deg,rgba(20,44,69,0.8),rgba(30,58,88,0.46))]"
                    : "bg-[linear-gradient(145deg,rgba(16,40,63,0.78),rgba(42,67,96,0.44))]";

              return (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-[28px] border border-white/15 p-6 shadow-[0_18px_42px_rgba(2,6,23,0.22)] transition hover:-translate-y-1 hover:border-amber-300/45 hover:shadow-[0_24px_54px_rgba(2,6,23,0.28)] ${cardTone} ${
                    isFeaturedCard ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%)] opacity-0 transition group-hover:opacity-100" />
                  <div className={`relative ${isFeaturedCard ? "sm:flex sm:items-start sm:gap-5" : ""}`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-amber-300">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <div className={isFeaturedCard ? "mt-4 sm:mt-0" : ""}>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/90">
                        {isFeaturedCard ? "Destaque da plataforma" : "Módulo estratégico"}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{feature.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-32 container mx-auto px-4 py-20 animate-fade-up">
        <div className="rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1b314a_0%,#243d59_55%,#2d4866_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300">Como funciona</p>
              <h2 className="text-3xl font-['Space Grotesk'] font-semibold sm:text-4xl">
                Um processo simples para escalar sem estresse.
              </h2>
              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-sky-400" />
            </div>
            <div className="relative grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className={`group relative overflow-hidden rounded-[26px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    index === 1
                      ? "border-amber-300/35 bg-[linear-gradient(165deg,rgba(251,191,36,0.14),rgba(15,23,42,0.34))]"
                      : index === 2
                        ? "border-sky-300/35 bg-[linear-gradient(165deg,rgba(56,189,248,0.14),rgba(15,23,42,0.34))]"
                        : "border-white/15 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 ${
                      index === 1
                        ? "bg-gradient-to-r from-amber-400 to-orange-400"
                        : index === 2
                          ? "bg-gradient-to-r from-sky-400 to-cyan-300"
                          : "bg-gradient-to-r from-amber-400 to-sky-400 opacity-70"
                    }`}
                  />
                  <div className="relative">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-white/25 px-2 text-xs font-semibold tracking-[0.16em] text-amber-200">
                      {step.step}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{step.text}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-300/90">
                      {index === 0
                        ? "Diagnóstico em até 30 min"
                        : index === 1
                          ? "Implantação sem travar o time"
                          : "Acompanhamento por indicadores"}
                    </p>
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
              <article className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(145deg,rgba(15,23,42,0.72),rgba(30,41,59,0.54))] p-6 shadow-[0_18px_42px_rgba(2,6,23,0.22)]">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-sky-400 opacity-80" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-amber-200">Caso em destaque</p>
                <p className="mt-4 text-slate-100">“{testimonials[0].quote}”</p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{testimonials[0].name}</p>
                  <p className="text-xs text-slate-300">{testimonials[0].role}</p>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-300 opacity-75" />
                  <p className="text-sm text-slate-100">“{testimonials[1].quote}”</p>
                  <p className="mt-4 text-sm font-semibold text-white">{testimonials[1].name}</p>
                  <p className="text-xs text-slate-300">{testimonials[1].role}</p>
                </article>

                <div className="rounded-2xl border border-emerald-300/25 bg-emerald-500/10 p-5 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-200">Indicadores médios</p>
                  <div className="mt-4 space-y-3">
                    {stats.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/7 px-3 py-2"
                      >
                        <span className="text-xs text-slate-200">{item.label}</span>
                        <span className="text-sm font-semibold text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="scroll-mt-32 container mx-auto px-4 py-20 animate-fade-up">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-700/70 bg-[linear-gradient(140deg,#1a3049_0%,#233c58_52%,#2c4662_100%)] p-6 text-white shadow-[0_24px_58px_rgba(2,6,23,0.46)] backdrop-blur sm:p-8">
          <div className="absolute -right-24 top-10 h-52 w-52 rounded-full bg-amber-300/30 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="text-center">
            <div className="mx-auto flex w-fit flex-col items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-200">
                <BadgeCheck className="h-3.5 w-3.5" />
                Sem fidelidade e sem setup oculto
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/55 bg-amber-400/12 px-5 py-2.5 text-base font-semibold text-amber-200 shadow-sm">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Planos
              </div>
            </div>
            <h2 className="mt-6 text-4xl font-['Space Grotesk'] font-semibold sm:text-5xl">
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

      <section id="faq" className="scroll-mt-32 container mx-auto px-4 py-20 animate-fade-up">
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
        <div className="relative overflow-hidden rounded-[32px] border border-slate-700/80 bg-[linear-gradient(140deg,#1a3049_0%,#243d59_52%,#1a3049_100%)] p-6 text-white shadow-[0_25px_60px_rgba(2,6,23,0.5)] sm:p-10">
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
                <Link to="/auth">Agendar Contato</Link>
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[1.1fr_0.9fr_1fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_24px_rgba(251,146,60,0.3)]">
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-lg font-['Space Grotesk'] font-semibold text-white">Imobiflow</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Plataforma imobiliária</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                Site imobiliário, gestão comercial e operação centralizada em uma única plataforma.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Site próprio", "CRM comercial", "Operação integrada"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-slate-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">Institucional</p>
              <nav className="mt-4 grid gap-3 text-sm text-slate-300">
                <a href="#diferenciais" className="transition hover:text-white">Diferenciais</a>
                <a href="#recursos" className="transition hover:text-white">Recursos</a>
                <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
                <a href="#planos" className="transition hover:text-white">Planos</a>
                <a href="#faq" className="transition hover:text-white">FAQ</a>
              </nav>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/6 p-5 shadow-[0_18px_38px_rgba(2,6,23,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">Contato</p>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <a href="mailto:contato@imobiflow.com" className="flex items-center gap-2 transition hover:text-white">
                  <MessageCircle className="h-4 w-4 text-amber-400" />
                  contato@imobiflow.com
                </a>
                <a
                  href={buildWhatsAppLink("Olá! Quero conhecer melhor a plataforma Imobiflow.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  <Link2 className="h-4 w-4 text-amber-400" />
                  WhatsApp: {CONTACT_WHATSAPP_DISPLAY}
                </a>
                <Link to="/politica-privacidade" className="flex items-center gap-2 transition hover:text-white">
                  <FileText className="h-4 w-4 text-amber-400" />
                  Política de Privacidade
                </Link>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                  asChild
                >
                  <Link to="/auth">Solicitar apresentação</Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/8 text-white hover:bg-white/15"
                  asChild
                >
                  <Link to="/imobiliaria">Ver ambiente demo</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-4">
              <span>Imobiflow · {new Date().getFullYear()} · Todos os direitos reservados</span>
              <span>Software para operações imobiliárias</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <span>Site</span>
              <span>CRM</span>
              <span>Atendimento</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

