import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface Property {
  id: string;
  title: string;
  property_type: string;
  price: number;
  location: string;
  city: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  featured: boolean;
  property_images: { image_url: string; is_primary: boolean }[];
}

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          property_type,
          price,
          location,
          city,
          area,
          bedrooms,
          bathrooms,
          parking_spaces,
          featured,
          property_images(image_url, is_primary)
        `)
        .eq("status", "available")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] to-[hsl(var(--hero-gradient-end))] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre o imóvel perfeito para você
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Compre e alugue com quem entende do mercado imobiliário
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por localização, cidade ou tipo..."
                  className="pl-10 h-12 bg-white text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="h-12 bg-accent text-primary hover:bg-accent/90 px-8">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Imóveis Disponíveis</h2>
          <p className="text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando imóveis...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum imóvel disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const primaryImage = property.property_images.find((img) => img.is_primary);
              const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;

              return (
                <PropertyCard
                  key={property.id}
                  title={property.title}
                  propertyType={property.property_type}
                  location={property.location}
                  city={property.city}
                  price={property.price}
                  area={property.area}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  parkingSpaces={property.parking_spaces}
                  imageUrl={imageUrl}
                  featured={property.featured}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
