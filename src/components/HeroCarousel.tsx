import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProperty {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  property_type: string;
  transaction_type: string;
  image_url: string;
}

interface HeroCarouselProps {
  properties: HeroProperty[];
}

const getPropertyTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    apartamento: "Apartamento",
    casa: "Casa",
    terreno: "Terreno",
    comercial: "Comercial",
    industrial: "Industrial",
    sala_comercial: "Sala comercial",
    loja: "Loja",
    galpao: "Galpao",
    chacara: "Chacara",
    sitio: "Sitio",
  };
  return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function HeroCarousel({ properties }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || properties.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((previous) => (previous === properties.length - 1 ? 0 : previous + 1));
    }, 5500);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, properties.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [properties]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((previous) => (previous === 0 ? properties.length - 1 : previous - 1));
    window.setTimeout(() => setIsAutoPlaying(true), 7000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((previous) => (previous === properties.length - 1 ? 0 : previous + 1));
    window.setTimeout(() => setIsAutoPlaying(true), 7000);
  };

  if (properties.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_20px_40px_rgba(15,23,42,0.3)]">
        <img
          src="https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1200&auto=format&fit=crop"
          alt="Imovel em destaque"
          className="h-[320px] w-full object-cover md:h-[360px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/45 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Demo imobiliaria</p>
          <h3 className="mt-2 text-2xl font-semibold">Encontre seu imovel ideal</h3>
          <p className="mt-1 text-sm text-white/80">
            Use os filtros para visualizar opcoes de compra, locacao e lancamentos.
          </p>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/20 shadow-[0_24px_44px_rgba(15,23,42,0.35)]">
      <img
        src={currentProperty.image_url}
        alt={currentProperty.title}
        className="hero-carousel-image h-[320px] w-full object-cover md:h-[360px]"
        loading="eager"
      />

      <div className="carousel-overlay absolute inset-0" />

      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Link to={`/property/${currentProperty.id}`} className="block transition-transform hover:scale-[1.01]">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="glass-chip">{getPropertyTypeLabel(currentProperty.property_type)}</span>
            <span className="rounded-full border border-amber-300/60 bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
              {currentProperty.transaction_type === "venda" ? "Venda" : "Aluguel"}
            </span>
          </div>
          <h3 className="line-clamp-1 text-lg font-semibold text-white">{currentProperty.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/85">
            <MapPin className="h-4 w-4 text-amber-300" />
            {currentProperty.location}, {currentProperty.city}
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{formatPrice(currentProperty.price)}</p>
        </Link>
      </div>

      {properties.length > 1 ? (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-slate-950/35 p-2 text-white opacity-0 transition hover:bg-slate-950/50 group-hover:opacity-100"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-slate-950/35 p-2 text-white opacity-0 transition hover:bg-slate-950/50 group-hover:opacity-100"
            aria-label="Proxima imagem"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-4 right-5 rounded-full border border-white/20 bg-slate-950/40 px-2.5 py-1 text-xs text-white/90">
            {currentIndex + 1}/{properties.length}
          </div>
        </>
      ) : null}
    </div>
  );
}
