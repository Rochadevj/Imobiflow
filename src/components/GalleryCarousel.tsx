import { useState } from "react";
import { ChevronLeft, ChevronRight, Image, Video, Map, Scan } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface GalleryCarouselProps {
  images: string[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"photos" | "video" | "map" | "tour">("photos");

  const visibleImages = 3;
  const maxIndex = Math.max(0, images.length - visibleImages);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const displayedImages = images.slice(currentIndex, currentIndex + visibleImages);

  return (
    <div className="w-full space-y-4">
      {/* Image Carousel */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-2">
          {displayedImages.map((image, idx) => (
            <div
              key={currentIndex + idx}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`Imagem ${currentIndex + idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-[#083c51]" />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6 text-[#083c51]" />
          </button>
        )}
      </div>

      {/* View Mode Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant={viewMode === "photos" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("photos")}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Fotos
        </Button>
        <Button
          variant={viewMode === "video" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("video")}
          className="gap-2"
        >
          <Video className="w-4 h-4" />
          Vídeo
        </Button>
        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("map")}
          className="gap-2"
        >
          <Map className="w-4 h-4" />
          Mapa
        </Button>
        <Button
          variant={viewMode === "tour" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("tour")}
          className="gap-2"
        >
          <Scan className="w-4 h-4" />
          Tour
        </Button>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Visualização ampliada"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
