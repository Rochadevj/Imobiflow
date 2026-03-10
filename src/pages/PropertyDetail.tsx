import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Images, MapPin, MessageCircle, UserRound } from "lucide-react";
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
import { buildWhatsAppLink } from "@/lib/contact";
import { trackPropertyView } from "@/lib/propertyViews";
import { useTenant } from "@/context/TenantContext";
import { readFavorites, writeFavorites } from "@/lib/favorites";
import { getTenantBrandName, getTenantCreci, getTenantWhatsApp } from "@/lib/tenantBrand";

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
  street_number?: string | null;
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
  const navigate = useNavigate();
  const { tenant, loading: tenantLoading, tenantPath } = useTenant();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const gallerySectionRef = useRef<HTMLDivElement | null>(null);

  const brandName = getTenantBrandName(tenant);
  const creci = getTenantCreci(tenant);
  const whatsapp = getTenantWhatsApp(tenant);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    if (!id || tenantLoading) return;

    const load = async () => {
      setLoading(true);
      try {
        if (!tenant?.id) {
          setProperty(null);
          setSimilarProperties([]);
          return;
        }

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
              street_number,
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
            `,
          )
          .eq("tenant_id", tenant.id)
          .eq("status", "available");

        query = id.startsWith("IMV-") ? query.eq("codigo", id) : query.eq("id", id);
        const { data, error } = await query.maybeSingle();
        if (error) throw error;

        if (!data) {
          setProperty(null);
          setSimilarProperties([]);
          return;
        }

        setProperty(data as unknown as Property);
        void trackPropertyView(data.id).catch((err) => console.error("Erro ao rastrear visualização:", err));

        const { data: similar } = await supabase
          .from("properties")
          .select(
            `
              id,
              codigo,
              title,
              property_type,
              transaction_type,
              city,
              location,
              price,
              area,
              bedrooms,
              parking_spaces,
              created_at,
              property_images(image_url, is_primary)
            `,
          )
          .eq("tenant_id", tenant.id)
          .neq("id", data.id)
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(18);

        if (similar) {
          const randomProperties = [...similar].sort(() => Math.random() - 0.5).slice(0, 8);
          setSimilarProperties(randomProperties as unknown as Property[]);
        }
      } catch (error) {
        console.error("Erro ao carregar imóvel:", error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, tenant?.id, tenantLoading]);

  useEffect(() => {
    const updateFavorites = () => {
      setIsFavorited(id ? readFavorites(tenant?.slug).includes(id) : false);
    };

    updateFavorites();
    window.addEventListener("favoritesChanged", updateFavorites);
    window.addEventListener("storage", updateFavorites);
    return () => {
      window.removeEventListener("favoritesChanged", updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, [id, tenant?.slug]);

  const toggleFavorite = () => {
    if (!id) return;
    const favs = readFavorites(tenant?.slug);
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((item) => item !== id) : [...favs, id];
    writeFavorites(updated, tenant?.slug);
    setIsFavorited(!exists);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(tenantPath("/imobiliaria?list=1", true));
  };

  if (loading || tenantLoading) {
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
        <div className="container mx-auto px-4 py-24 text-center text-slate-600">Imóvel não encontrado.</div>
        <Footer />
      </div>
    );
  }

  const propertyImages = property.property_images || [];
  const imageUrls = propertyImages.length > 0
    ? propertyImages.map((image) => image.image_url)
    : ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"];
  const quickContactLink = buildWhatsAppLink(
    `Olá! Tenho interesse no imóvel ${property.title} (${property.codigo || property.id.slice(0, 8)}).`,
    whatsapp,
  );

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1 pb-24 lg:pb-0">
        <section className="container mx-auto px-4 pt-8 md:pt-10">
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="rounded-full border-slate-200 bg-white/85 text-slate-700 shadow-sm hover:bg-white hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>

          <div className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border border-white/25 bg-white/10 text-white">
                    {property.property_type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                  </Badge>
                  {!property.is_launch ? (
                    <Badge className="border border-amber-300/50 bg-amber-400 text-slate-900">
                      {property.transaction_type === "aluguel" ? "Aluguel" : "Venda"}
                    </Badge>
                  ) : null}
                </div>
                <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{property.title}</h1>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-white/80">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  {[property.location, property.street_number].filter(Boolean).join(", ") || "Endereço indisponível"}, {property.city}
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
              <div ref={gallerySectionRef}>
                <GalleryCarousel
                  images={imageUrls}
                  location={property.location}
                  streetNumber={property.street_number}
                  city={property.city}
                  state={property.state}
                  zipcode={property.zipcode}
                />
              </div>

              {!property.is_launch ? (
                <div className="surface-card p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {property.transaction_type === "aluguel" ? "Valor do aluguel" : "Preço"}
                      </p>
                      <p className="mt-1 text-3xl font-bold text-slate-900">
                        {formatCurrency(property.price, property.transaction_type === "aluguel")}
                        {property.transaction_type === "aluguel" ? (
                          <span className="ml-2 text-sm font-semibold text-slate-500">/ mês</span>
                        ) : null}
                      </p>
                    </div>
                    {property.condominio || property.iptu ? (
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        {property.condominio ? (
                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <p className="text-slate-500">Condomínio</p>
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
                  {property.is_launch ? "Descrição do empreendimento" : "Sobre o imóvel"}
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 md:text-base">
                  {property.description || "Descrição não disponível."}
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

              {property.is_launch ? (
                <Accordion type="single" collapsible className="section-shell px-6">
                  <AccordionItem value="plantas" className="border-none">
                    <AccordionTrigger className="py-4 text-left text-lg font-semibold text-slate-900 hover:no-underline">
                      Plantas
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm text-slate-600">
                      As plantas deste imóvel estarão disponíveis em breve.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : null}

            </div>

            <div className="lg:col-span-1">
              <RealtorCard
                name={brandName}
                creci={creci}
                phone={whatsapp}
                propertyTitle={property.title}
                propertyCode={property.codigo || property.id.slice(0, 8)}
                propertyType={property.property_type}
                transactionType={property.transaction_type}
                area={property.area}
                location={property.location}
                city={property.city}
              />
              <a
                href={buildWhatsAppLink(`Olá! Tenho interesse no imóvel ${property.title}.`, whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
              >
                Contato WhatsApp
              </a>
            </div>

            {similarProperties.length > 0 ? (
              <div className="lg:col-span-3">
                <SimilarPropertiesCarousel properties={similarProperties} />
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 py-3 shadow-[0_-12px_28px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 shadow-sm">
            <UserRound className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{brandName}</p>
            <p className="truncate text-xs text-slate-500">Contato rápido sobre este imóvel</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-300 bg-white px-3 text-slate-700 hover:bg-slate-100"
            onClick={() => gallerySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            <Images className="mr-2 h-4 w-4" />
            Galeria
          </Button>

          <Button
            className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-3 text-slate-900 shadow-[0_10px_22px_rgba(251,146,60,0.28)] hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
            asChild
          >
            <a href={quickContactLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contatar
            </a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
