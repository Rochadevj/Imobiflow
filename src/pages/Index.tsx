import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import TenantLink from "@/components/TenantLink";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BadgeCheck, MapPin, Search, ShieldCheck, Sparkles, SlidersHorizontal, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import HeroCarousel from "@/components/HeroCarousel";
import { useTenant } from "@/context/TenantContext";
import { getTenantPhone } from "@/lib/tenantBrand";

interface Property {
  id: string;
  codigo: string;
  title: string;
  property_type: string;
  transaction_type: string;
  price: number;
  location: string;
  city: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  featured: boolean | null;
  featured_imperdiveis: boolean;
  featured_venda: boolean;
  featured_locacao: boolean;
  is_launch: boolean;
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

const isPropertyHighlighted = (property: Property) =>
  Boolean(
    property.featured ||
      property.featured_imperdiveis ||
      property.featured_venda ||
      property.featured_locacao
  );

const getPropertyImageUrl = (
  images: Array<{ image_url?: string | null; is_primary?: boolean | null }> | null | undefined,
) => {
  if (!Array.isArray(images) || images.length === 0) {
    return "";
  }

  return (
    images.find((image) => image?.is_primary && image?.image_url)?.image_url ||
    images.find((image) => image?.image_url)?.image_url ||
    ""
  );
};

const heroSignatureItems = [
  {
    label: "Imóveis bem apresentados",
    icon: Sparkles,
  },
  {
    label: "Contato mais rápido",
    icon: BadgeCheck,
  },
  {
    label: "Acompanhamento até fechar",
    icon: ShieldCheck,
  },
] as const;

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tenant, loading: tenantLoading, tenantPath } = useTenant();
  const tenantId = tenant?.id ?? null;
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<HeroProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showQuickHint, setShowQuickHint] = useState(true);
  const [featuredImperdiveis, setFeaturedImperdiveis] = useState<Property[]>([]);
  const [featuredVenda, setFeaturedVenda] = useState<Property[]>([]);
  const [featuredLocacao, setFeaturedLocacao] = useState<Property[]>([]);
  const [launches, setLaunches] = useState<Property[]>([]);
  
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
  const [heroTab, setHeroTab] = useState<'comprar' | 'alugar' | 'todos'>("todos");
  const tenantPhone = getTenantPhone(tenant);
  // Ler parâmetros da URL quando a página carrega
  useEffect(() => {
    const type = searchParams.get('type');
    const list = searchParams.get('list');
    setShowList(list === '1');
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
    if (tenantLoading) return;
    if (showList) {
      setShowQuickHint(true);
      setLoading(true);
      void fetchProperties();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showList, tenantLoading, tenantId]);

  useEffect(() => {
    if (tenantLoading) return;
    void fetchFeaturedProperties();
    void fetchSectionProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantLoading, tenantId]);

  const fetchProperties = async () => {
    try {
      if (!tenantId) {
        setProperties([]);
        return;
      }

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
          featured_imperdiveis,
          featured_venda,
          featured_locacao,
          is_launch,
          property_images(image_url, is_primary)
        `)
        .eq("tenant_id", tenantId)
        .eq("status", "available")
        .neq("is_launch", true)
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
      if (!tenantId) {
        setFeaturedProperties([]);
        return;
      }

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
        .eq("tenant_id", tenantId)
        .eq("status", "available")
        .or("featured.eq.true,featured_imperdiveis.eq.true,featured_venda.eq.true,featured_locacao.eq.true")
        .neq("is_launch", true)
        .not("property_images", "is", null)
        .limit(8)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to match HeroCarousel interface
      const transformedData: HeroProperty[] = (data || []).map(property => {
        return {
          id: property.id,
          title: property.title,
          location: property.location,
          city: property.city,
          price: property.price,
          property_type: property.property_type,
          transaction_type: property.transaction_type,
          image_url: getPropertyImageUrl(property.property_images),
        };
      }).filter(property => property.image_url);
      
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
          .eq("tenant_id", tenantId)
          .eq("status", "available")
          .neq("is_launch", true)
          .not("property_images", "is", null)
          .limit(6)
          .order("created_at", { ascending: false });

        if (!regularError && regularData) {
          const regularTransformed: HeroProperty[] = regularData.map(property => {
            return {
              id: property.id,
              title: property.title,
              location: property.location,
              city: property.city,
              price: property.price,
              property_type: property.property_type,
              transaction_type: property.transaction_type,
              image_url: getPropertyImageUrl(property.property_images),
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

  const fetchSectionProperties = async () => {
    try {
      setLoadingSections(true);
      if (!tenantId) {
        setFeaturedImperdiveis([]);
        setFeaturedVenda([]);
        setFeaturedLocacao([]);
        setLaunches([]);
        return;
      }
      const baseSelect = `
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
        featured_imperdiveis,
        featured_venda,
        featured_locacao,
        is_launch,
        property_images(image_url, is_primary)
      `;

      const [imperdiveisResult, vendaResult, locacaoResult, launchResult] = await Promise.all([
        supabase
          .from("properties")
          .select(baseSelect)
          .eq("tenant_id", tenantId)
          .eq("status", "available")
          .eq("featured_imperdiveis", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("properties")
          .select(baseSelect)
          .eq("tenant_id", tenantId)
          .eq("status", "available")
          .eq("featured_venda", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("properties")
          .select(baseSelect)
          .eq("tenant_id", tenantId)
          .eq("status", "available")
          .eq("featured_locacao", true)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("properties")
          .select(baseSelect)
          .eq("tenant_id", tenantId)
          .eq("status", "available")
          .eq("is_launch", true)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (imperdiveisResult.error) throw imperdiveisResult.error;
      if (vendaResult.error) throw vendaResult.error;
      if (locacaoResult.error) throw locacaoResult.error;
      if (launchResult.error) throw launchResult.error;

      setFeaturedImperdiveis(imperdiveisResult.data || []);
      setFeaturedVenda(vendaResult.data || []);
      setFeaturedLocacao(locacaoResult.data || []);
      setLaunches(launchResult.data || []);
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
    } finally {
      setLoadingSections(false);
    }
  };

  const filteredProperties = showList ? properties.filter((property) => {
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
  }) : [];

  if (tenantLoading) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="container mx-auto flex-1 px-4 py-16 text-center text-slate-600">
          Carregando catálogo...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />
      {/* Hero Section novo layout (sem sobreposição problemática) */}
      <section className={`relative mx-4 mt-8 overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(135deg,hsl(var(--hero-gradient-start))_0%,hsl(var(--hero-gradient-end))_62%,hsl(214_35%_20%)_100%)] pt-12 text-white shadow-[0_26px_60px_rgba(15,23,42,0.3)] md:mx-6 lg:mx-10 ${showList ? "pb-48 md:pb-52" : "pb-24 md:pb-28"}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 h-[280px] w-[280px] rounded-bl-[120px] bg-accent/12 md:h-[420px] md:w-[420px] md:rounded-bl-[180px]" />
          <div className="absolute left-0 bottom-0 h-[240px] w-[240px] rounded-tr-[140px] bg-white/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_40%)]" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:grid-cols-[0.88fr_1.12fr]">
            <div className="space-y-7">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                Plataforma imobiliária completa
              </span>

              <div>
                <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                  Seu próximo imóvel
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-300 bg-clip-text text-transparent">
                    começa aqui
                  </span>
                </h1>
                <p className="mt-4 max-w-lg text-base text-white/80 sm:text-lg">
                  Experiência, transparência e tecnologia para você encontrar ou anunciar seu imóvel com segurança.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <TenantLink forceTenant
                  to="/imobiliaria?list=1"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-[0_10px_24px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  <Search className="h-4 w-4" />
                  Ver imóveis
                </TenantLink>
                <TenantLink forceTenant
                  to="/anunciar"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(251,146,60,0.28)] transition hover:-translate-y-0.5 hover:bg-accent/90"
                >
                  Anunciar imóvel
                </TenantLink>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.07] shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-sm">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
                <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
                  <div className="max-w-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">Escolha com mais clareza</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight text-white">Uma vitrine pensada para encontrar, comparar e avançar com mais segurança.</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {heroSignatureItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/18 px-3.5 py-2 text-sm text-white/88"
                        >
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-amber-300">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-amber-300/20 via-transparent to-sky-300/20 blur-2xl" />
              <div className="relative rounded-[28px] border border-white/20 bg-white/5 p-2 md:p-3 backdrop-blur">
                <HeroCarousel properties={featuredProperties} />
              </div>
              {showList && showQuickHint && (
                <div className="animate-fade-up absolute -bottom-7 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/65 p-4 backdrop-blur md:left-auto md:right-6 md:w-[280px]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/65">Atalho rápido</p>
                    <button
                      type="button"
                      onClick={() => setShowQuickHint(false)}
                      aria-label="Fechar aviso"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/75 transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-white/90">
                    Use os filtros abaixo para ver opções por bairro, faixa de preço e tipo de imóvel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="relative z-20 -mt-16 mb-10 md:-mt-20 md:mb-14">
        <div className="container mx-auto px-4">
          <div className="section-shell mx-auto max-w-5xl overflow-hidden border-white/60 bg-white/90">
            <div className="flex justify-center gap-6 md:gap-12 border-b border-border px-4 md:px-8 pt-4 md:pt-6">
              <button
                type="button"
                onClick={() => {
                  navigate(tenantPath("/imobiliaria?list=1&type=comprar", true));
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab === "comprar" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                Comprar
                {heroTab === "comprar" && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t bg-accent" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(tenantPath("/imobiliaria?list=1&type=alugar", true));
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab === "alugar" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                Alugar
                {heroTab === "alugar" && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t bg-accent" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate(tenantPath("/imobiliaria?list=1", true));
                }}
                className={`pb-3 md:pb-4 text-sm font-medium relative ${heroTab === "todos" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                Ver Todos
                {heroTab === "todos" && <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-t bg-accent" />}
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      heroTab === "comprar"
                        ? "Pesquisar para comprar..."
                        : heroTab === "alugar"
                          ? "Pesquisar para alugar..."
                          : "Pesquisar imóvel..."
                    }
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
                              className="text-accent hover:text-white hover:bg-accent text-xs"
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
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[
                  { label: "Apartamento", value: "apartamento" },
                  { label: "Casa", value: "casa" },
                  { label: "Terreno", value: "terreno" },
                  { label: "Comercial", value: "comercial" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPropertyType(item.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      propertyType === item.value
                        ? "border-accent bg-accent text-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-accent/60"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType("");
                    setTransactionType("");
                    setHeroTab("todos");
                  }}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-accent/60"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destaques e novidades */}
      {!showList && (
      <>
      <section className="container mx-auto section-shell px-4 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Curadoria especial</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Imóveis imperdíveis</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href={`tel:${tenantPhone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-primary"
              >
                Falar com corretor
              </a>
              <TenantLink forceTenant
                to="/imobiliaria?list=1"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
              >
                Ver catálogo completo
              </TenantLink>
            </div>
          </div>
        </div>
        {loadingSections ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando imóveis...</p>
          </div>
        ) : featuredImperdiveis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Em breve, novidades em destaque.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredImperdiveis.map((property) => {
              const imageUrl = getPropertyImageUrl(property.property_images);
              return (
                <TenantLink forceTenant key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
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
                    featured={isPropertyHighlighted(property)}
                    isLaunch={property.is_launch}
                  />
                </TenantLink>
              );
            })}
          </div>
        )}
      </section>

      <section className="container mx-auto mt-6 section-shell px-4 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Compra orientada</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Destaques de venda</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <TenantLink forceTenant
                to="/anunciar"
                className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-primary"
              >
                Anunciar imóvel
              </TenantLink>
              <TenantLink forceTenant
                to="/imobiliaria?list=1&type=comprar"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
              >
                Ver opções de compra
              </TenantLink>
            </div>
          </div>
        </div>
        {loadingSections ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando imóveis...</p>
          </div>
        ) : featuredVenda.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum destaque de venda no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredVenda.map((property) => {
              const imageUrl = getPropertyImageUrl(property.property_images);
              return (
                <TenantLink forceTenant key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
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
                    featured={isPropertyHighlighted(property)}
                    isLaunch={property.is_launch}
                  />
                </TenantLink>
              );
            })}
          </div>
        )}
      </section>


      <section className="container mx-auto mt-6 section-shell px-4 py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Locação dinâmica</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Destaques de locação</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <TenantLink forceTenant
                to="/anunciar"
                className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-primary"
              >
                Anunciar imóvel
              </TenantLink>
              <TenantLink forceTenant
                to="/imobiliaria?list=1&type=alugar"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
              >
                Ver opções para alugar
              </TenantLink>
            </div>
          </div>
        </div>
        {loadingSections ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando imóveis...</p>
          </div>
        ) : featuredLocacao.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum destaque de locação no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {featuredLocacao.map((property) => {
              const imageUrl = getPropertyImageUrl(property.property_images);
              return (
                <TenantLink forceTenant key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
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
                    featured={isPropertyHighlighted(property)}
                    isLaunch={property.is_launch}
                  />
                </TenantLink>
              );
            })}
          </div>
        )}
      </section>
      </>
      )}

      {showList && (
      <section id="imoveis" className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Filtros Laterais - Desktop apenas */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="surface-card border-slate-200/80 p-4 md:p-6 lg:sticky lg:top-4">
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
                  className="text-accent hover:text-white hover:bg-accent text-xs md:text-sm"
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
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Imóveis Disponíveis</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {filteredProperties.length} {filteredProperties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${tenantPhone.replace(/\D/g, "")}`}
                  className="inline-flex items-center justify-center rounded-full border border-accent text-accent px-4 py-2 text-sm font-semibold hover:bg-accent hover:text-primary transition"
                >
                  Agendar visita
                </a>
                <TenantLink forceTenant
                  to="/anunciar"
                  onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                  className="inline-flex items-center justify-center rounded-full bg-primary text-white px-4 py-2 text-sm font-semibold shadow hover:bg-primary/90 transition"
                >
                  Quero vender
                </TenantLink>
              </div>
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
                  const imageUrl = getPropertyImageUrl(property.property_images);
                  return (
                    <TenantLink forceTenant key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
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
                        featured={isPropertyHighlighted(property)}
                        isLaunch={property.is_launch}
                      />
                    </TenantLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {!showList && (
        <section className="container mx-auto px-4 py-8 md:py-10">
          <div className="hero-surface p-6 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                LANÇAMENTOS<span className="text-accent">.</span>
              </h2>
              <TenantLink forceTenant
                to="/lancamentos"
                className="inline-flex items-center justify-center rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-primary"
              >
                Ver todos os lançamentos
              </TenantLink>
            </div>
            {loadingSections ? (
              <div className="text-center py-8 text-white/70">Carregando lançamentos...</div>
            ) : launches.length === 0 ? (
              <div className="text-center py-8 text-white/70">Nenhum lançamento disponível no momento.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {launches.map((property) => {
                  const imageUrl = getPropertyImageUrl(property.property_images);
                  return (
                    <TenantLink forceTenant key={property.id} to={`/property/${property.codigo || property.id}`} className="no-underline">
                      <div className="flex bg-black/70 rounded-2xl overflow-hidden border border-white/10 hover:border-accent/60 transition">
                        <div className="w-2/5 min-h-[140px]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-white/10 flex items-center justify-center text-white/60 text-sm">
                              Sem imagem
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-white/70 mb-2">
                              {property.location}, {property.city}
                            </p>
                            <h3 className="text-base md:text-lg font-semibold text-white line-clamp-2">
                              {property.title}
                            </h3>
                          </div>
                          <span className="mt-3 inline-flex items-center text-sm text-accent font-semibold">
                            Ver unidades
                          </span>
                        </div>
                      </div>
                    </TenantLink>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
