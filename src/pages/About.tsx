import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Award, MapPin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Sobre padronizado com Home */}
        <section className="relative bg-primary/95 text-white pt-12 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-accent/10 rounded-bl-[180px]" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 max-w-xl">Sobre</h1>
                <p className="text-base md:text-lg text-white/80 max-w-md">
                  Conheça nosso trabalho e compromisso
                </p>
              </div>
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <img
                    src="https://image2url.com/r2/bucket3/images/1767721437678-6111c713-d5f6-49f9-9e56-66c3fc780c1f.png"
                    alt="Alexandre Andrade"
                    className="w-full h-[320px] object-cover object-center"
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
                <h2 className="text-3xl font-bold text-foreground">Alexandre Andrade</h2>
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
                        Corretor de Imóveis em Canoas e região metropolitana de Porto Alegre
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
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
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Por que escolher nossos serviços?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Experiência Local</h4>
                  <p className="text-muted-foreground text-sm">
                    Conhecimento profundo do mercado imobiliário de Canoas e região
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Atendimento Personalizado</h4>
                  <p className="text-muted-foreground text-sm">
                    Cada cliente recebe atenção especial e soluções sob medida
                  </p>
                </div>
                <div>
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
