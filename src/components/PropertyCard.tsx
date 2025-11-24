import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Car, Ruler } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

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
}

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
}: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'apartamento': 'Apartamento',
      'casa': 'Casa',
      'casa_condominio': 'Casa em Condomínio',
      'cobertura': 'Cobertura',
      'sala_comercial': 'Sala Comercial',
      'sobrado': 'Sobrado',
      'sobrado_condominio': 'Sobrado em Condomínio',
      'terreno': 'Terreno',
    };
    return types[type] || capitalizeFirstLetter(type);
  };

  useEffect(() => {
    if (!id) return;
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
      setIsFavorited(favs.includes(id));
    } catch {
      setIsFavorited(false);
    }
  }, [id]);

  const toggleFavorite = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!id) return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
    const exists = favs.includes(id);
    const updated = exists ? favs.filter(f => f !== id) : [...favs, id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    setIsFavorited(!exists);
    window.dispatchEvent(new Event('favoritesChanged'));
  };
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Sem imagem</span>
          </div>
        )}
        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
          {getPropertyTypeLabel(propertyType)}
        </Badge>
        {transactionType && (
          <Badge className="absolute top-4 right-14 bg-slate-900 text-white z-10">
            {transactionType === 'venda' ? 'Venda' : 'Aluguel'}
          </Badge>
        )}
        {featured && (
          <Badge className="absolute bottom-4 left-4 bg-accent text-primary z-10">
            Destaque
          </Badge>
        )}
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          aria-label="Favoritar"
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur rounded-full p-2 hover:scale-110 hover:bg-white transition-all shadow-md"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location} | {city}</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          {(areaPrivativa || area) && (
            <div className="flex items-center">
              <Ruler className="h-4 w-4 mr-1" />
              <span>{(areaPrivativa || area)}m²</span>
            </div>
          )}
          {bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{bedrooms} quartos</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} banheiros</span>
            </div>
          )}
          {parkingSpaces && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{parkingSpaces} vagas</span>
            </div>
          )}
        </div>

        <div className="text-2xl font-bold text-accent">
          R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
