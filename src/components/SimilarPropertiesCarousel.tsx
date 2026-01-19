import { ChevronLeft, ChevronRight, MapPin, Home, Bed, Car } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Property {
  id: string;
  codigo?: string;
  title: string;
  property_type: string;
  city: string;
  neighborhood: string;
  price: number;
  area: number;
  bedrooms: number;
  parking_spaces: number;
  images: string[];
}

interface SimilarPropertiesCarouselProps {
  properties: Property[];
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Você também pode se interessar
      </h2>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProperties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.codigo || property.id}`}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.images[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Type */}
                <div className="text-sm font-semibold text-primary">
                  {property.property_type}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{property.neighborhood} | {property.city}</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>{property.area}m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>{property.bedrooms} Quartos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>{property.parking_spaces} Vagas</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-lg font-bold text-gray-900 pt-2 border-t">
                  {formatPrice(property.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        )}
      </div>
    </div>
  );
}
