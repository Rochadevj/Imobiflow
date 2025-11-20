import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const loadFavs = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
        setFavorites(favs);
      } catch {
        setFavorites([]);
      }
    };

    loadFavs();
    window.addEventListener('favoritesChanged', loadFavs);
    return () => window.removeEventListener('favoritesChanged', loadFavs);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!favorites || favorites.length === 0) {
        setProperties([]);
        return;
      }
      const { data, error } = await supabase
        .from('properties')
        .select(`id, title, property_type, price, location, city, area, bedrooms, bathrooms, parking_spaces, featured, property_images(image_url, is_primary)`)
        .in('id', favorites);

      if (error) {
        console.error('Erro ao buscar favoritos', error);
      } else {
        setProperties(data || []);
      }
    };
    fetch();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Favoritos</h1>
        {properties.length === 0 ? (
          <div className="text-muted-foreground">Você não tem favoritos ainda.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((p) => {
              const primary = p.property_images?.find((i:any) => i.is_primary) || p.property_images?.[0];
              return (
                <Link key={p.id} to={`/property/${p.id}`} className="no-underline">
                  <PropertyCard
                    id={p.id}
                    title={p.title}
                    propertyType={p.property_type}
                    location={p.location}
                    city={p.city}
                    price={p.price}
                    area={p.area}
                    bedrooms={p.bedrooms}
                    bathrooms={p.bathrooms}
                    parkingSpaces={p.parking_spaces}
                    imageUrl={primary?.image_url}
                    featured={p.featured}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
