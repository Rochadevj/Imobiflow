import { Bath, Bed, Car, DollarSign, Hash, Home, Maximize } from "lucide-react";

interface PropertyMetaProps {
  areaTotal: number;
  areaPrivativa: number;
  quartos: number;
  suites?: number;
  banheiros: number;
  vagas: number;
  codigo: string;
  preco: number;
  transactionType?: string;
  showPrice?: boolean;
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
  transactionType,
  showPrice = true,
}: PropertyMetaProps) {
  const formatPrice = (value: number, withCents: boolean) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: withCents ? 2 : 0,
      maximumFractionDigits: withCents ? 2 : 0,
    }).format(value);

  const isRental = transactionType === "aluguel";
  const priceValue = isRental ? `${formatPrice(preco, true)} / mes` : formatPrice(preco, false);

  const metaItems = [
    { icon: Home, label: "Area total", value: `${areaTotal}m2` },
    { icon: Maximize, label: "Area privativa", value: `${areaPrivativa}m2` },
    { icon: Bed, label: "Quartos", value: quartos },
    ...(suites ? [{ icon: Bed, label: "Suites", value: suites }] : []),
    { icon: Bath, label: "Banheiros", value: banheiros },
    { icon: Car, label: "Vagas", value: vagas },
    { icon: Hash, label: "Codigo", value: codigo },
    ...(showPrice
      ? [{ icon: DollarSign, label: isRental ? "Valor aluguel" : "Preco", value: priceValue, highlight: true }]
      : []),
  ];

  return (
    <div className="surface-card border-slate-200/80 p-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metaItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${item.value}`}
              className={`rounded-xl border border-slate-200/70 bg-white px-3 py-3 ${
                item.highlight ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                <Icon className="h-3.5 w-3.5 text-amber-500" />
                {item.label}
              </p>
              <p className={`mt-2 text-lg font-semibold ${item.highlight ? "text-slate-900" : "text-slate-800"}`}>
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
