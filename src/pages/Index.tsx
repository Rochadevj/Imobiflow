import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Link, useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import HeroCarousel from "@/components/HeroCarousel";

interface Property {
  id: string;
  codigo?: string;
  title: string;
  property_type: string;
  transaction_type?: string;
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

const Index = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<HeroProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filtros avançados
  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState("");
  const [heroTab, setHeroTab] = useState<'comprar' | 'alugar' | 'todos'>('todos');

  // Ler parâmetros da URL quando a página carrega
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'comprar') {
      setHeroTab('comprar');
      setTransactionType('venda');
    } else if (type === 'alugar') {
      setHeroTab('alugar');
      setTransactionType('aluguel');
    } else {
      setHeroTab('todos');
      setTransactionType('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
    fetchFeaturedProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          codigo,
          title,
          property_type,
          transaction_type,
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

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          property_type,
          transaction_type,
          price,
          location,
          city,
          property_images!inner(image_url, is_primary)
        `)
        .eq("status", "available")
        .eq("featured", true)
        .not("property_images", "is", null)
        .limit(8)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to match HeroCarousel interface
      const transformedData: HeroProperty[] = data?.map(property => {
        const primaryImage = property.property_images.find(img => img.is_primary);
        return {
          id: property.id,
          title: property.title,
          location: property.location,
          city: property.city,
          price: property.price,
          property_type: property.property_type,
          transaction_type: property.transaction_type,
          image_url: primaryImage?.image_url || property.property_images[0]?.image_url || ''
        };
      }).filter(property => property.image_url) || [];
      
      // Se não houver imóveis em destaque, buscar imóveis normais com imagens
      if (transformedData.length === 0) {
        const { data: regularData, error: regularError } = await supabase
          .from("properties")
          .select(`
            id,
            title,
            property_type,
            transaction_type,
            price,
            location,
            city,
            property_images!inner(image_url, is_primary)
          `)
          .eq("status", "available")
          .not("property_images", "is", null)
          .limit(6)
          .order("created_at", { ascending: false });

        if (!regularError && regularData) {
          const regularTransformed: HeroProperty[] = regularData.map(property => {
            const primaryImage = property.property_images.find(img => img.is_primary);
            return {
              id: property.id,
              title: property.title,
              location: property.location,
              city: property.city,
              price: property.price,
              property_type: property.property_type,
              transaction_type: property.transaction_type,
              image_url: primaryImage?.image_url || property.property_images[0]?.image_url || ''
            };
          }).filter(property => property.image_url);
          
          setFeaturedProperties(regularTransformed);
        }
      } else {
        setFeaturedProperties(transformedData);
      }
    } catch (error) {
      console.error("Erro ao carregar imóveis em destaque:", error);
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
    const matchesTransactionType = !transactionType || property.transaction_type === transactionType;
    const matchesMinPrice = !minPrice || property.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || property.price <= Number(maxPrice);
    const matchesMinArea = !minArea || (property.area && property.area >= Number(minArea));
    const matchesMaxArea = !maxArea || (property.area && property.area <= Number(maxArea));
    const matchesNeighborhood = !neighborhood || property.location.toLowerCase().includes(neighborhood.toLowerCase());
    const matchesBedrooms = !bedrooms || (bedrooms === "4" ? property.bedrooms >= 4 : property.bedrooms === Number(bedrooms));
    const matchesBathrooms = !bathrooms || property.bathrooms === Number(bathrooms);
    const matchesParkingSpaces = !parkingSpaces || property.parking_spaces === Number(parkingSpaces);

    return matchesSearch && matchesType && matchesTransactionType && matchesMinPrice && matchesMaxPrice && 
           matchesMinArea && matchesMaxArea && matchesNeighborhood && matchesBedrooms && 
           matchesBathrooms && matchesParkingSpaces;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Hero Section novo layout (sem sobreposição problemática) */}
      <section className="relative bg-primary/95 text-white pt-16 pb-48 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-[280px] h-[280px] md:w-[420px] md:h-[420px] bg-accent/10 rounded-bl-[120px] md:rounded-bl-[180px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 md:mb-6 max-w-xl">
                Compre e alugue
                <br />
                <span className="text-accent">com quem entende</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-md mb-6 md:mb-8">
                Experiência local e transparência para você encontrar ou anunciar seu imóvel em Canoas e região.
              </p>
            </div>
            <div className="relative">
              <HeroCarousel properties={featuredProperties} />
            </div>
          </div>
        </div>
      </section>
      {/* Barra de busca posicionada abaixo do hero com leve overlap controlado */}
      <div className="relative z-20 -mt-24 md:-mt-32 mb-8 md:mb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white text-foreground rounded-xl shadow-xl border border-border overflow-hidden max-w-5xl mx-auto">
            <div className="flex justify-center gap-6 md:gap-12 border-b border-border px-4 md:px-8 pt-4 md:pt-6">
              <button
                type="button"
                onClick={() => {
                  setHeroTab('comprar');
                  setTransactionType('venda');
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab==='comprar'?'text-accent':'text-muted-foreground hover:text-foreground'}`}
              >
                Comprar
                {heroTab==='comprar' && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-accent rounded-t" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroTab('alugar');
                  setTransactionType('aluguel');
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab==='alugar'?'text-accent':'text-muted-foreground hover:text-foreground'}`}
              >
                Alugar
                {heroTab==='alugar' && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-accent rounded-t" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHeroTab('todos');
                  setTransactionType('');
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab==='todos'?'text-accent':'text-muted-foreground hover:text-foreground'}`}
              >
                Ver Todos
                {heroTab==='todos' && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-accent rounded-t" />}
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
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
                <div className="flex gap-2">
                  {/* Botão de Filtros no Mobile */}
                  <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="md:hidden h-12 px-4 border-accent text-accent hover:bg-accent hover:text-primary"
                      >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        Filtros
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[85vh]">
                      <DrawerHeader className="text-left">
                        <DrawerTitle className="flex items-center justify-between">
                          <span>Filtros Avançados</span>
                          <DrawerClose asChild>
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
                              className="text-accent hover:text-accent/80 text-xs"
                            >
                              Limpar
                            </Button>
                          </DrawerClose>
                        </DrawerTitle>
                      </DrawerHeader>
                      <div className="px-4 pb-4 overflow-y-auto">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="mobile-propertyType">Tipo de imóvel</Label>
                            <Select value={propertyType || "all"} onValueChange={(v) => setPropertyType(v === "all" ? "" : v)}>
                              <SelectTrigger id="mobile-propertyType">
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
                            <Label htmlFor="mobile-neighborhood">Bairro</Label>
                            <Input
                              id="mobile-neighborhood"
                              placeholder="Digite o bairro"
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label htmlFor="mobile-bedrooms">Quartos</Label>
                            <Select value={bedrooms || "any"} onValueChange={(v) => setBedrooms(v === "any" ? "" : v)}>
                              <SelectTrigger id="mobile-bedrooms">
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover z-50">
                                <SelectItem value="any">Qualquer</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="mobile-bathrooms">Banheiros</Label>
                            <Select value={bathrooms || "any"} onValueChange={(v) => setBathrooms(v === "any" ? "" : v)}>
                              <SelectTrigger id="mobile-bathrooms">
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover z-50">
                                <SelectItem value="any">Qualquer</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="mobile-parkingSpaces">Vagas na garagem</Label>
                            <Select value={parkingSpaces || "any"} onValueChange={(v) => setParkingSpaces(v === "any" ? "" : v)}>
                              <SelectTrigger id="mobile-parkingSpaces">
                                <SelectValue placeholder="Qualquer" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover z-50">
                                <SelectItem value="any">Qualquer</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <DrawerClose asChild>
                            <Button className="w-full bg-accent text-primary hover:bg-accent/90 mt-4">
                              Aplicar Filtros
                            </Button>
                          </DrawerClose>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <Button className="bg-accent text-primary hover:bg-accent/90 px-6 h-12 w-full sm:w-auto" onClick={() => {/* opcional: trigger fetch/filter */}}>
                  Buscar
                </Button>
                </div>
              </div>
     
            </div>
          </div>
        </div>
      </div>


      {/* Properties Section */}
      <section className="container mx-auto px-4 py-8 md:py-16 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filtros Laterais - Desktop apenas */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-card rounded-lg shadow-md p-4 md:p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-foreground">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPropertyType("");
                    setTransactionType("");
                    setMinPrice("");
                    setMaxPrice("");
                    setMinArea("");
                    setMaxArea("");
                    setNeighborhood("");
                    setBedrooms("");
                    setBathrooms("");
                    setParkingSpaces("");
                  }}
                  className="text-accent hover:text-accent/80 text-xs md:text-sm"
                >
                  Limpar
                </Button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <Label htmlFor="propertyType">Tipo de imóvel</Label>
                  <Select value={propertyType || "all"} onValueChange={(v) => setPropertyType(v === "all" ? "" : v)}>
                    <SelectTrigger id="propertyType">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="casa_condominio">Casa em Condomínio</SelectItem>
                      <SelectItem value="cobertura">Cobertura</SelectItem>
                      <SelectItem value="sala_comercial">Sala Comercial</SelectItem>
                      <SelectItem value="sobrado">Sobrado</SelectItem>
                      <SelectItem value="sobrado_condominio">Sobrado em Condomínio</SelectItem>
                      <SelectItem value="terreno">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="transactionType">Categoria</Label>
                  <Select value={transactionType || "all"} onValueChange={(v) => {
                    const newValue = v === "all" ? "" : v;
                    setTransactionType(newValue);
                    // Sincronizar com heroTab
                    if (newValue === "venda") setHeroTab('comprar');
                    else if (newValue === "aluguel") setHeroTab('alugar');
                    else setHeroTab('todos');
                  }}>
                    <SelectTrigger id="transactionType">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="aluguel">Aluguel</SelectItem>
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
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
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
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
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
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </aside>

          {/* Lista de Imóveis - Agora aparece primeiro no mobile */}
          <div className="flex-1 min-w-0 order-first lg:order-none">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Imóveis Disponíveis</h2>
              <p className="text-muted-foreground text-sm md:text-base">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {filteredProperties.map((property) => {
                  const primaryImage = property.property_images.find((img) => img.is_primary);
                  const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;
                  return (
                    <Link key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
                      <PropertyCard
                        id={property.id}
                        title={property.title}
                        propertyType={property.property_type}
                        transactionType={property.transaction_type}
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
