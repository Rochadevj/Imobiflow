import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users2,
} from "lucide-react";

const values = [
  "Atendimento humano e consultivo",
  "Processos claros do inicio ao fechamento",
  "Seguranca juridica em cada etapa",
  "Comunicacao transparente com cliente e proprietario",
];

const highlights = [
  {
    icon: Users2,
    title: "Atendimento consultivo",
    text: "Equipe preparada para orientar compra, venda e locacao com foco em clareza e resultado.",
  },
  {
    icon: ShieldCheck,
    title: "Operacao segura",
    text: "Checklist documental e revisoes para reduzir risco e acelerar o fechamento.",
  },
  {
    icon: Clock3,
    title: "Agilidade real",
    text: "Fluxo organizado para retorno rapido e acompanhamentos consistentes.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "Inicio da operacao",
    text: "Nascimento da marca com foco em atendimento boutique para clientes residenciais.",
  },
  {
    year: "2024",
    title: "Expansao da carteira",
    text: "Novos bairros, mais corretores e padronizacao de processos comerciais.",
  },
  {
    year: "2026",
    title: "Modelo digital",
    text: "Demo estruturada para apresentar captacao, vitrine e conversao em um unico sistema.",
  },
];

const About = () => {
  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-10 md:pt-14">
          <div className="hero-surface p-7 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <span className="glass-chip">Sobre a empresa</span>
                <h1 className="max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
                  Atendimento humano, agilidade e transparencia para negociar com seguranca.
                </h1>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  A Imobiflow e uma marca demo criada para apresentar um modelo profissional de imobiliaria:
                  processos organizados, comunicacao clara e experiencia completa para cliente e corretor.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:+5500000000000"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                  >
                    <Phone className="h-4 w-4" />
                    Falar agora
                  </a>
                  <a
                    href="/anunciar"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Anunciar imovel
                  </a>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/80">
                  <span className="glass-chip">
                    <MapPin className="h-3.5 w-3.5" />
                    Atendimento nacional
                  </span>
                  <span className="glass-chip">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    CRECI 000000-XX (demo)
                  </span>
                </div>
              </div>

              <div className="hero-panel">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">Manifesto Imobiflow</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Como trabalhamos</h2>
                <div className="mt-5 space-y-3">
                  {values.map((item) => (
                    <p key={item} className="flex items-start gap-2 text-sm text-white/95">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
                <a
                  href="/imobiliaria?list=1"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
                >
                  Ver imoveis da demo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="surface-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-14">
          <div className="section-shell p-6 md:p-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
              <div>
                <p className="accent-chip">Nossa historia</p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900">Uma marca demo com cara de operacao real</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Esta pagina representa uma imobiliaria ficticia para demonstracao comercial. O objetivo e
                  mostrar como o produto funciona com identidade profissional, linguagem clara e estrutura pronta
                  para receber estoque, leads e negociacoes.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="surface-card-muted p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Imoveis</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">+350</p>
                  </div>
                  <div className="surface-card-muted p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Satisfacao</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">4.9/5</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {timeline.map((item) => (
                  <div key={item.year} className="surface-card-muted p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">{item.year}</p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Imobiflow</p>
                  <p className="mt-2 text-xl font-semibold">Quer anunciar seu imovel na demo?</p>
                  <p className="mt-1 text-sm text-white/75">
                    Envie os dados do imovel e simulamos todo o fluxo de captacao e publicacao.
                  </p>
                </div>
                <a
                  href="/anunciar"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                >
                  Anunciar agora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
