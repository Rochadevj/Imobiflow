import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, ClipboardList, Clock, Phone, ShieldCheck } from "lucide-react";

const PropertySubmit = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Formulário enviado com sucesso! Entraremos em contato em breve.");
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Anunciar padronizado com Home */}
        <section className="relative bg-primary/95 text-white pt-12 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-accent/10 rounded-bl-[180px]" />
            <div className="absolute left-0 bottom-0 w-[260px] h-[260px] bg-white/5 rounded-tr-[140px]" />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 max-w-xl">
                  Anuncie de forma simples e prática
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-md mb-6">
                  Preencha o formulário abaixo com as informações do seu imóvel. Nossa equipe analisará os dados e em breve, um de nossos corretores entrará em contato para finalizar a publicação do seu anúncio.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:+5551999999999"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow hover:bg-white/90 transition"
                  >
                    <Phone className="h-4 w-4" />
                    Falar com corretor
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-4 py-2 text-sm">
                    <Clock className="h-4 w-4 text-white/90" />
                    Resposta em até 24h
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <img
                    src="/static/natureza-morta-de-chaves-para-uma-nova-casa.jpg"
                    alt="Anunciar imóvel"
                    className="w-full h-[280px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] gap-8">
            <div className="bg-card rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                  Dados pessoais
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" required placeholder="Nome completo" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" required placeholder="exemplo@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" required placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                  Dados do Imóvel
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Título do anúncio</Label>
                    <Input id="title" required placeholder="Ex: Apartamento 3 quartos no centro" />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Input id="type" required placeholder="Casa, Apartamento, Terreno..." />
                  </div>
                  <div>
                    <Label htmlFor="price">Valor</Label>
                    <Input id="price" type="number" required placeholder="R$ 0,00" />
                  </div>
                  <div>
                    <Label htmlFor="location">Bairro</Label>
                    <Input id="location" required placeholder="Nome do bairro" />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" required placeholder="Nome da cidade" />
                  </div>
                  <div>
                    <Label htmlFor="area">Área total (m²)</Label>
                    <Input id="area" type="number" placeholder="Ex: 80" />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input id="bedrooms" type="number" placeholder="Ex: 3" />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input id="bathrooms" type="number" placeholder="Ex: 2" />
                  </div>
                  <div>
                    <Label htmlFor="parking">Vagas na garagem</Label>
                    <Input id="parking" type="number" placeholder="Ex: 1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      required 
                      placeholder="Descreva as características do imóvel..."
                      rows={6}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {loading ? "Enviando..." : "Enviar Proposta"}
              </Button>
              </form>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  Como funciona
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Envie os dados principais do imóvel</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Validamos informações e combinamos fotos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Publicamos e divulgamos para compradores</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/80 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  O que preparar
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Endereço completo e metragem</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Número de quartos e banheiros</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5" />
                    <span>Valor esperado e condições</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertySubmit;
