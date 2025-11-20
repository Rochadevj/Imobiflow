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

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
  
  // Separate photos and videos
  const photos = images.filter(url => !isVideoUrl(url));
  const videos = images.filter(url => isVideoUrl(url));
  
  // Display content based on mode
  const displayContent = viewMode === "video" ? videos : photos;
  
  const visibleImages = 3;
  const maxIndex = Math.max(0, displayContent.length - visibleImages);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const displayedItems = displayContent.slice(currentIndex, currentIndex + visibleImages);

  return (
    <div className="w-full space-y-4">
      {/* View Mode Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant={viewMode === "photos" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setViewMode("photos");
            setCurrentIndex(0);
          }}
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          Fotos ({photos.length})
        </Button>
        {videos.length > 0 && (
          <Button
            variant={viewMode === "video" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("video");
              setCurrentIndex(0);
            }}
            className="gap-2"
          >
            <Video className="w-4 h-4" />
            Vídeo ({videos.length})
          </Button>
        )}
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

      {/* Image/Video Carousel */}
      {viewMode === "photos" && photos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma foto disponível
        </div>
      )}
      
      {viewMode === "video" && videos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum vídeo disponível
        </div>
      )}

      {displayContent.length > 0 && (viewMode === "photos" || viewMode === "video") && (
        <div className="relative">
          <div className="grid grid-cols-3 gap-3">
            {displayedItems.map((item, idx) => (
              <div
                key={currentIndex + idx}
                className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(item)}
              >
                {isVideoUrl(item) ? (
                  <>
                    <video
                      src={item}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                      <div className="bg-white/90 rounded-full p-3">
                        <Video className="w-8 h-8 text-[#083c51]" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item}
                    alt={`Imagem ${currentIndex + idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
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
      )}

      {viewMode === "map" && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          Mapa em breve
        </div>
      )}

      {viewMode === "tour" && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          Tour virtual em breve
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0">
          {selectedImage && (isVideoUrl(selectedImage) ? (
            <video src={selectedImage} controls className="w-full h-auto rounded-lg" />
          ) : (
            <img
              src={selectedImage}
              alt="Visualização ampliada"
              className="w-full h-auto rounded-lg"
            />
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
