import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, Car, Heart, MapPin, Ruler } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

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
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
      setIsFavorited(favs.includes(id));
    } catch {
      setIsFavorited(false);
    }
  }, [id]);

  const toggleFavorite = (event?: MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!id) return;
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((item) => item !== id) : [...favs, id];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorited(!exists);
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  return (
    <Card className="group surface-card h-full overflow-hidden border-slate-200/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_40px_rgba(15,23,42,0.14)]">
      <div className="relative h-60 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
            Sem imagem
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/28 to-slate-950/12" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/46 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border border-white/35 bg-slate-950/90 px-3 py-1 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(2,6,23,0.5)] [text-shadow:0_1px_2px_rgba(0,0,0,0.65)] backdrop-blur-sm"
          >
            {getPropertyTypeLabel(propertyType)}
          </Badge>
          {transactionType && (
            <Badge
              variant="outline"
              className="border border-white/55 bg-white/88 px-3 py-1 font-semibold text-slate-900 shadow-[0_8px_16px_rgba(2,6,23,0.35)] backdrop-blur-sm"
            >
              {transactionType === "venda" ? "Venda" : "Aluguel"}
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
          className="absolute right-3 top-3 z-10 rounded-full border border-white/40 bg-white/90 p-2 text-slate-600 shadow-md transition-all hover:scale-105 hover:bg-white"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      <CardContent className="flex h-[210px] flex-col p-5">
        <h3 className="line-clamp-2 min-h-[52px] text-lg font-semibold text-slate-900">{title}</h3>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 text-amber-500" />
          <span className="line-clamp-1">
            {location} | {city}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
          {(areaPrivativa || area) && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              <Ruler className="h-3.5 w-3.5 text-amber-500" />
              {(areaPrivativa || area).toLocaleString("pt-BR")}m²
            </span>
          )}
          {bedrooms ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              <Bed className="h-3.5 w-3.5 text-amber-500" />
              {bedrooms} qtos
            </span>
          ) : null}
          {bathrooms ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              <Bath className="h-3.5 w-3.5 text-amber-500" />
              {bathrooms} banh
            </span>
          ) : null}
          {parkingSpaces ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              <Car className="h-3.5 w-3.5 text-amber-500" />
              {parkingSpaces} vagas
            </span>
          ) : null}
        </div>

        {!isLaunch && (
          <div className="mt-auto border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Valor</p>
            <p className="text-2xl font-bold text-slate-900">
              R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              {transactionType === "aluguel" ? (
                <span className="ml-2 text-xs font-semibold text-slate-500">/ mês</span>
              ) : null}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
