import { useState } from "react";
import { Building2, Link2, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface RealtorCardProps {
  name: string;
  creci: string;
  phone: string;
  propertyTitle: string;
  propertyCode: string;
  propertyType: string;
  transactionType?: string;
  area?: number;
  location?: string;
  city?: string;
}

export default function RealtorCard({
  name,
  creci,
  phone,
  propertyTitle,
  propertyCode,
  propertyType,
  transactionType,
  area,
  location,
  city,
}: RealtorCardProps) {
  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartamento: "Apartamento",
      casa: "Casa",
      casa_condominio: "Casa em condominio",
      cobertura: "Cobertura",
      sala_comercial: "Sala comercial",
      sobrado: "Sobrado",
      sobrado_condominio: "Sobrado em condominio",
      terreno: "Terreno",
      comercial: "Comercial",
      galpao: "Galpao",
      chacara: "Chacara",
      sitio: "Sitio",
      lancamento: "Lancamento",
    };
    return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getTransactionLabel = (type?: string) => {
    if (type === "aluguel") return "para alugar";
    if (type === "venda") return "para comprar";
    if (type === "lancamento") return "sobre o lancamento";
    return "para comprar";
  };

  const areaSuffix = area && !propertyTitle.includes("m2") ? ` com ${area}m2` : "";
  const locationText = location ? ` no bairro ${location}` : "";
  const cityText = city ? ` em ${city}` : "";
  const propertyName = propertyTitle || getPropertyTypeLabel(propertyType);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: `Gostaria de mais informacoes sobre o codigo ${propertyCode} - ${propertyName}${areaSuffix}${locationText}${cityText} ${getTransactionLabel(transactionType)}.`,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Solicitacao enviada! Em breve entraremos em contato.");
  };

  const whatsappMessage = encodeURIComponent(
    `Ola ${name}, tenho interesse no imovel ${propertyTitle} (codigo ${propertyCode}).`
  );
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, "")}&text=${whatsappMessage}`;

  return (
    <div className="surface-card sticky top-24 space-y-5 border-slate-200/80 p-5">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <UserRound className="h-8 w-8 text-amber-300" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">Corretor</p>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-xs text-white/70">{creci}</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3">
          <p className="inline-flex items-center gap-2 text-xs text-white/80">
            <Building2 className="h-4 w-4 text-amber-300" />
            Atendimento humano para compra, venda e locacao.
          </p>
        </div>
      </div>

      <div>
        <p className="mb-4 text-sm text-slate-600">
          Preencha os campos abaixo com seus dados e retornaremos o mais rapido possivel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-semibold text-slate-700">
              Seu nome
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(event) => setFormData({ ...formData, nome: event.target.value })}
              required
              className="border-slate-200 bg-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@gmail.com"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
              className="border-slate-200 bg-white"
            />
          </div>

          <div>
            <label htmlFor="telefone" className="mb-1 block text-sm font-semibold text-slate-700">
              Telefone
            </label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(51) 99999-9999"
              value={formData.telefone}
              onChange={(event) => setFormData({ ...formData, telefone: event.target.value })}
              required
              className="border-slate-200 bg-white"
            />
          </div>

          <Textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={(event) => setFormData({ ...formData, mensagem: event.target.value })}
            rows={4}
            className="border-slate-200 bg-white"
          />

          <Button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            Enviar solicitacao
          </Button>
        </form>
      </div>

      <Button asChild className="w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Phone className="mr-2 h-4 w-4" />
          Chamar no WhatsApp
        </a>
      </Button>

      <Button
        variant="outline"
        className="w-full rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copiado para compartilhamento.");
        }}
      >
        <Link2 className="mr-2 h-4 w-4" />
        Copiar link
      </Button>
    </div>
  );
}
