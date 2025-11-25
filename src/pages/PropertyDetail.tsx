import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GalleryCarousel from "@/components/GalleryCarousel";
import PropertyMeta from "@/components/PropertyMeta";
import RealtorCard from "@/components/RealtorCard";
import SimilarPropertiesCarousel from "@/components/SimilarPropertiesCarousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  area_privativa?: number;
  bedrooms: number;
  bathrooms: number;
  suites?: number;
  parking_spaces: number;
  property_type: string;
  transaction_type: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  zipcode: string;
  images: string[];
  features: string[];
  codigo?: string;
  iptu?: number;
  condominio?: number;
  location?: string;
  property_images?: { image_url: string; is_primary?: boolean }[];
}

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Scroll para o topo quando a página carrega
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(`
            id,
            title,
            description,
            property_type,
            price,
            location,
            city,
            area,
            area_privativa,
            bedrooms,
            bathrooms,
            parking_spaces,
            featured,
            features,
            property_images(image_url, is_primary)
          `)
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProperty(data as unknown as Property);
          
          // Buscar imóveis similares
          const { data: similar } = await supabase
            .from("properties")
            .select("*")
            .eq("property_type", data.property_type)
            .eq("city", data.city)
            .neq("id", id)
            .limit(6);
          
          if (similar) {
            setSimilarProperties(similar as unknown as Property[]);
          }
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error("Erro ao carregar imóvel:", err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // initialize favorite state from localStorage
  useEffect(() => {
    const update = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
        setIsFavorited(id ? favs.includes(id) : false);
      } catch {
        setIsFavorited(false);
      }
    };
    update();
    window.addEventListener('favoritesChanged', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('favoritesChanged', update);
      window.removeEventListener('storage', update);
    };
  }, [id]);

  const toggleFavorite = () => {
    // persist favorite in localStorage per user
    const key = 'favorites';
    const favs = JSON.parse(localStorage.getItem(key) || '[]') as string[];
    const exists = id ? favs.includes(id) : false;
    const updated = exists ? favs.filter(f => f !== id) : [...favs, id as string];
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorited(!exists);
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">Imóvel não encontrado.</div>
        <Footer />
      </div>
    );
  }

  // Processar imagens
    const propertyImages = property.property_images || [];
    const imageUrls = propertyImages.length > 0
      ? propertyImages.map((img) => img.image_url)
      : ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Container Principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galeria de Imagens */}
          <GalleryCarousel images={imageUrls} />

          {/* Tipo e Favorito */}
          <div className="flex items-center justify-between">
            <Badge className="bg-[#083c51] hover:bg-[#0a4a64] text-white px-4 py-1">
          {property.property_type}
            </Badge>
            <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className="rounded-full"
            >
          <Heart
            className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
            </Button>
          </div>

          {/* Título e Endereço */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {property.title}
            </h1>
            <p className="text-gray-600">
          {property.location || "Endereço não disponível"}, {property.city}
            </p>
          </div>

          {/* Metadados */}
          <PropertyMeta
            areaTotal={property.area}
            areaPrivativa={property.area_privativa || property.area}
            quartos={property.bedrooms}
            suites={property.suites}
            banheiros={property.bathrooms}
            vagas={property.parking_spaces}
            codigo={property.codigo || property.id}
            preco={property.price}
          />

          {/* Sobre o Imóvel */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Sobre o imóvel</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {property.description || "Descrição não disponível."}
            </p>

            {/* IPTU e Condomínio */}
            {(property.iptu || property.condominio) && (
          <div className="flex gap-4 pt-4">
            {property.iptu && (
              <div className="text-sm text-gray-600">
            <span className="font-semibold">IPTU:</span> R$ {property.iptu.toFixed(2)}
              </div>
            )}
            {property.condominio && (
              <div className="text-sm text-gray-600">
            <span className="font-semibold">Condomínio:</span> R$ {property.condominio.toFixed(2)}
              </div>
            )}
          </div>
            )}
          </div>

          {/* Diferenciais */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Diferenciais deste imóvel
          </h2>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <Badge
            key={index}
            variant="outline"
            className="px-4 py-2 text-sm border-gray-300 hover:bg-[#083c51] hover:text-white hover:border-[#083c51] transition-all duration-200 hover:scale-105 cursor-default"
              >
            {feature}
              </Badge>
            ))}
          </div>
            </div>
          )}

          {/* Plantas (Accordion) */}
          <Accordion type="single" collapsible className="border rounded-lg">
            <AccordionItem value="plantas" className="border-none">
          <AccordionTrigger className="px-6 hover:no-underline">
            <span className="text-lg font-semibold">Plantas</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <p className="text-gray-600">
              As plantas do imóvel estarão disponíveis em breve.
            </p>
          </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Imóveis Relacionados */}
          {similarProperties.length > 0 && (
            <SimilarPropertiesCarousel properties={similarProperties} />
          )}
        </div>

        {/* Coluna Sidebar - 1/3 */}
        <div className="lg:col-span-1">
          <RealtorCard
            name="Alexandre Andrade"
            creci={"CRECI\u00A0-\u00A078852-RS"}
            photo="/static/ad09874e-9610-42cd-bab5-046ffa0d7b7a.png"
            phone="51993898811"
            propertyTitle={property.title}
          />
        </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
