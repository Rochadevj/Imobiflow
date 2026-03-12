import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import TenantLink from "@/components/TenantLink";
import { useTenant } from "@/context/TenantContext";
import { formatPhoneDisplay } from "@/lib/contact";
import {
  getTenantBrandName,
  getTenantCreci,
  getTenantLocationLabel,
  getTenantWhatsApp,
} from "@/lib/tenantBrand";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users2,
} from "lucide-react";

const values = [
  "Atendimento humano e consultivo",
  "Processos claros do início ao fechamento",
  "Segurança jurídica em cada etapa",
  "Comunicação transparente com cliente e proprietário",
];

const highlights = [
  {
    icon: Users2,
    title: "Atendimento consultivo",
    text: "Equipe preparada para orientar compra, venda e locação com foco em clareza e resultado.",
  },
  {
    icon: ShieldCheck,
    title: "Operação segura",
    text: "Checklist documental e revisões para reduzir risco e acelerar o fechamento.",
  },
  {
    icon: Clock3,
    title: "Agilidade real",
    text: "Fluxo organizado para retorno rápido e acompanhamentos consistentes.",
  },
];

const timeline = [
  {
    year: "Atuação",
    title: "Compra, venda e locação com acompanhamento próximo",
    text: "Atendimento orientado para entender o perfil do cliente, apresentar boas opções e conduzir cada negociação com clareza.",
  },
  {
    year: "Atendimento",
    title: "Relacionamento que continua além da primeira visita",
    text: "Contato ágil, retorno organizado e acompanhamento contínuo para proprietários, compradores e locatários.",
  },
  {
    year: "Segurança",
    title: "Processos documentais conduzidos com responsabilidade",
    text: "Conferência de informações, organização contratual e mais segurança nas etapas que antecedem o fechamento.",
  },
];

const About = () => {
  const { tenant } = useTenant();
  const brandName = getTenantBrandName(tenant);
  const whatsapp = getTenantWhatsApp(tenant);
  const locationLabel = getTenantLocationLabel(tenant);
  const creci = getTenantCreci(tenant);

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
                  Atendimento humano, agilidade e transparência para negociar com segurança.
                </h1>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  {brandName} apresenta uma operação imobiliária com catálogo organizado, comunicação clara e experiência profissional para compradores, locatários e proprietários.
                </p>
                <div className="flex flex-wrap gap-3">
                  <TrackedWhatsAppLink
                    phone={whatsapp}
                    message={`Olá! Quero falar com a equipe da ${brandName}.`}
                    source="about_hero"
                    tenantSlug={tenant?.slug}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                  >
                    <Phone className="h-4 w-4" />
                    Falar agora
                  </TrackedWhatsAppLink>
                  <TenantLink
                    to="/anunciar"
                    forceTenant
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Anunciar imóvel
                  </TenantLink>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/80">
                  <span className="glass-chip">{locationLabel}</span>
                  <span className="glass-chip">{creci}</span>
                  <span className="glass-chip">{formatPhoneDisplay(whatsapp)}</span>
                </div>
              </div>

              <div className="hero-panel">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">Sobre {brandName}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Como trabalhamos</h2>
                <div className="mt-5 space-y-3">
                  {values.map((item) => (
                    <p key={item} className="flex items-start gap-2 text-sm text-white/95">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
                <TenantLink
                  to="/imobiliaria?list=1"
                  forceTenant
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-200"
                >
                  Ver imóveis do catálogo
                  <ArrowRight className="h-4 w-4" />
                </TenantLink>
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
                <p className="accent-chip">Posicionamento</p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-900">
                  Uma imobiliária preparada para atender com clareza, agilidade e responsabilidade
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {brandName} atua com foco em compra, venda e locação de imóveis, mantendo uma comunicação próxima,
                  apresentação profissional do catálogo e acompanhamento cuidadoso em cada etapa da negociação.
                  A proposta é oferecer segurança para proprietários, compradores e locatários, com processos mais
                  organizados, retorno ágil e atendimento consultivo.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="surface-card-muted p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Imóveis</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">+350</p>
                  </div>
                  <div className="surface-card-muted p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Satisfação</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">4.9/5</p>
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
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">{brandName}</p>
                  <p className="mt-2 text-xl font-semibold">Quer anunciar seu imóvel?</p>
                  <p className="mt-1 text-sm text-white/75">
                    Envie os dados do imóvel e iniciamos o fluxo de captação com a identidade desta operação.
                  </p>
                </div>
                <TenantLink
                  to="/anunciar"
                  forceTenant
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                >
                  Anunciar agora
                  <ArrowRight className="h-4 w-4" />
                </TenantLink>
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
