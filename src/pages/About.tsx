import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Award, MapPin, Phone, MessageCircle, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Sobre padronizado com Home */}
        <section className="relative bg-primary/95 text-white pt-12 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-accent/10 rounded-bl-[180px]" />
            <div className="absolute left-0 bottom-0 w-[260px] h-[260px] bg-white/5 rounded-tr-[140px]" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 max-w-xl">
                  Sobre
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-md mb-6">
                  Atendimento humano, agilidade e transparência para você comprar, vender ou alugar com segurança.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:+5551999999999"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow hover:bg-white/90 transition"
                  >
                    <Phone className="h-4 w-4" />
                    Falar agora
                  </a>
                  <a
                    href="/anunciar"
                    className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-4 py-2 text-sm font-semibold shadow hover:bg-accent/90 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Anunciar imóvel
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <img
                    src="/static/912b6244-30a1-455b-891e-53a6b4c28e8c.jpeg"
                    alt="Kaptei Solucoes Imobiliarias"
                    className="w-full h-[360px] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Atendimento premium em Canoas e região
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Kaptei Solucoes Imobiliarias
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Kaptei Soluções Imobiliárias foi criada para transformar negócios imobiliários em
                  experiências seguras, transparentes e juridicamente bem fundamentadas. Atuamos com
                  especialização em vendas, locações e regularização de imóveis, oferecendo atendimento
                  personalizado, análise criteriosa de cada oportunidade e acompanhamento completo em
                  todas as fases do negócio.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nosso diferencial está no suporte jurídico permanente, que assegura tranquilidade,
                  agilidade e proteção patrimonial aos clientes. Cada imóvel é tratado como patrimônio
                  único, com critério e visão de longo prazo.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Imóveis", value: "+350", note: "anunciados" },
                    { label: "Avaliações", value: "4.9/5", note: "clientes" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.note}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: MapPin, title: "Localização", text: "Centro de Canoas/RS" },
                    { icon: Award, title: "CRECI", text: "078852" },
                    { icon: Building2, title: "Especialidade", text: "Canoas e Grande Porto Alegre" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-border/60 bg-background/80 p-4 text-sm">
                      <item.icon className="h-5 w-5 text-accent mb-2" />
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-white/60">Parceria jurídica</p>
                        <h3 className="text-2xl font-bold text-white">CRA Advocacia</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                          Especialistas em direito imobiliário, contratual e regularização, oferecendo
                          análise preventiva, due diligence e segurança jurídica em cada contrato.
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -inset-6 rounded-full bg-amber-300/20 blur-3xl" />
                      <img
                        src="/static/sublogo.png"
                        alt="CRA Advocacia"
                        className="relative h-40 md:h-44 w-auto min-w-[170px] md:min-w-[210px] max-w-none object-contain flex-shrink-0 drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)] transition-transform duration-[1200ms] hover:scale-105 animate-[spin_16s_linear_infinite]"
                      />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Direito Imobiliário",
                        "Direito Contratual",
                        "Due Diligence",
                        "Registro e Escrituras",
                        "Regularização",
                        "Análise de Riscos",
                      ].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/70"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                  <h3 className="text-xl font-bold text-foreground">Diferenciais Kaptei</h3>
                  <div className="mt-4 grid gap-3">
                    {[
                      "Departamento jurídico próprio para prevenção de riscos",
                      "Atendimento presencial qualificado no Centro de Canoas/RS",
                      "Negociação transparente com segurança jurídica",
                      "Acompanhamento completo até o fechamento",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-secondary p-6">
                  <h3 className="text-xl font-bold text-foreground">Nossa Missão</h3>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    Entregar segurança e confiança em cada operação imobiliária, com transparência,
                    critério e respaldo jurídico, valorizando o patrimônio e a história de cada cliente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold text-foreground">Por que escolher nossos serviços?</h3>
                <a
                  href="/anunciar"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-sm font-semibold shadow hover:bg-primary/90 transition"
                >
                  Anunciar imóvel
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Experiência local",
                    text: "Conhecimento profundo do mercado imobiliário de Canoas e região.",
                  },
                  {
                    title: "Atendimento personalizado",
                    text: "Cada cliente recebe atenção especial e solução sob medida.",
                  },
                  {
                    title: "Compromisso",
                    text: "Transparência e ética em todas as negociações.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border/60 bg-background/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.text}</p>
                  </div>
                ))}
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
