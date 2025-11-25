import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, MapPin, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Property {
  id: string;
  title: string;
  property_type: string;
  price: number;
  location: string;
  city: string;
  status: string;
  property_images: { image_url: string; is_primary: boolean }[];
}

interface PropertyListProps {
  userId?: string;
  onEdit?: (propertyId: string) => void;
}

const PropertyList = ({ userId, onEdit }: PropertyListProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [userId]);

  const fetchProperties = async () => {
    try {
      let query = supabase
        .from("properties")
        .select(`
          id,
          title,
          property_type,
          price,
          location,
          city,
          status,
          property_images(image_url, is_primary)
        `)
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast.error("Erro ao carregar imóveis");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) throw error;

      toast.success("Imóvel excluído com sucesso!");
      fetchProperties();
    } catch (error) {
      toast.error("Erro ao excluir imóvel");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum imóvel cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => {
        const primaryImage = property.property_images.find((img) => img.is_primary);
        const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;

        return (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative h-48">
              {imageUrl ? (
                <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Sem imagem</span>
                </div>
              )}
              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
              </Badge>
              <Badge
                className={`absolute top-2 right-2 ${
                  property.status === "available"
                    ? "bg-green-500"
                    : property.status === "sold"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              >
                {property.status === "available"
                  ? "Disponível"
                  : property.status === "sold"
                  ? "Vendido"
                  : "Alugado"}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{property.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{property.location} | {property.city}</span>
              </div>
              <div className="text-xl font-bold text-accent mb-4">
                R$ {property.price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>

              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="outline" className="flex-1" onClick={() => onEdit(property.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(property.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PropertyList;
