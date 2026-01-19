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
                    src="https://image2url.com/r2/default/images/1768503458615-ed858721-5db1-4885-8ebb-49003a1fc30a.png"
                    alt="Kaptei Solucoes Imobiliarias"
                    className="w-full h-[360px] object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Kaptei Solucoes Imobiliarias</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Imóveis</p>
                    <p className="text-xl font-bold text-foreground">+350</p>
                    <p className="text-xs text-muted-foreground">anunciados</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Avaliações</p>
                    <p className="text-xl font-bold text-foreground">4.9/5</p>
                    <p className="text-xs text-muted-foreground">clientes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Localização</h3>
                      <p className="text-muted-foreground">Canoas, Rio Grande do Sul</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">CRECI</h3>
                      <p className="text-muted-foreground">078852</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Especialidade</h3>
                      <p className="text-muted-foreground">
                        Imobiliaria em Canoas e regiao metropolitana de Porto Alegre
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <h3 className="text-2xl font-bold text-foreground">Nossa Missão</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Com anos de experiência no mercado imobiliário de Canoas e região, 
                  nosso compromisso é ajudar você a encontrar o imóvel perfeito ou 
                  realizar a venda da sua propriedade com segurança e transparência.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Trabalhamos com dedicação para entender as necessidades de cada cliente, 
                  oferecendo um atendimento personalizado e assessoria completa em todas 
                  as etapas do processo de compra, venda ou locação de imóveis.
                </p>
                <div className="space-y-3">
                  {[
                    "Análise de mercado e precificação justa",
                    "Divulgação estratégica com fotos e anúncios",
                    "Suporte jurídico e documental completo",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-8">
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
                <div className="rounded-lg border border-border/60 bg-background/70 p-5">
                  <h4 className="font-semibold mb-2 text-foreground">Experiência Local</h4>
                  <p className="text-muted-foreground text-sm">
                    Conhecimento profundo do mercado imobiliário de Canoas e região
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 p-5">
                  <h4 className="font-semibold mb-2 text-foreground">Atendimento Personalizado</h4>
                  <p className="text-muted-foreground text-sm">
                    Cada cliente recebe atenção especial e soluções sob medida
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 p-5">
                  <h4 className="font-semibold mb-2 text-foreground">Compromisso</h4>
                  <p className="text-muted-foreground text-sm">
                    Transparência e ética em todas as negociações
                  </p>
                </div>
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
