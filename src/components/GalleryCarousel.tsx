import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Image,
  Map,
  Scan,
  Video,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface GalleryCarouselProps {
  images: string[];
  location?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

type ViewMode = "photos" | "video" | "map" | "tour";

const ITEMS_PER_VIEW = 3;

export default function GalleryCarousel({ images, location, city, state }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("photos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  const photos = useMemo(() => images.filter((url) => !isVideoUrl(url)), [images]);
  const videos = useMemo(() => images.filter((url) => isVideoUrl(url)), [images]);
  const displayContent = viewMode === "video" ? videos : photos;
  const maxIndex = Math.max(0, displayContent.length - ITEMS_PER_VIEW);

  useEffect(() => {
    setCurrentIndex(0);
  }, [viewMode, displayContent.length]);

  useEffect(() => {
    if (selectedIndex !== null) setZoom(1);
  }, [selectedIndex]);

  const visibleItems = displayContent.slice(currentIndex, currentIndex + ITEMS_PER_VIEW);

  const openPreview = (absoluteIndex: number) => {
    setSelectedIndex(absoluteIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={viewMode === "photos" ? "default" : "outline"}
          onClick={() => setViewMode("photos")}
          className={`rounded-full ${viewMode === "photos" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Image className="mr-2 h-4 w-4" />
          Fotos ({photos.length})
        </Button>

        {videos.length > 0 ? (
          <Button
            variant={viewMode === "video" ? "default" : "outline"}
            onClick={() => setViewMode("video")}
            className={`rounded-full ${viewMode === "video" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
          >
            <Video className="mr-2 h-4 w-4" />
            Vídeo ({videos.length})
          </Button>
        ) : null}

        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          onClick={() => setViewMode("map")}
          className={`rounded-full ${viewMode === "map" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Map className="mr-2 h-4 w-4" />
          Mapa
        </Button>

        <Button
          variant={viewMode === "tour" ? "default" : "outline"}
          onClick={() => setViewMode("tour")}
          className={`rounded-full ${viewMode === "tour" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Scan className="mr-2 h-4 w-4" />
          Tour
        </Button>
      </div>

      {(viewMode === "photos" || viewMode === "video") && displayContent.length > 0 ? (
        <div className="surface-card border-slate-200/80 p-4">
          <div className="relative">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {visibleItems.map((item, idx) => {
                const absoluteIndex = currentIndex + idx;
                return (
                  <button
                    key={`${item}-${absoluteIndex}`}
                    type="button"
                    onClick={() => openPreview(absoluteIndex)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    {isVideoUrl(item) ? (
                      <>
                        <video src={item} className="h-full w-full object-cover" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
                          <span className="rounded-full border border-white/40 bg-white/20 p-3 text-white">
                            <Video className="h-5 w-5" />
                          </span>
                        </div>
                      </>
                    ) : (
                      <img
                        src={item}
                        alt={`Imagem ${absoluteIndex + 1}`}
                        loading="eager"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {displayContent.length > ITEMS_PER_VIEW && currentIndex > 0 ? (
              <button
                onClick={() => setCurrentIndex((previous) => Math.max(0, previous - 1))}
                className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/35 bg-slate-950/55 p-2 text-white shadow-lg transition hover:bg-slate-950/75"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            {displayContent.length > ITEMS_PER_VIEW && currentIndex < maxIndex ? (
              <button
                onClick={() => setCurrentIndex((previous) => Math.min(maxIndex, previous + 1))}
                className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/35 bg-slate-950/55 p-2 text-white shadow-lg transition hover:bg-slate-950/75"
                aria-label="Próximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <p className="mt-3 text-right text-xs text-slate-500">
            Exibindo {Math.min(currentIndex + 1, displayContent.length)}-
            {Math.min(currentIndex + ITEMS_PER_VIEW, displayContent.length)} de {displayContent.length}
          </p>
        </div>
      ) : null}

      {viewMode === "photos" && photos.length === 0 ? (
        <div className="surface-card border-slate-200/80 py-16 text-center text-sm text-slate-500">
          Nenhuma foto disponível.
        </div>
      ) : null}

      {viewMode === "video" && videos.length === 0 ? (
        <div className="surface-card border-slate-200/80 py-16 text-center text-sm text-slate-500">
          Nenhum vídeo disponível.
        </div>
      ) : null}

      {viewMode === "map" ? (
        <div className="surface-card overflow-hidden border-slate-200/80 p-2">
          {location ? (
            <div className="h-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
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
            <div className="flex h-[460px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              Endereço indisponível para exibir no mapa.
            </div>
          )}
        </div>
      ) : null}

      {viewMode === "tour" ? (
        <div className="surface-card border-slate-200/80 py-16 text-center">
          <p className="text-sm text-slate-500">Tour virtual em breve.</p>
        </div>
      ) : null}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedIndex(null);
            setZoom(1);
          }
        }}
      >
        <DialogContent hideClose className="max-w-[92vw] border-none bg-transparent p-0 shadow-none">
          {selectedIndex !== null ? (
            <div className="relative rounded-2xl border border-white/20 bg-slate-950/92 p-3 md:p-5">
              <div className="mb-3 flex items-center justify-between text-white">
                <p className="text-xs text-white/75">
                  {selectedIndex + 1}/{displayContent.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom((value) => Math.min(value + 0.2, 2.5))}
                    disabled={isVideoUrl(displayContent[selectedIndex])}
                    className="rounded-full border border-white/25 bg-white/5 p-2 text-white transition hover:bg-white/15 disabled:opacity-40"
                    aria-label="Aumentar zoom"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setZoom((value) => Math.max(value - 0.2, 1))}
                    disabled={isVideoUrl(displayContent[selectedIndex])}
                    className="rounded-full border border-white/25 bg-white/5 p-2 text-white transition hover:bg-white/15 disabled:opacity-40"
                    aria-label="Reduzir zoom"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-white/25 bg-white/5 p-2 text-white transition hover:bg-white/15"
                    aria-label="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="relative flex min-h-[52vh] items-center justify-center">
                {isVideoUrl(displayContent[selectedIndex]) ? (
                  <video
                    src={displayContent[selectedIndex]}
                    controls
                    className="max-h-[72vh] w-auto rounded-xl object-contain"
                  />
                ) : (
                  <img
                    src={displayContent[selectedIndex]}
                    alt={`Imagem ${selectedIndex + 1}`}
                    className="max-h-[72vh] w-auto rounded-xl object-contain transition-transform duration-200"
                    style={{ transform: `scale(${zoom})` }}
                  />
                )}

                {selectedIndex > 0 ? (
                  <button
                    onClick={() => setSelectedIndex((value) => (value === null ? value : value - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 p-2 text-white transition hover:bg-white/20"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                ) : null}

                {selectedIndex < displayContent.length - 1 ? (
                  <button
                    onClick={() => setSelectedIndex((value) => (value === null ? value : value + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 p-2 text-white transition hover:bg-white/20"
                    aria-label="Proximo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {displayContent.map((item, idx) => (
                  <button
                    key={`${item}-thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-16 w-24 overflow-hidden rounded-lg border transition ${
                      idx === selectedIndex ? "border-white" : "border-white/25"
                    }`}
                  >
                    {isVideoUrl(item) ? (
                      <video src={item} className="h-full w-full object-cover" muted playsInline />
                    ) : (
                      <img src={item} alt={`Miniatura ${idx + 1}`} className="h-full w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
