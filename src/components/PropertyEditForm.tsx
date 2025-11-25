import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

interface PropertyEditFormProps {
  propertyId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PropertyEditForm({
  propertyId,
  onSuccess,
  onCancel,
}: PropertyEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipoImovel: "",
    tipo: "venda",
    preco: "",
    area: "",
    areaPrivativa: "",
    quartos: "",
    banheiros: "",
    vagas: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    destaque: false,
    status: "disponivel",
  });

  const [existingImages, setExistingImages] = useState<
    Array<{ id: string; url: string; isVideo: boolean }>
  >([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPropertyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchPropertyData = async () => {
    try {
      setFetchingData(true);
      
      // Fetch property details
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (propertyError) throw propertyError;

      if (property) {
        // Map status from English to Portuguese for form display
        const statusMap: Record<string, string> = {
          "available": "disponivel",
          "sold": "vendido",
          "rented": "alugado",
        };
        
        // Use dot-decimal plain format for number inputs
        const formattedPrice = property.price !== null && property.price !== undefined
          ? String(property.price)
          : "";
        const formattedArea = property.area !== null && property.area !== undefined
          ? String(property.area)
          : "";
        
        setFormData({
          titulo: property.title || "",
          descricao: property.description || "",
          tipoImovel: property.property_type || "",
          tipo: property.transaction_type || "venda",
          preco: formattedPrice,
          area: formattedArea,
          areaPrivativa: property.area_privativa !== null && property.area_privativa !== undefined ? String(property.area_privativa) : "",
          quartos: property.bedrooms?.toString() || "",
          banheiros: property.bathrooms?.toString() || "",
          vagas: property.parking_spaces?.toString() || "",
          endereco: property.location || "",
          cidade: property.city || "",
            estado: property.state || "",
            cep: property.zipcode || "",
          destaque: property.featured || false,
          status: statusMap[property.status || "available"] || "disponivel",
        });
        
        // Load features if they exist
        if (property.features && Array.isArray(property.features)) {
          setFeatures(property.features);
        }
      }

      // Fetch property images
      const { data: images, error: imagesError } = await supabase
        .from("property_images")
        .select("*")
        .eq("property_id", propertyId);

      if (imagesError) throw imagesError;

      if (images) {
        const formattedImages = images.map((img) => ({
          id: img.id,
          url: img.image_url,
          isVideo: /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(img.image_url),
        }));
        setExistingImages(formattedImages);
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      toast.error("Erro ao carregar dados do imóvel");
    } finally {
      setFetchingData(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewVideos((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setVideoPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index: number) => {
    setNewVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from("property_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Mídia removida com sucesso");
    } catch (error) {
      console.error("Error removing media:", error);
      toast.error("Erro ao remover mídia");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map status from Portuguese to English for database
      const statusMap: Record<string, string> = {
        "disponivel": "available",
        "vendido": "sold",
        "alugado": "rented",
      };
      
      // Update property details
      // Convert Brazilian format (123.456,78) to number
      const priceValue = parseFloat(formData.preco.replace(/\./g, '').replace(',', '.'));
      const areaValue = formData.area ? parseFloat(formData.area) : null;
      const areaPrivativaValue = formData.areaPrivativa ? parseFloat(formData.areaPrivativa) : null;
      
      const { error: updateError } = await supabase
        .from("properties")
        .update({
          title: formData.titulo,
          description: formData.descricao,
          property_type: formData.tipoImovel,
          transaction_type: formData.tipo,
          price: priceValue,
          area: areaValue,
          area_privativa: areaPrivativaValue,
          bedrooms: parseInt(formData.quartos),
          bathrooms: parseInt(formData.banheiros),
          parking_spaces: parseInt(formData.vagas),
          location: formData.endereco,
          city: formData.cidade,
            state: formData.estado || null,
            zipcode: formData.cep || null,
          featured: formData.destaque,
          status: statusMap[formData.status] || formData.status,
          features: features.length > 0 ? features : null,
        })
        .eq("id", propertyId);

      if (updateError) throw updateError;

      // Upload new images
      if (newImages.length > 0) {
        for (const image of newImages) {
          const fileExt = image.name.split(".").pop();
          const fileName = `${propertyId}-img-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, image);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("property-images").getPublicUrl(filePath);

          const { error: insertError } = await supabase
            .from("property_images")
            .insert({
              property_id: propertyId,
              image_url: publicUrl,
            });

          if (insertError) throw insertError;
        }
      }

      // Upload new videos
      if (newVideos.length > 0) {
        for (const video of newVideos) {
          const fileExt = video.name.split(".").pop();
          const fileName = `${propertyId}-vid-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(filePath, video);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("property-images").getPublicUrl(filePath);

          const { error: insertError } = await supabase
            .from("property_images")
            .insert({
              property_id: propertyId,
              image_url: publicUrl,
            });

          if (insertError) throw insertError;
        }
      }

      toast.success("Imóvel atualizado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Erro ao atualizar imóvel");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título do Imóvel</Label>
            <Input
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
              <Select
                value={formData.tipoImovel}
                onValueChange={(value) => handleSelectChange("tipoImovel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="tipo">Categoria</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleSelectChange("tipo", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                step="0.01"
                value={formData.area}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="areaPrivativa">Área Privativa (m²)</Label>
              <Input
                id="areaPrivativa"
                name="areaPrivativa"
                type="number"
                step="0.01"
                value={formData.areaPrivativa}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="destaque"
              name="destaque"
              checked={formData.destaque}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <Label htmlFor="destaque" className="cursor-pointer">
              Destacar este imóvel
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="quartos">Quartos</Label>
            <Input
              id="quartos"
              name="quartos"
              type="number"
              value={formData.quartos}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="banheiros">Banheiros</Label>
            <Input
              id="banheiros"
              name="banheiros"
              type="number"
              value={formData.banheiros}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="vagas">Vagas de Garagem</Label>
            <Input
              id="vagas"
              name="vagas"
              type="number"
              value={formData.vagas}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diferenciais do Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Ex: Área de serviço, Churrasqueira, Piscina..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newFeature.trim()) {
                    setFeatures([...features, newFeature.trim()]);
                    setNewFeature("");
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (newFeature.trim()) {
                  setFeatures([...features, newFeature.trim()]);
                  setNewFeature("");
                }
              }}
              variant="outline"
            >
              Adicionar
            </Button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm flex items-center gap-2"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mídia Atual</CardTitle>
        </CardHeader>
        <CardContent>
          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((media) => (
                <div key={media.id} className="relative group">
                  {media.isVideo ? (
                    <video
                      src={media.url}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="Property"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(media.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhuma mídia adicionada ainda.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Fotos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="newImages" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Clique para selecionar fotos</p>
              </div>
              <Input
                id="newImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Vídeos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label htmlFor="newVideos" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Clique para selecionar vídeos</p>
              </div>
              <Input
                id="newVideos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
          </div>

          {videoPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <video
                    src={preview}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewVideo(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
