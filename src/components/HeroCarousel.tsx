import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import TenantLink from "@/components/TenantLink";
import { getOptimizedImageUrl } from "@/lib/imageOptimization";

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
    galpao: "Galpão",
    chacara: "Chácara",
    sitio: "Sítio",
  };
  return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function HeroCarousel({ properties }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isMobile = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);

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
      <div className="relative overflow-hidden rounded-[32px] border border-white/20 shadow-[0_20px_40px_rgba(15,23,42,0.3)]">
        <img
          src="https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1200&auto=format&fit=crop"
          alt="Imóvel em destaque"
          className="h-[340px] w-full object-cover md:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/36 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Catálogo imobiliário</p>
          <h3 className="mt-2 text-2xl font-semibold">Encontre seu imóvel ideal</h3>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];
  const optimizedHeroImageUrl = getOptimizedImageUrl(currentProperty.image_url, { width: isMobile ? 800 : 1400, quality: isMobile ? 68 : 76 });

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-white/20 shadow-[0_24px_44px_rgba(15,23,42,0.35)]">
      <img
        src={optimizedHeroImageUrl}
        alt={currentProperty.title}
        className="hero-carousel-image h-[340px] w-full object-cover object-center md:h-[430px]"
        width={isMobile ? 800 : 1400}
        height={isMobile ? 340 : 430}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        sizes="(max-width: 768px) 100vw, 58vw"
      />

      <div className="carousel-overlay absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent" />

      {properties.length > 1 ? (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-5 md:top-5">
          <button
            onClick={goToPrevious}
            className="rounded-full border border-white/30 bg-slate-950/34 p-2 text-white shadow-[0_10px_20px_rgba(2,6,23,0.18)] backdrop-blur-sm transition hover:bg-slate-950/52 md:p-2.5"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={goToNext}
            className="rounded-full border border-white/30 bg-slate-950/34 p-2 text-white shadow-[0_10px_20px_rgba(2,6,23,0.18)] backdrop-blur-sm transition hover:bg-slate-950/52 md:p-2.5"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="absolute left-4 top-4 right-24 z-10 flex flex-wrap items-center gap-2 md:hidden">
        <span className="glass-chip">{getPropertyTypeLabel(currentProperty.property_type)}</span>
        <span className="rounded-full border border-amber-300/60 bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
          {currentProperty.transaction_type === "venda" ? "Venda" : "Locação"}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <div className="md:hidden">
          <div className="rounded-[28px] bg-gradient-to-t from-slate-950/92 via-slate-950/76 to-slate-950/10 px-4 pb-4 pt-16 shadow-[0_18px_32px_rgba(2,6,23,0.22)]">
            <TenantLink
              to={`/property/${currentProperty.id}`}
              forceTenant
              className="block"
            >
              <h3 className="line-clamp-2 text-[1.45rem] font-semibold leading-[1.15] text-white">
                {currentProperty.title}
              </h3>
              <p className="mt-2 inline-flex items-start gap-1.5 text-sm leading-5 text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span className="line-clamp-2">
                  {currentProperty.location}, {currentProperty.city}
                </span>
              </p>
              <p className="mt-3 text-[1.95rem] font-bold tracking-tight text-white">
                {formatPrice(currentProperty.price)}
              </p>
            </TenantLink>

            <div className="mt-4 flex items-center justify-between gap-3">
              <TenantLink
                to={`/property/${currentProperty.id}`}
                forceTenant
                className="inline-flex self-start rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_20px_rgba(2,6,23,0.14)] backdrop-blur-sm transition hover:bg-white/14"
              >
                <span className="inline-flex items-center gap-2">
                  Ver imóvel
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </TenantLink>

              {properties.length > 1 ? (
                <div className="flex items-center gap-1 rounded-full border border-white/12 bg-slate-950/32 px-2.5 py-2 backdrop-blur-sm">
                  {properties.map((property, index) => (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Ir para imóvel ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-6 bg-amber-300" : "w-2 bg-white/45 hover:bg-white/70"}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex flex-col gap-3">
            <TenantLink
              to={`/property/${currentProperty.id}`}
              forceTenant
              className="block w-full max-w-[60%] transition-transform hover:scale-[1.01]"
            >
              <div className="rounded-[24px] border border-white/12 bg-slate-950/24 px-4 py-4 shadow-[0_16px_30px_rgba(2,6,23,0.22)] backdrop-blur-sm">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="glass-chip">{getPropertyTypeLabel(currentProperty.property_type)}</span>
                  <span className="rounded-full border border-amber-300/60 bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
                    {currentProperty.transaction_type === "venda" ? "Venda" : "Locação"}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-white md:text-[1.35rem]">{currentProperty.title}</h3>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-white/82">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  {currentProperty.location}, {currentProperty.city}
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-white">{formatPrice(currentProperty.price)}</p>
              </div>
            </TenantLink>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <TenantLink
                to={`/property/${currentProperty.id}`}
                forceTenant
                className="inline-flex self-start rounded-full border border-white/18 bg-slate-950/28 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_20px_rgba(2,6,23,0.18)] backdrop-blur-sm transition hover:bg-slate-950/42"
              >
                <span className="inline-flex items-center gap-2">
                  Ver imóvel
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </TenantLink>

              {properties.length > 1 ? (
                <div className="flex items-center gap-1 rounded-full border border-white/15 bg-slate-950/28 px-2.5 py-2 backdrop-blur-sm">
                  {properties.map((property, index) => (
                    <button
                      key={property.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Ir para imóvel ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-6 bg-amber-300" : "w-2 bg-white/45 hover:bg-white/70"}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
