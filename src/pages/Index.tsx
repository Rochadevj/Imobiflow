import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros avançados
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");

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

  const filteredProperties = properties.filter((property) => {
    // Filtro de busca por texto
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtros avançados
    const matchesType = !propertyType || property.property_type === propertyType;
    const matchesMinPrice = !minPrice || property.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || property.price <= Number(maxPrice);
    const matchesMinArea = !minArea || (property.area && property.area >= Number(minArea));
    const matchesMaxArea = !maxArea || (property.area && property.area <= Number(maxArea));
    const matchesNeighborhood = !neighborhood || property.location.toLowerCase().includes(neighborhood.toLowerCase());
    const matchesBedrooms = !bedrooms || property.bedrooms === Number(bedrooms);
    const matchesBathrooms = !bathrooms || property.bathrooms === Number(bathrooms);
    const matchesParkingSpaces = !parkingSpaces || property.parking_spaces === Number(parkingSpaces);

    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice && 
           matchesMinArea && matchesMaxArea && matchesNeighborhood && matchesBedrooms && 
           matchesBathrooms && matchesParkingSpaces;
  });

  const [heroTab, setHeroTab] = useState<'comprar' | 'alugar'>('comprar');
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Hero Section novo layout (sem sobreposição problemática) */}
      <section className="relative bg-primary/95 text-white pt-16 pb-48 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-[420px] h-[420px] bg-accent/10 rounded-bl-[180px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-xl">
                Compre e alugue
                <br />
                <span className="text-accent">com quem entende</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-md mb-8">
                Experiência local e transparência para você encontrar ou anunciar seu imóvel em Canoas e região.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=800&auto=format&fit=crop"
                  alt="Edifício residencial"
                  className="w-full h-[340px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Barra de busca posicionada abaixo do hero com leve overlap controlado */}
      <div className="relative z-20 -mt-32 mb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white text-foreground rounded-xl shadow-xl border border-border overflow-hidden max-w-5xl mx-auto">
            <div className="flex justify-center gap-12 border-b border-border px-8 pt-6">
              <button
                type="button"
                onClick={() => setHeroTab('comprar')}
                className={`pb-4 text-sm font-medium relative ${heroTab==='comprar'?'text-accent':'text-muted-foreground hover:text-foreground'}`}
              >
                Comprar
                {heroTab==='comprar' && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-accent rounded-t" />}
              </button>
              <button
                type="button"
                onClick={() => setHeroTab('alugar')}
                className={`pb-4 text-sm font-medium relative ${heroTab==='alugar'?'text-accent':'text-muted-foreground hover:text-foreground'}`}
              >
                Alugar
                {heroTab==='alugar' && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-accent rounded-t" />}
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Pesquisar para ${heroTab === 'comprar' ? 'comprar' : 'alugar'}...`}
                    className="pl-10 h-12 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-accent text-primary hover:bg-accent/90 px-6 h-12" onClick={() => {/* opcional: trigger fetch/filter */}}>
                  Buscar
                </Button>
              </div>
     
            </div>
          </div>
        </div>
      </div>


      {/* Properties Section */}
      <section className="container mx-auto px-4 py-16 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros Laterais */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-card rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPropertyType("");
                    setMinPrice("");
                    setMaxPrice("");
                    setMinArea("");
                    setMaxArea("");
                    setNeighborhood("");
                    setBedrooms("");
                    setBathrooms("");
                    setParkingSpaces("");
                  }}
                  className="text-accent hover:text-accent/80"
                >
                  Limpar
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyType">Tipo de imóvel</Label>
                  <Select value={propertyType || "all"} onValueChange={(v) => setPropertyType(v === "all" ? "" : v)}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Terreno">Terreno</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Preço</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Área Total (m²)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    placeholder="Digite o bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Quartos</Label>
                  <Select value={bedrooms || "any"} onValueChange={(v) => setBedrooms(v === "any" ? "" : v)}>
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="any">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bathrooms">Banheiros</Label>
                  <Select value={bathrooms || "any"} onValueChange={(v) => setBathrooms(v === "any" ? "" : v)}>
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="any">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parkingSpaces">Vagas na garagem</Label>
                  <Select value={parkingSpaces || "any"} onValueChange={(v) => setParkingSpaces(v === "any" ? "" : v)}>
                    <SelectTrigger id="parkingSpaces">
                      <SelectValue placeholder="Qualquer" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="any">Qualquer</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Lista de Imóveis */}
          <div className="flex-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => {
                  const primaryImage = property.property_images.find((img) => img.is_primary);
                  const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;
                  return (
                    <Link key={property.id} to={`/property/${property.id}`} className="no-underline">
                      <PropertyCard
                        id={property.id}
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
