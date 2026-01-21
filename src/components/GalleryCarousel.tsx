import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image, Video, Map, Scan, ZoomIn, ZoomOut, Play, Pause, X, Grid2X2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface GalleryCarouselProps {
  images: string[];
  location?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export default function GalleryCarousel({ images, location, city, state, zipcode }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showThumbs, setShowThumbs] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"photos" | "video" | "map" | "tour">("photos");

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  // Separate photos and videos
  const photos = images.filter((url) => !isVideoUrl(url));
  const videos = images.filter((url) => isVideoUrl(url));

  // Display content based on mode
  const displayContent = viewMode === "video" ? videos : photos;

  useEffect(() => {
    setCurrentIndex(0);
  }, [viewMode, displayContent.length]);

  useEffect(() => {
    if (selectedIndex === null) {
      setIsPlaying(false);
      return;
    }
    setZoom(1);
  }, [selectedIndex]);

  useEffect(() => {
    if (!isPlaying || selectedIndex === null || displayContent.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev === null) return prev;
        return prev < displayContent.length - 1 ? prev + 1 : 0;
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [isPlaying, selectedIndex, displayContent.length]);

  const maxIndex = Math.max(0, displayContent.length - 1);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const displayedItems = displayContent;

  return (
    <div className="w-full space-y-5">
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
        <div className="space-y-4">
          <div className="relative">
            <div
              className="relative aspect-[16/9] overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transition-all"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedIndex(null);
              }}
            >
              {isVideoUrl(displayContent[currentIndex]) ? (
                <>
                  <video
                    src={displayContent[currentIndex]}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="bg-white/90 rounded-full p-3">
                      <Video className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={displayContent[currentIndex]}
                  alt={`Imagem ${currentIndex + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>

            {currentIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/35 rounded-full p-3 shadow-lg transition-all z-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-7 h-7 text-white/90" />
              </button>
            )}

            {currentIndex < maxIndex && (
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/35 rounded-full p-3 shadow-lg transition-all z-10"
                aria-label="Próximo"
              >
                <ChevronRight className="w-7 h-7 text-white/90" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {displayedItems.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsModalOpen(true);
                  setSelectedIndex(null);
                }}
                className={`relative overflow-hidden rounded-lg border transition-all ${
                  idx === currentIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200 hover:border-primary/60"
                }`}
              >
                {isVideoUrl(item) ? (
                  <div className="relative">
                    <video
                      src={item}
                      className="w-full h-24 object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === "map" && (
        <div>
          {location ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 h-[520px] bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                  [location, city, state || "RS", "Brasil"].filter(Boolean).join(", ")
                )}`}
                title="Localização do imóvel"
              />
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 h-[520px] bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500">Endereço não disponível para exibição no mapa</p>
            </div>
          )}   
        </div>
      )}

      {viewMode === "tour" && (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          Tour virtual em breve
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedIndex(null);
          setZoom(1);
          setIsPlaying(false);
        }
      }}>
        <DialogContent
          hideClose
          className={`max-w-[95vw] max-h-[95vh] p-0 border-0 shadow-none ${selectedIndex === null ? "bg-white" : "bg-transparent"}`}
        >
          {selectedIndex === null ? (
            <div className="relative w-full h-full rounded-xl bg-white">
              <div className="flex items-center justify-between px-8 py-4 border-b">
                <h3 className="text-lg font-semibold text-foreground">Galeria de Imagens</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 hover:bg-muted transition"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-8 pb-8 pt-4 overflow-y-auto max-h-[80vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayContent.map((item, idx) => (
                    <button
                      key={`${item}-grid-${idx}`}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className="rounded-xl overflow-hidden border border-border/60 hover:border-accent/70 transition-all text-left"
                    >
                      {isVideoUrl(item) ? (
                        <div className="relative w-full h-full">
                          <video src={item} className="w-full h-full object-cover" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <img src={item} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full rounded-xl bg-black/70">
              <div className="flex items-center justify-between px-8 py-4 text-white">
                <div className="text-sm text-white/80">
                  {`${selectedIndex + 1}/${displayContent.length}`}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowThumbs((v) => !v)}
                    className="rounded-full p-2 hover:bg-white/10 transition"
                    aria-label="Mostrar miniaturas"
                  >
                    <Grid2X2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
                    className="rounded-full p-2 hover:bg-white/10 transition"
                    aria-label="Aproximar"
                    disabled={isVideoUrl(displayContent[selectedIndex])}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                    className="rounded-full p-2 hover:bg-white/10 transition"
                    aria-label="Afastar"
                    disabled={isVideoUrl(displayContent[selectedIndex])}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying((v) => !v)}
                    className="rounded-full p-2 hover:bg-white/10 transition"
                    aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="rounded-full px-3 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition"
                    aria-label="Voltar para galeria"
                  >
                    Voltar
                  </button>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="flex flex-col gap-6">
                  <div className="relative flex items-center justify-center min-h-[55vh] max-h-[70vh]">
                    {isVideoUrl(displayContent[selectedIndex]) ? (
                      <video
                        src={displayContent[selectedIndex]}
                        controls
                        className="max-h-[70vh] w-auto object-contain"
                      />
                    ) : (
                      <img
                        src={displayContent[selectedIndex]}
                        alt={`Imagem ${selectedIndex + 1}`}
                        className="max-h-[70vh] w-auto object-contain transition-transform duration-200"
                        style={{ transform: `scale(${zoom})` }}
                      />
                    )}
                    {selectedIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex((prev) => (prev === null || prev === 0 ? prev : prev - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                        aria-label="Anterior"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                    )}
                    {selectedIndex < displayContent.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex((prev) =>
                            prev === null || prev === displayContent.length - 1 ? prev : prev + 1
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                        aria-label="Próximo"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    )}
                  </div>

                  {showThumbs && (
                    <div className="flex gap-4 overflow-x-auto py-2">
                      {displayContent.map((item, idx) => (
                        <button
                          key={`${item}-thumb-${idx}`}
                          type="button"
                          onClick={() => setSelectedIndex(idx)}
                          className={`flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border transition-all ${
                            idx === selectedIndex
                              ? "border-white ring-2 ring-white/50"
                              : "border-white/20 hover:border-white/50"
                          }`}
                        >
                          {isVideoUrl(item) ? (
                            <div className="relative w-full h-full">
                              <video src={item} className="w-full h-full object-cover" muted playsInline />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                                <Video className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img src={item} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
