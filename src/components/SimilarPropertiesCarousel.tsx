import { ChevronLeft, ChevronRight, MapPin, Bed, Car } from "lucide-react";
import { useMemo, useRef } from "react";
import TenantLink from "@/components/TenantLink";

interface SimilarProperty {
  id: string;
  codigo?: string;
  title: string;
  property_type: string;
  transaction_type?: string;
  city: string;
  neighborhood?: string;
  location?: string;
  price: number;
  area?: number;
  bedrooms?: number;
  parking_spaces?: number;
  images?: string[];
  property_images?: { image_url: string; is_primary?: boolean }[];
}

interface SimilarPropertiesCarouselProps {
  properties: SimilarProperty[];
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPropertyType = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatTransactionType = (value?: string) => {
  if (value === "aluguel") return "Aluguel";
  if (value === "venda") return "Venda";
  if (value === "lancamento") return "Lançamento";
  return "";
};

export default function SimilarPropertiesCarousel({ properties }: SimilarPropertiesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const carouselProperties = useMemo(() => [...properties].sort(() => Math.random() - 0.5), [properties]);

  const scrollCards = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-similar-card]");
    const scrollAmount = (firstCard?.offsetWidth || container.clientWidth * 0.9) + 24;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const renderCard = (property: SimilarProperty) => {
    const primaryImage = property.property_images?.find((img) => img.is_primary)?.image_url;
    const fallbackImage = property.property_images?.[0]?.image_url;
    const imageUrl = property.images?.[0] || primaryImage || fallbackImage || "/placeholder.svg";
    const region = property.neighborhood || property.location || "Região";
    const transactionLabel = formatTransactionType(property.transaction_type);

    return (
      <TenantLink
        key={property.id}
        to={`/property/${property.codigo || property.id}`}
        forceTenant
        data-similar-card
        className="group w-[252px] shrink-0 snap-start overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_rgba(15,23,42,0.12)] sm:w-[272px] lg:w-[292px]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-slate-950/86 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
              {formatPropertyType(property.property_type)}
            </span>
            {transactionLabel ? (
              <span className="rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm">
                {transactionLabel}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/55 via-slate-950/15 to-transparent" />
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 min-h-[3.25rem] text-base font-semibold text-slate-900">{property.title}</h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-amber-500" />
            <span className="line-clamp-1">
              {region} | {property.city}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
              <span>{property.area ? `${property.area}m²` : "Área n/d"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
              <Bed className="h-4 w-4 text-amber-500" />
              <span>{property.bedrooms ? `${property.bedrooms} quartos` : "Quartos n/d"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
              <Car className="h-4 w-4 text-amber-500" />
              <span>{property.parking_spaces ? `${property.parking_spaces} vagas` : "Vagas n/d"}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">{formatPrice(property.price)}</div>
        </div>
      </TenantLink>
    );
  };

  return (
    <section className="section-shell overflow-hidden p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Mais opções para navegar</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Você também pode gostar</h2>
        </div>

        {carouselProperties.length > 1 ? (
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollCards("left")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Ver imóveis anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCards("right")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Ver próximos imóveis"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {carouselProperties.map((property) => renderCard(property))}
      </div>

      {carouselProperties.length > 1 ? (
        <p className="mt-4 text-sm text-slate-500">Deslize para o lado para ver mais imóveis.</p>
      ) : null}
    </section>
  );
}
