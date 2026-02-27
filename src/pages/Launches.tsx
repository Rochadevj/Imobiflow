import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LaunchProperty {
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
  is_launch?: boolean;
  property_images: { image_url: string; is_primary: boolean }[];
}

const Launches = () => {
  const [launches, setLaunches] = useState<LaunchProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
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
            is_launch,
            property_images(image_url, is_primary)
          `)
          .eq("status", "available")
          .eq("is_launch", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLaunches(data || []);
      } catch (error) {
        console.error("Erro ao carregar lançamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  const filteredLaunches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return launches;

    return launches.filter((property) => {
      return (
        property.title.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term) ||
        property.city.toLowerCase().includes(term)
      );
    });
  }, [launches, searchTerm]);

  return (
    <div className="page-shell">
      <Navbar />

      <section className="relative mx-4 mt-8 overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(135deg,hsl(var(--hero-gradient-start))_0%,hsl(var(--hero-gradient-end))_62%,hsl(214_35%_20%)_100%)] py-12 text-white shadow-[0_26px_60px_rgba(15,23,42,0.3)] md:mx-6 lg:mx-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 h-[260px] w-[260px] rounded-bl-[120px] bg-accent/12 md:h-[360px] md:w-[360px]" />
          <div className="absolute left-0 bottom-0 h-[220px] w-[220px] rounded-tr-[120px] bg-white/5" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                Página dedicada
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                Lançamentos
                <span className="text-accent">.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-white/80">
                Aqui você encontra todos os empreendimentos e imóveis de lançamento em um só lugar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <Link to="/imobiliaria">Voltar para início</Link>
              </Button>
              <Button className="rounded-full bg-accent text-white hover:bg-accent/90" asChild>
                <a href="tel:+5500000000000">Falar com corretor</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Todos os lançamentos</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              {loading
                ? "Carregando imóveis..."
                : `${filteredLaunches.length} ${
                    filteredLaunches.length === 1 ? "lançamento encontrado" : "lançamentos encontrados"
                  }`}
            </p>
          </div>

          <div className="relative w-full md:w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, bairro ou cidade"
              className="h-11 bg-white pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-14 text-center">
            <p className="text-muted-foreground">Carregando lançamentos...</p>
          </div>
        ) : filteredLaunches.length === 0 ? (
          <div className="surface-card border-slate-200/80 py-14 text-center">
            <p className="text-muted-foreground">Nenhum lançamento disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {filteredLaunches.map((property) => {
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
                    isLaunch={property.is_launch}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Launches;
