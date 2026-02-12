import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import GalleryCarousel from "@/components/GalleryCarousel";
import Navbar from "@/components/Navbar";
import PropertyMeta from "@/components/PropertyMeta";
import RealtorCard from "@/components/RealtorCard";
import SimilarPropertiesCarousel from "@/components/SimilarPropertiesCarousel";
import { supabase } from "@/integrations/supabase/client";
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
  city: string;
  state: string;
  zipcode: string;
  features: string[];
  iptu?: number;
  condominio?: number;
  is_launch?: boolean;
  location?: string;
  property_images?: { image_url: string; is_primary?: boolean }[];
}

const formatCurrency = (value: number, withCents = false) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  }).format(value);

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("properties")
          .select(
            `
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
            `
          );

        query = id.startsWith("IMV-") ? query.eq("codigo", id) : query.eq("id", id);
        const { data, error } = await query.maybeSingle();
        if (error) throw error;

        if (!data) {
          setProperty(null);
          return;
        }

        setProperty(data as unknown as Property);
        trackPropertyView(data.id).catch((err) => console.error("Erro ao rastrear visualizacao:", err));

        const { data: similar } = await supabase
          .from("properties")
          .select("*")
          .eq("property_type", data.property_type)
          .eq("city", data.city)
          .neq("id", data.id)
          .limit(6);

        if (similar) setSimilarProperties(similar as unknown as Property[]);
      } catch (error) {
        console.error("Erro ao carregar imovel:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const updateFavorites = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
        setIsFavorited(id ? favs.includes(id) : false);
      } catch {
        setIsFavorited(false);
      }
    };

    updateFavorites();
    window.addEventListener("favoritesChanged", updateFavorites);
    window.addEventListener("storage", updateFavorites);
    return () => {
      window.removeEventListener("favoritesChanged", updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, [id]);

  const toggleFavorite = () => {
    const key = "favorites";
    const favs = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const exists = id ? favs.includes(id) : false;
    const updated = exists ? favs.filter((item) => item !== id) : [...favs, id as string];
    localStorage.setItem(key, JSON.stringify(updated));
    setIsFavorited(!exists);
    window.dispatchEvent(new Event("favoritesChanged"));
  };

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center text-slate-600">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center text-slate-600">Imovel nao encontrado.</div>
        <Footer />
      </div>
    );
  }

  const propertyImages = property.property_images || [];
  const imageUrls =
    propertyImages.length > 0
      ? propertyImages.map((image) => image.image_url)
      : ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"];

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-8 md:pt-10">
          <div className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border border-white/25 bg-white/10 text-white">
                    {property.property_type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Badge>
                  <Badge className="border border-amber-300/50 bg-amber-400 text-slate-900">
                    {property.transaction_type === "aluguel" ? "Aluguel" : "Venda"}
                  </Badge>
                </div>
                <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{property.title}</h1>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-white/80">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  {property.location || "Endereco indisponivel"}, {property.city}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className="rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20"
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-rose-400 text-rose-400" : ""}`} />
                {isFavorited ? "Salvo" : "Salvar"}
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <GalleryCarousel
                images={imageUrls}
                location={property.location}
                city={property.city}
                state={property.state}
                zipcode={property.zipcode}
              />

              {!property.is_launch ? (
                <div className="surface-card p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {property.transaction_type === "aluguel" ? "Valor aluguel" : "Preco"}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {formatCurrency(property.price, property.transaction_type === "aluguel")}
                        {property.transaction_type === "aluguel" ? (
                          <span className="ml-2 text-sm font-semibold text-slate-500">/ mes</span>
                        ) : null}
                      </p>
                    </div>
                    {property.condominio || property.iptu ? (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {property.condominio ? (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-slate-500">Condominio</p>
                            <p className="font-semibold text-slate-900">{formatCurrency(property.condominio, true)}</p>
                          </div>
                        ) : null}
                        {property.iptu ? (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-slate-500">IPTU</p>
                            <p className="font-semibold text-slate-900">{formatCurrency(property.iptu, true)}</p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

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

              <div className="section-shell p-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {property.is_launch ? "Descricao do empreendimento" : "Sobre o imovel"}
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 md:text-base">
                  {property.description || "Descricao nao disponivel."}
                </p>
              </div>

              {property.features && property.features.length > 0 ? (
                <div className="section-shell p-6">
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {property.is_launch ? "Sobre o empreendimento" : "Diferenciais"}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge
                        key={`${feature}-${index}`}
                        variant="outline"
                        className="rounded-full border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <Accordion type="single" collapsible className="section-shell px-6">
                <AccordionItem value="plantas" className="border-none">
                  <AccordionTrigger className="py-4 text-left text-lg font-semibold text-slate-900 hover:no-underline">
                    Plantas
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm text-slate-600">
                    As plantas deste imovel estarao disponiveis em breve.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {similarProperties.length > 0 ? <SimilarPropertiesCarousel properties={similarProperties} /> : null}
            </div>

            <div className="lg:col-span-1">
              <RealtorCard
                name="Imobiflow"
                creci="CRECI - 000000-XX (demo)"
                phone="5500000000000"
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
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
