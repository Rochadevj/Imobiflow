import { ChevronLeft, ChevronRight, MapPin, Home, Bed, Car } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SimilarProperty {
  id: string;
  codigo?: string;
  title: string;
  property_type: string;
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

export default function SimilarPropertiesCarousel({ properties }: SimilarPropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, properties.length - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="py-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Você também pode se interessar</h2>

      <div className="relative">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {visibleProperties.map((property) => {
            const primaryImage = property.property_images?.find((img) => img.is_primary)?.image_url;
            const fallbackImage = property.property_images?.[0]?.image_url;
            const imageUrl = property.images?.[0] || primaryImage || fallbackImage || "/placeholder.jpg";
            const region = property.neighborhood || property.location || "Região";

            return (
              <Link
                key={property.id}
                to={`/property/${property.codigo || property.id}`}
                className="group overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-4">
                  <div className="text-sm font-semibold text-primary">{property.property_type}</div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {region} | {property.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>{property.area ? `${property.area}m²` : "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms ? `${property.bedrooms} Quartos` : "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>{property.parking_spaces ? `${property.parking_spaces} Vagas` : "-"}</span>
                    </div>
                  </div>

                  <div className="border-t pt-2 text-lg font-bold text-gray-900">{formatPrice(property.price)}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all hover:bg-gray-50"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
