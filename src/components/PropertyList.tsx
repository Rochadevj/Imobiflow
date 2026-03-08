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
  tenantId?: string;
  onEdit?: (propertyId: string) => void;
}

const PropertyList = ({ tenantId, onEdit }: PropertyListProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartamento: "Apartamento",
      casa: "Casa",
      casa_condominio: "Casa em Condomínio",
      cobertura: "Cobertura",
      sala_comercial: "Sala Comercial",
      sobrado: "Sobrado",
      sobrado_condominio: "Sobrado em Condomínio",
      terreno: "Terreno",
    };
    return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  useEffect(() => {
    void fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

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

      if (tenantId) {
        query = query.eq("tenant_id", tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setProperties(data || []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
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
      await fetchProperties();
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro ao excluir imóvel");
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Carregando...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Nenhum imóvel cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => {
        const primaryImage = property.property_images.find((img) => img.is_primary);
        const imageUrl = primaryImage?.image_url || property.property_images[0]?.image_url;

        return (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative h-48">
              {imageUrl ? (
                <img src={imageUrl} alt={property.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Sem imagem</span>
                </div>
              )}
              <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
                {getPropertyTypeLabel(property.property_type)}
              </Badge>
              <Badge
                className={`absolute right-2 top-2 ${
                  property.status === "available"
                    ? "bg-green-500"
                    : property.status === "sold"
                      ? "bg-red-500"
                      : property.status === "rented"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                }`}
              >
                {property.status === "available"
                  ? "Disponível"
                  : property.status === "sold"
                    ? "Vendido"
                    : property.status === "rented"
                      ? "Alugado"
                      : "Lançamento"}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="mb-2 line-clamp-1 text-lg font-bold">{property.title}</h3>
              <div className="mb-2 flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{property.location} | {property.city}</span>
              </div>
              <div className="mb-4 text-xl font-bold text-accent">
                R$ {property.price.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
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
                      <AlertDialogAction onClick={() => handleDelete(property.id)}>Excluir</AlertDialogAction>
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
