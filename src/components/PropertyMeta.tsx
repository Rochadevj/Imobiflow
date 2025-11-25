import { Home, Maximize, Bed, Bath, Car, Hash, DollarSign } from "lucide-react";

interface PropertyMetaProps {
  areaTotal: number;
  areaPrivativa: number;
  quartos: number;
  suites?: number;
  banheiros: number;
  vagas: number;
  codigo: string;
  preco: number;
}

export default function PropertyMeta({
  areaTotal,
  areaPrivativa,
  quartos,
  suites,
  banheiros,
  vagas,
  codigo,
  preco,
}: PropertyMetaProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metaItems = [
    { icon: Home, label: "Área Total", value: `${areaTotal}m²` },
    { icon: Maximize, label: "Área Privativa", value: `${areaPrivativa}m²` },
    { icon: Bed, label: "Quartos", value: quartos },
    ...(suites ? [{ icon: Bed, label: "Suítes", value: suites }] : []),
    { icon: Bath, label: "Banheiros", value: banheiros },
    { icon: Car, label: "Vagas", value: vagas },
    { icon: Hash, label: "Código", value: codigo },
    { icon: DollarSign, label: "Preço", value: formatPrice(preco), highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
      {metaItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`flex flex-col gap-2 hover:scale-110 transition-transform duration-200 ${item.highlight ? "col-span-2 md:col-span-1" : ""}`}
          >
            <div className="flex items-center gap-2 text-gray-600">
              <Icon className="w-5 h-5 text-[#083c51]" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className={`text-lg font-semibold ${item.highlight ? "text-[#083c51]" : "text-gray-900"}`}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
