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
import { trackPropertyView } from "@/lib/propertyViews";

interface Property {
  id: string;
  codigo?: string;
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
  iptu?: number;
  condominio?: number;
  is_launch?: boolean;
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
        // Tentar buscar por código primeiro, depois por ID (para compatibilidade)
        let query = supabase
          .from("properties")
          .select(`
            id,
            codigo,
            title,
            description,
            property_type,
            transaction_type,
            price,
            location,
            city,
            state,
            zipcode,
            area,
            area_privativa,
            bedrooms,
            bathrooms,
            parking_spaces,
            iptu,
            condominio,
            is_launch,
            featured,
            features,
            property_images(image_url, is_primary)
          `);
        
        // Se o ID parece um código (formato IMV-XXXX), buscar por codigo
        if (id?.startsWith('IMV-')) {
          query = query.eq("codigo", id);
        } else {
          query = query.eq("id", id);
        }
        
        const { data, error } = await query.maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProperty(data as unknown as Property);
          
          // Registrar visualização do imóvel (apenas 1 por IP a cada 24h)
          trackPropertyView(data.id).catch(err => 
            console.error('Erro ao rastrear visualização:', err)
          );
          
          // Buscar imóveis similares
          const { data: similar } = await supabase
            .from("properties")
            .select("*")
            .eq("property_type", data.property_type)
            .eq("city", data.city)
            .neq("id", data.id)
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

  // Construir endereço completo para o mapa
  const fullAddress = [
    property.location,
    property.city,
    property.state || 'RS',
    'Brasil'
  ].filter(Boolean).join(', ');

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
          <GalleryCarousel 
            images={imageUrls} 
            location={property.location}
            city={property.city}
            state={property.state}
            zipcode={property.zipcode}
          />

          {/* Tipo e Favorito */}
          <div className="flex items-center justify-between">
            <Badge className="bg-primary hover:bg-primary/90 text-white px-4 py-1">
          {property.property_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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

          {/* Preço em destaque */}
          {!property.is_launch && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {property.transaction_type === "aluguel" ? "Valor aluguel" : "Preço"}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: property.transaction_type === "aluguel" ? 2 : 0,
                      maximumFractionDigits: property.transaction_type === "aluguel" ? 2 : 0,
                    }).format(property.price)}
                    {property.transaction_type === "aluguel" && (
                      <span className="text-base font-semibold text-gray-600"> / mês</span>
                    )}
                  </p>
                </div>
                {(property.condominio || property.iptu) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {property.condominio && (
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-gray-500">Condomínio</p>
                        <p className="font-semibold text-gray-900">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(property.condominio)}
                        </p>
                      </div>
                    )}
                    {property.iptu && (
                      <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-gray-500">IPTU</p>
                        <p className="font-semibold text-gray-900">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(property.iptu)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadados */}
          <PropertyMeta
            areaTotal={property.area}
            areaPrivativa={property.area_privativa || property.area}
            quartos={property.bedrooms}
            suites={property.suites}
            banheiros={property.bathrooms}
            vagas={property.parking_spaces}
            codigo={property.codigo || property.id.slice(0, 8)}
            preco={property.price}
            transactionType={property.transaction_type}
            showPrice={!property.is_launch}
          />

          {/* Sobre o Imóvel */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {property.is_launch ? "Descrição do empreendimento" : "Sobre o imóvel"}
            </h2>
            <p className={`text-gray-700 whitespace-pre-line leading-relaxed ${property.is_launch ? "text-base md:text-lg" : ""}`}>
          {property.description || "Descrição não disponível."}
            </p>

            {/* IPTU e Condomínio */}
            
          </div>

          {/* Diferenciais */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {property.is_launch ? "Sobre o empreendimento" : "Diferenciais deste imóvel"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <Badge
            key={index}
            variant="outline"
            className="px-4 py-2 text-sm border-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-105 cursor-default"
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
  name="Kaptei Solucoes Imobiliarias"
  creci={"CRECI\u00A0-\u00A078852-RS"}
  photo="https://image2url.com/r2/bucket3/images/1767721437678-6111c713-d5f6-49f9-9e56-66c3fc780c1f.png"
  phone="51993898811"
  propertyTitle={property.title}
  propertyCode={property.codigo || property.id.slice(0, 8)}
  propertyType={property.property_type}
  transactionType={property.transaction_type}
  area={property.area}
  location={property.location}
  city={property.city}
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
