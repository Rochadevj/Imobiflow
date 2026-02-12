import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ClipboardList, Clock3, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const steps = [
  "Preencha os dados do imovel e proprietario",
  "Nossa equipe revisa as informacoes",
  "Publicacao e divulgacao em ate 24h (demo)",
];

const PropertySubmit = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Formulario enviado com sucesso! Entraremos em contato em breve.");
    (event.target as HTMLFormElement).reset();
    setLoading(false);
  };

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-10 md:pt-14">
          <div className="hero-surface p-7 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
              <div className="space-y-5">
                <span className="glass-chip">Cadastro de imovel</span>
                <h1 className="max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
                  Anuncie de forma simples e profissional.
                </h1>
                <p className="max-w-xl text-sm text-white/80 md:text-base">
                  Preencha o formulario com os dados do imovel. A equipe Imobiflow valida as informacoes e
                  retorna com os proximos passos para publicacao.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:+5500000000000"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                  >
                    <Phone className="h-4 w-4" />
                    Falar com corretor
                  </a>
                  <span className="glass-chip">
                    <Clock3 className="h-3.5 w-3.5" />
                    Retorno em ate 24h (demo)
                  </span>
                </div>
              </div>

              <div className="hero-panel">
                <p className="text-xs uppercase tracking-[0.18em] text-white/80">Fluxo de publicacao</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Como funciona</h2>
                <div className="mt-5 space-y-3">
                  {steps.map((item, index) => (
                    <div key={item} className="hero-step-card">
                      <p className="font-semibold text-amber-300">Etapa {index + 1}</p>
                      <p className="mt-1 text-white/95">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="section-shell p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      1
                    </span>
                    Dados pessoais
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" required placeholder="Nome completo" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" required placeholder="exemplo@email.com" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" required placeholder="(00) 00000-0000" className="mt-1 border-slate-200 bg-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      2
                    </span>
                    Dados do imovel
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Label htmlFor="title">Titulo do anuncio</Label>
                      <Input
                        id="title"
                        required
                        placeholder="Ex: Apartamento 3 quartos no centro"
                        className="mt-1 border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Input id="type" required placeholder="Casa, apartamento, terreno..." className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="price">Valor</Label>
                      <Input id="price" type="number" required placeholder="R$ 0,00" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="location">Bairro</Label>
                      <Input id="location" required placeholder="Nome do bairro" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" required placeholder="Nome da cidade" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="area">Area total (m2)</Label>
                      <Input id="area" type="number" placeholder="Ex: 80" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="bedrooms">Quartos</Label>
                      <Input id="bedrooms" type="number" placeholder="Ex: 3" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Banheiros</Label>
                      <Input id="bathrooms" type="number" placeholder="Ex: 2" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div>
                      <Label htmlFor="parking">Vagas na garagem</Label>
                      <Input id="parking" type="number" placeholder="Ex: 1" className="mt-1 border-slate-200 bg-white" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Descricao</Label>
                      <Textarea
                        id="description"
                        required
                        placeholder="Descreva caracteristicas, diferenciais e observacoes importantes."
                        rows={6}
                        className="mt-1 border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                >
                  {loading ? "Enviando..." : "Enviar proposta"}
                </Button>
              </form>
            </div>

            <aside className="space-y-5">
              <div className="surface-card p-5">
                <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <ClipboardList className="h-5 w-5 text-amber-600" />
                  Como funciona
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    Voce envia os dados principais do imovel.
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    O time valida informacoes e orienta os proximos passos.
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    Publicacao simulada com visual profissional da plataforma.
                  </p>
                </div>
              </div>

              <div className="surface-card p-5">
                <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  O que preparar
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    Endereco completo, area e tipologia.
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    Informacoes de quartos, banheiros e vagas.
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-600" />
                    Preco desejado e diferenciais do imovel.
                  </p>
                </div>
              </div>

              <div className="surface-card border-slate-900 bg-slate-900 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.16em] text-white/65">Atendimento direto</p>
                <p className="mt-2 text-sm text-white/85">
                  Precisa de ajuda para preencher? Fale com um corretor e montamos o anuncio com voce.
                </p>
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
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
