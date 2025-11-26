import { useState, useEffect } from "react";
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

export default function HeroCarousel({ properties }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (!isAutoPlaying || properties.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === properties.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, properties.length, isAutoPlaying]);

  // Reset to first slide when properties change
  useEffect(() => {
    setCurrentIndex(0);
  }, [properties]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? properties.length - 1 : currentIndex - 1);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume auto-play after 8s
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === properties.length - 1 ? 0 : currentIndex + 1);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume auto-play after 8s
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartamento: "Apartamento",
      casa: "Casa",
      terreno: "Terreno",
      comercial: "Comercial",
      industrial: "Industrial",
      sala_comercial: "Sala Comercial",
      loja: "Loja",
      galpao: "Galpão",
      chacara: "Chácara",
      sitio: "Sítio"
    };
    // Se não encontrar no mapa, formata removendo underscore e capitalizando
    return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTransactionLabel = (type: string) => {
    return type === "venda" ? "Venda" : "Aluguel";
  };

  if (properties.length === 0) {
    // Fallback to default image if no properties
    return (
      <div className="relative">
        <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img
            src="https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=800&auto=format&fit=crop"
            alt="Edifício residencial"
            className="w-full h-[240px] sm:h-[300px] md:h-[340px] object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-semibold text-base md:text-lg mb-2">
                Encontre seu imóvel ideal
              </h3>
              <p className="text-white/90 text-sm">
                Navegue por nossa seleção de imóveis ou use os filtros para encontrar exatamente o que procura.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <div className="relative group">
      <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative">
        {/* Main Image */}
        <div className="relative">
          <img
            src={currentProperty.image_url || "https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=800&auto=format&fit=crop"}
            alt={currentProperty.title}
            className="w-full h-[240px] sm:h-[300px] md:h-[340px] object-cover hero-carousel-image"
            loading="eager"
          />
          
          {/* Overlay with property info */}
          <div className="absolute bottom-0 left-0 right-0 carousel-overlay p-4">
            <Link 
              to={`/property/${currentProperty.id}`}
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              {/* Property Type and Transaction */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                  {getPropertyTypeLabel(currentProperty.property_type)}
                </span>
                <span className="bg-accent/90 text-white text-xs px-2 py-1 rounded-full">
                  {getTransactionLabel(currentProperty.transaction_type)}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-1">
                {currentProperty.title}
              </h3>
              
              {/* Location */}
              <div className="flex items-center text-white/90 text-xs md:text-sm mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{currentProperty.location}, {currentProperty.city}</span>
              </div>
              
              {/* Price */}
              <div className="text-white font-bold text-sm md:text-lg">
                {formatPrice(currentProperty.price)}
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {properties.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Imóvel anterior"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Próximo imóvel"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Indicators */}
        {properties.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAutoPlaying(true), 8000);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? "bg-white scale-110" 
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Ver imóvel ${index + 1}`}
              />
            ))}
          </div>
        )}


      </div>

      {/* Property counter */}
      {properties.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} de {properties.length}
        </div>
      )}
    </div>
  );
}