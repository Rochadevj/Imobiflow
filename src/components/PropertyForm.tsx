import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres").max(1000),
  propertyType: z.string().min(1, "Selecione um tipo de imóvel"),
  price: z.number().positive("Preço deve ser maior que zero"),
  location: z.string().min(3, "Localização inválida").max(200),
  city: z.string().min(2, "Cidade inválida").max(100),
});

interface PropertyFormProps {
  onSuccess: () => void;
}

const PropertyForm = ({ onSuccess }: PropertyFormProps) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    transactionType: "venda",
    price: "",
    location: "",
    city: "",
      state: "",
      zipcode: "",
    area: "",
    areaPrivativa: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files);
      setVideos(prev => [...prev, ...newVideos]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert Brazilian format (123.456,78) to number
      const priceValue = parseFloat(formData.price.replace(/\./g, '').replace(',', '.'));
      
      const validatedData = propertySchema.parse({
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        price: priceValue,
        location: formData.location,
        city: formData.city,
      });

      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .insert([{
          title: validatedData.title,
          description: validatedData.description,
          property_type: validatedData.propertyType,
          transaction_type: formData.transactionType,
          price: validatedData.price,
          location: validatedData.location,
          city: validatedData.city,
            state: formData.state || null,
            zipcode: formData.zipcode || null,
          area: formData.area ? parseFloat(formData.area) : null,
          area_privativa: formData.areaPrivativa ? parseFloat(formData.areaPrivativa) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          parking_spaces: formData.parkingSpaces ? parseInt(formData.parkingSpaces) : null,
          features: features.length > 0 ? features : null,
          user_id: user.id,
        }])
        .select()
        .single();
      if (propertyError) {
        // Log full error for debugging in console and surface message to user
        console.error("Erro ao inserir propriedade:", propertyError);
        toast.error(propertyError.message || "Erro ao cadastrar imóvel");
        throw propertyError;
      }

      // upload images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${property.id}/${Date.now()}-img-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("property-images")
            .getPublicUrl(fileName);

          await supabase.from("property_images").insert({
            property_id: property.id,
            image_url: publicUrl,
            is_primary: i === 0,
          });
        }
      }

      // upload videos (will be stored in same table; detail view will detect video by extension)
      if (videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const file = videos[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${property.id}/${Date.now()}-vid-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("property-images")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("property-images")
            .getPublicUrl(fileName);

          await supabase.from("property_images").insert({
            property_id: property.id,
            image_url: publicUrl,
            is_primary: false,
          });
        }
      }

      toast.success("Imóvel cadastrado com sucesso!");
      setFormData({
        title: "",
        description: "",
        propertyType: "",
        transactionType: "venda",
        price: "",
        location: "",
        city: "",
          state: "",
          zipcode: "",
        area: "",
        areaPrivativa: "",
        bedrooms: "",
        bathrooms: "",
        parkingSpaces: "",
      });
      setImages([]);
      setVideos([]);
      setFeatures([]);
      setNewFeature("");
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string") {
        // Mensagem já pode ter sido exibida, evitar duplicar
        const message = (error as { message: string }).message;
        if (!/Erro ao cadastrar imóvel/.test(message)) {
          toast.error(message);
        }
      } else {
        toast.error("Erro ao cadastrar imóvel");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Casa espaçosa com piscina"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Tipo *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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

            <div className="space-y-2">
              <Label htmlFor="transactionType">Categoria *</Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="250000.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaPrivativa">Área Privativa (m²)</Label>
              <Input
                id="areaPrivativa"
                type="number"
                step="0.01"
                value={formData.areaPrivativa}
                onChange={(e) => setFormData({ ...formData, areaPrivativa: e.target.value })}
                placeholder="110"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Bairro *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Jardim Paulista"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: São Paulo"
                required
              />
            </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Ex: SP"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipcode">CEP</Label>
                <Input
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                  placeholder="Ex: 01310-100"
                />
              </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parkingSpaces">Vagas</Label>
              <Input
                id="parkingSpaces"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o imóvel..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Diferenciais do Imóvel</Label>
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
          </div>

          <div className="space-y-2">
            <Label>Fotos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Clique para adicionar fotos
                </span>
              </Label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Vídeo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <Label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Clique para adicionar vídeos (mp4, webm)
                </span>
              </Label>
            </div>

            {videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <video
                      src={URL.createObjectURL(video)}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-primary hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar Imóvel"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
