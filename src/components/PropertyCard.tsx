import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Bath, Bed, Car, Heart, MapPin, Ruler } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useTenant } from "@/context/TenantContext";
import { readFavorites, writeFavorites } from "@/lib/favorites";
import { getOptimizedImageUrl } from "@/lib/imageOptimization";

interface PropertyCardProps {
  id?: string;
  title: string;
  propertyType: string;
  transactionType?: string;
  location: string;
  city: string;
  price: number;
  area?: number;
  areaPrivativa?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  imageUrl?: string;
  featured?: boolean;
  isLaunch?: boolean;
}

const getPropertyTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    apartamento: "Apartamento",
    casa: "Casa",
    casa_condominio: "Casa em condomínio",
    cobertura: "Cobertura",
    sala_comercial: "Sala comercial",
    sobrado: "Sobrado",
    sobrado_condominio: "Sobrado em condomínio",
    terreno: "Terreno",
  };
  return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const PropertyCard = ({
  id,
  title,
  propertyType,
  transactionType,
  location,
  city,
  price,
  area,
  areaPrivativa,
  bedrooms,
  bathrooms,
  parkingSpaces,
  imageUrl,
  featured,
  isLaunch,
}: PropertyCardProps) => {
  const { tenant } = useTenant();
  const [isFavorited, setIsFavorited] = useState(false);
  const formattedPrice = `R$ ${price.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  const isMobileCard = typeof window !== "undefined" && window.innerWidth < 768;
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl, { width: isMobileCard ? 480 : 720, quality: isMobileCard ? 65 : 72 });

  useEffect(() => {
    if (!id) return;
    setIsFavorited(readFavorites(tenant?.slug).includes(id));
  }, [id, tenant?.slug]);

  const toggleFavorite = (event?: MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!id) return;

    const favs = readFavorites(tenant?.slug);
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((item) => item !== id) : [...favs, id];
    writeFavorites(updated, tenant?.slug);
    setIsFavorited(!exists);
  };

  return (
    <Card className="group h-full overflow-hidden rounded-[26px] border border-slate-200/85 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_28px_54px_rgba(15,23,42,0.14)]">
      <div className="relative h-60 overflow-hidden">
        {imageUrl ? (
          <img
            src={optimizedImageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/12 to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border border-white/30 bg-slate-950/88 px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(2,6,23,0.4)] backdrop-blur-sm"
          >
            {getPropertyTypeLabel(propertyType)}
          </Badge>
          {transactionType && !isLaunch && (
            <Badge
              variant="outline"
              className="border border-white/55 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-[0_8px_16px_rgba(2,6,23,0.2)] backdrop-blur-sm"
            >
              {transactionType === "venda" ? "Venda" : "Locação"}
            </Badge>
          )}
        </div>

        {featured && (
          <Badge
            variant="outline"
            className="absolute bottom-3 left-3 border border-emerald-200/80 bg-emerald-500/95 px-3 py-1 text-white shadow-[0_8px_16px_rgba(5,46,22,0.45)] backdrop-blur-sm"
          >
            Destaque
          </Badge>
        )}

        <button
          onClick={toggleFavorite}
          aria-label="Favoritar imóvel"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-white/92 p-2 text-slate-600 shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition-all hover:scale-105 hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <CardContent className="flex min-h-[220px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-950">
              {isLaunch ? "Consultar valores" : formattedPrice}
              {!isLaunch && transactionType === "aluguel" ? (
                <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">/ mês</span>
              ) : null}
            </p>
            <h3 className="mt-2 line-clamp-2 min-h-[52px] text-lg font-semibold leading-7 text-slate-950">{title}</h3>
          </div>
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition group-hover:border-accent/30 group-hover:bg-accent group-hover:text-slate-950">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-amber-500" />
          <span className="line-clamp-1">
            {location} | {city}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-slate-600 sm:grid-cols-4">
          {(areaPrivativa || area) && (
            <span className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Ruler className="h-3.5 w-3.5 text-amber-500" />
              {(areaPrivativa || area).toLocaleString("pt-BR")}m²
            </span>
          )}
          {bedrooms ? (
            <span className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Bed className="h-3.5 w-3.5 text-amber-500" />
              {bedrooms} qtos
            </span>
          ) : null}
          {bathrooms ? (
            <span className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Bath className="h-3.5 w-3.5 text-amber-500" />
              {bathrooms} banh
            </span>
          ) : null}
          {parkingSpaces ? (
            <span className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Car className="h-3.5 w-3.5 text-amber-500" />
              {parkingSpaces} vagas
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Detalhes do imóvel</p>
              <p className="mt-1 text-sm font-medium text-slate-800">Abrir fotos, mapa e informações</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:bg-accent group-hover:text-slate-950">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
