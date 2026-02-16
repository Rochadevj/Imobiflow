import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, HousePlus } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/integrations/supabase/client";

interface PropertyImage {
  image_url: string;
  is_primary?: boolean;
}

interface Property {
  id: string;
  codigo?: string;
  title: string;
  property_type: string;
  transaction_type?: string;
  price: number;
  location: string;
  city: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  featured?: boolean;
  property_images?: PropertyImage[];
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
        setFavorites(favs);
      } catch {
        setFavorites([]);
      }
    };

    loadFavorites();
    window.addEventListener("favoritesChanged", loadFavorites);
    return () => window.removeEventListener("favoritesChanged", loadFavorites);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (favorites.length === 0) {
        setProperties([]);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select(
          `
            id, codigo, title, property_type, transaction_type, price, location, city, area,
            bedrooms, bathrooms, parking_spaces, featured,
            property_images(image_url, is_primary)
          `
        )
        .in("id", favorites);

      if (error) {
        console.error("Erro ao buscar favoritos", error);
      } else {
        setProperties(data || []);
      }
    };

    fetchData();
  }, [favorites]);

  return (
    <div className="page-shell">
      <Navbar />

      <main className="flex-1">
        <section className="container mx-auto px-4 pt-10 md:pt-14">
          <div className="hero-surface p-7 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="glass-chip">
                  <Heart className="h-3.5 w-3.5" />
                  Lista pessoal
                </span>
                <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Seus imóveis favoritos</h1>
                <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
                  Aqui ficam os imóveis salvos para comparar opções e decidir com mais segurança.
                </p>
              </div>
              <a
                href="/imobiliaria?list=1"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <HousePlus className="h-4 w-4" />
                Buscar mais imóveis
              </a>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          {properties.length === 0 ? (
            <div className="section-shell p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">Nenhum favorito salvo ainda</h2>
              <p className="mt-2 text-sm text-slate-600">
                Explore os imóveis da demo e clique no ícone de coração para salvar suas opções.
              </p>
              <Link
                to="/imobiliaria?list=1"
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ver imóveis
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => {
                const primary =
                  property.property_images?.find((img: PropertyImage) => img.is_primary) ||
                  property.property_images?.[0];

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
                      imageUrl={primary?.image_url}
                      featured={property.featured}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
