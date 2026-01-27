import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Phone } from "lucide-react";

interface RealtorCardProps {
  name: string;
  creci: string;
  photo: string;
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
  photo,
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
      casa_condominio: "Casa em Condomínio",
      cobertura: "Cobertura",
      sala_comercial: "Sala Comercial",
      sobrado: "Sobrado",
      sobrado_condominio: "Sobrado em Condomínio",
      terreno: "Terreno",
      comercial: "Comercial",
      galpao: "Galpão",
      chacara: "Chácara",
      sitio: "Sítio",
      lancamento: "Lançamento",
    };
    return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTransactionLabel = (type?: string) => {
    if (type === "aluguel") return "para Alugar";
    if (type === "venda") return "para Comprar";
    if (type === "lancamento") return "sobre o lançamento";
    return "para Comprar";
  };

  const areaSuffix = area && !propertyTitle.includes("m²") ? ` com ${area}m²` : "";
  const locationText = location ? ` no bairro ${location}` : "";
  const cityText = city ? ` em ${city}` : "";
  const propertyName = propertyTitle || getPropertyTypeLabel(propertyType);
  const messageTemplate = `Gostaria de mais informações sobre o código ${propertyCode} - ${propertyName}${areaSuffix}${locationText}${cityText} ${getTransactionLabel(transactionType)}. Obrigado.`;

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: messageTemplate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Aqui você pode integrar com Supabase
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${name}, tenho interesse no imóvel: ${propertyTitle}`
  );
  const whatsappLink = `https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, "")}&text=${whatsappMessage}`;

  return (
    <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Realtor Info */}
      <div className="flex items-center gap-4">
        <img
          src={photo}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-4 border-primary"
        />
        <div>
          <p className="text-sm text-gray-600">Corretor</p>
          <h3 className="text-lg font-bold text-primary">{name}</h3>
          <p className="text-sm text-gray-600">{creci}</p>
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <p className="text-sm text-gray-700 mb-4">
          Preencha os campos abaixo com seus dados e entraremos em contato o mais breve possível.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="text-sm font-medium text-gray-700 block mb-1">
              Seu nome
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="telefone" className="text-sm font-medium text-gray-700 block mb-1">
              Telefone
            </label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(51) 99999-9999"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              required
            />
          </div>

          <div>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 hover:shadow-lg">
            Enviar
          </Button>
        </form>
      </div>

      {/* WhatsApp Button */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">ou</p>
        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 gap-2 hover:scale-105 transition-all duration-300 hover:shadow-lg"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Phone className="w-4 h-4" />
            Chamar no WhatsApp
          </a>
        </Button>
      </div>

      {/* Share Button */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copiado!");
        }}
      >
        🔗 Compartilhar
      </Button>
    </div>
  );
}
