import { useEffect, useMemo, useState } from "react";
import {
  Compass,
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
  streetNumber?: string | null;
  city?: string;
  state?: string;
  zipcode?: string;
}

type ViewMode = "photos" | "video" | "map" | "street" | "tour";
type GeocodingResult = {
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    footway?: string;
    city?: string;
    town?: string;
    village?: string;
  };
};
type ViaCepResult = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

const ITEMS_PER_VIEW = 3;
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ??
  import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY?.trim() ??
  "";

type GoogleGeocodingResult = {
  formatted_address?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
};

type GoogleGeocodingResponse = {
  status?: string;
  error_message?: string;
  results?: GoogleGeocodingResult[];
};

export default function GalleryCarousel({ images, location, streetNumber, city, state, zipcode }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("photos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [streetCoords, setStreetCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [streetCoordsQuery, setStreetCoordsQuery] = useState("");
  const [streetCoordsLoading, setStreetCoordsLoading] = useState(false);

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  const photos = useMemo(() => images.filter((url) => !isVideoUrl(url)), [images]);
  const videos = useMemo(() => images.filter((url) => isVideoUrl(url)), [images]);
  const normalizedZipcode = useMemo(() => zipcode?.replace(/\D/g, "") ?? "", [zipcode]);
  const normalizedStreetNumber = useMemo(() => streetNumber?.toString().trim() ?? "", [streetNumber]);
  const normalizedLocation = useMemo(() => location?.toString().trim() ?? "", [location]);
  const inferredStreetNumber = useMemo(() => {
    const match = normalizedLocation.match(/\b\d{1,6}[A-Za-z]?\b/);
    return match?.[0] ?? "";
  }, [normalizedLocation]);
  const effectiveStreetNumber = normalizedStreetNumber || inferredStreetNumber;
  const addressLine = useMemo(() => {
    if (!normalizedLocation) return effectiveStreetNumber;
    if (!effectiveStreetNumber) return normalizedLocation;
    if (normalizedLocation.includes(effectiveStreetNumber)) return normalizedLocation;
    return `${normalizedLocation}, ${effectiveStreetNumber}`;
  }, [normalizedLocation, effectiveStreetNumber]);
  const mapQuery = useMemo(
    () =>
      [addressLine, zipcode, city, state, "Brasil"]
        .map((item) => item?.toString().trim())
        .filter(Boolean)
        .join(", "),
    [addressLine, zipcode, city, state]
  );

  const mapEmbedSrc = useMemo(
    () => (mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed` : ""),
    [mapQuery]
  );
  const streetViewEmbedSrc = useMemo(
    () =>
      streetCoords
        ? `https://www.google.com/maps?q=&layer=c&cbll=${streetCoords.lat},${streetCoords.lon}&cbp=11,0,0,0,0&output=svembed`
        : "",
    [streetCoords]
  );
  const streetViewOpenUrl = useMemo(
    () =>
      streetCoords
        ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${streetCoords.lat},${streetCoords.lon}`
        : mapQuery
          ? `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(mapQuery)}`
          : "",
    [mapQuery, streetCoords]
  );

  const displayContent = viewMode === "video" ? videos : photos;
  const maxIndex = Math.max(0, displayContent.length - ITEMS_PER_VIEW);

  useEffect(() => {
    setCurrentIndex(0);
  }, [viewMode, displayContent.length]);

  useEffect(() => {
    if (selectedIndex !== null) setZoom(1);
  }, [selectedIndex]);

  useEffect(() => {
    if (viewMode !== "street") {
      setStreetCoordsLoading(false);
      return;
    }

    if (!mapQuery) {
      setStreetCoords(null);
      setStreetCoordsQuery("");
      setStreetCoordsLoading(false);
      return;
    }

    if (streetCoords && streetCoordsQuery === mapQuery) {
      setStreetCoordsLoading(false);
      return;
    }

    const controller = new AbortController();
    const geocodeStreetView = async () => {
      try {
        setStreetCoordsLoading(true);
        const geocodingQueries: Array<{
          query: string;
          expectedStreet?: string;
          expectedCity?: string;
          expectedState?: string;
        }> = [];
        const expectedStreetNumber = effectiveStreetNumber.replace(/\D/g, "");
        const normalizeText = (value: string) =>
          value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[.,/-]/g, " ")
            .replace(/\bav\b/g, "avenida")
            .replace(/\br\b/g, "rua")
            .replace(/\bmal\b/g, "marechal")
            .replace(/\bdr\b/g, "doutor")
            .replace(/\s+/g, " ")
            .trim();
        const scoreCandidate = (
          candidate: {
            displayName?: string;
            road?: string;
            city?: string;
            houseNumber?: string;
          },
          expectedStreet?: string,
          expectedCity?: string
        ) => {
          const displayName = normalizeText(candidate.displayName || "");
          const resultRoad = normalizeText(candidate.road || "");
          const resultCity = normalizeText(candidate.city || "");
          const houseNumber = (candidate.houseNumber || "").replace(/\D/g, "");
          const displayNumbers = ((candidate.displayName || "").match(/\b\d{1,6}[A-Za-z]?\b/g) || [])
            .map((value) => value.replace(/\D/g, ""))
            .filter(Boolean);

          let score = 0;

          if (expectedStreetNumber) {
            if (houseNumber === expectedStreetNumber) {
              score += 140;
            } else if (houseNumber) {
              // Number explicitly returned but different from the property number.
              score -= 90;
            } else if (displayNumbers.includes(expectedStreetNumber)) {
              score += 90;
            } else if (displayNumbers.length > 0) {
              // Result has a different number in text (e.g. 482 when expected 1180).
              score -= 45;
            } else {
              // Result may represent the street segment without explicit house number.
              score -= 5;
            }
          }

          if (expectedStreet) {
            const expectedStreetNorm = normalizeText(expectedStreet);
            if (resultRoad && (resultRoad.includes(expectedStreetNorm) || expectedStreetNorm.includes(resultRoad))) {
              score += 40;
            } else if (displayName.includes(expectedStreetNorm)) {
              score += 25;
            }
          }

          if (expectedCity) {
            const expectedCityNorm = normalizeText(expectedCity);
            if (resultCity === expectedCityNorm) {
              score += 15;
            } else if (displayName.includes(expectedCityNorm)) {
              score += 8;
            }
          }

          return score;
        };
        const scoreOpenStreetMapResult = (
          result: GeocodingResult,
          expectedStreet?: string,
          expectedCity?: string
        ) =>
          scoreCandidate(
            {
              displayName: result.display_name,
              road: result.address?.road || result.address?.pedestrian || result.address?.footway,
              city: result.address?.city || result.address?.town || result.address?.village,
              houseNumber: result.address?.house_number,
            },
            expectedStreet,
            expectedCity
          );
        const scoreGoogleResult = (
          result: GoogleGeocodingResult,
          expectedStreet?: string,
          expectedCity?: string
        ) => {
          const route = result.address_components?.find((component) => component.types.includes("route"))?.long_name;
          const locality =
            result.address_components?.find((component) => component.types.includes("locality"))?.long_name ||
            result.address_components?.find((component) => component.types.includes("administrative_area_level_2"))?.long_name;
          const houseNumber = result.address_components?.find((component) => component.types.includes("street_number"))?.long_name;

          return scoreCandidate(
            {
              displayName: result.formatted_address,
              road: route,
              city: locality,
              houseNumber,
            },
            expectedStreet,
            expectedCity
          );
        };

        if (normalizedZipcode.length === 8) {
          const formattedZipcode = `${normalizedZipcode.slice(0, 5)}-${normalizedZipcode.slice(5)}`;

          try {
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${normalizedZipcode}/json/`, {
              signal: controller.signal,
              headers: {
                Accept: "application/json",
              },
            });

            if (viaCepResponse.ok) {
              const viaCepData = (await viaCepResponse.json()) as ViaCepResult;

              if (!viaCepData.erro) {
                const cityFromCep = (viaCepData.localidade || city || "").trim();
                const stateFromCep = (viaCepData.uf || state || "").trim();
                const streetFromCep = (viaCepData.logradouro || "").trim();
                const mainAddress = (addressLine || streetFromCep || viaCepData.bairro || "").trim();
                const cepFromCep = (viaCepData.cep || formattedZipcode).trim();

                if (streetFromCep && cityFromCep) {
                  const streetFromCepWithNumber = effectiveStreetNumber
                    ? `${streetFromCep}, ${effectiveStreetNumber}`
                    : streetFromCep;
                  geocodingQueries.push({
                    query: [streetFromCepWithNumber, cityFromCep, stateFromCep, cepFromCep, "Brasil"]
                      .filter(Boolean)
                      .join(", "),
                    expectedStreet: streetFromCep,
                    expectedCity: cityFromCep,
                    expectedState: stateFromCep,
                  });
                }

                if (mainAddress && cityFromCep) {
                  geocodingQueries.push({
                    query: [mainAddress, cityFromCep, stateFromCep, cepFromCep, "Brasil"]
                      .filter(Boolean)
                      .join(", "),
                    expectedStreet: streetFromCep || normalizedLocation,
                    expectedCity: cityFromCep,
                    expectedState: stateFromCep,
                  });
                }

                geocodingQueries.push({
                  query: [cepFromCep, cityFromCep, stateFromCep, "Brasil"].filter(Boolean).join(", "),
                  expectedStreet: streetFromCep || normalizedLocation,
                  expectedCity: cityFromCep,
                  expectedState: stateFromCep,
                });
              } else {
                geocodingQueries.push({
                  query: [formattedZipcode, "Brasil"].join(", "),
                  expectedStreet: normalizedLocation,
                  expectedCity: city,
                  expectedState: state,
                });
              }
            } else {
              geocodingQueries.push({
                query: [formattedZipcode, "Brasil"].join(", "),
                expectedStreet: normalizedLocation,
                expectedCity: city,
                expectedState: state,
              });
            }
          } catch {
            if (!controller.signal.aborted) {
              geocodingQueries.push({
                query: [formattedZipcode, "Brasil"].join(", "),
                expectedStreet: normalizedLocation,
                expectedCity: city,
                expectedState: state,
              });
            }
          }
        }

        geocodingQueries.push({
          query: mapQuery,
          expectedStreet: normalizedLocation,
          expectedCity: city,
          expectedState: state,
        });

        const seenQueries = new Set<string>();
        const uniqueQueries = geocodingQueries.filter((item) => {
          const query = item.query.trim();
          if (!query || seenQueries.has(query)) return false;
          seenQueries.add(query);
          return true;
        });

        let bestCandidate: { lat: string; lon: string; score: number } | null = null;
        if (GOOGLE_MAPS_API_KEY) {
          for (const item of uniqueQueries) {
            const googleUrl = new URL("https://maps.googleapis.com/maps/api/geocode/json");
            googleUrl.searchParams.set("address", item.query);
            googleUrl.searchParams.set("key", GOOGLE_MAPS_API_KEY);

            const componentFilters = [
              "country:BR",
              normalizedZipcode.length === 8 ? `postal_code:${normalizedZipcode}` : "",
              item.expectedCity ? `locality:${item.expectedCity}` : "",
              item.expectedState ? `administrative_area:${item.expectedState}` : "",
            ].filter(Boolean);

            if (componentFilters.length > 0) {
              googleUrl.searchParams.set("components", componentFilters.join("|"));
            }

            const googleResponse = await fetch(googleUrl.toString(), {
              signal: controller.signal,
              headers: {
                Accept: "application/json",
              },
            });

            if (!googleResponse.ok) {
              continue;
            }

            const googleData = (await googleResponse.json()) as GoogleGeocodingResponse;
            if (googleData.status !== "OK" || !googleData.results?.length) {
              continue;
            }

            const scoredGoogleResults = googleData.results
              .filter(
                (result): result is GoogleGeocodingResult & { geometry: { location: { lat: number; lng: number } } } =>
                  typeof result.geometry?.location?.lat === "number" &&
                  typeof result.geometry?.location?.lng === "number"
              )
              .map((result) => ({
                ...result,
                score: scoreGoogleResult(result, item.expectedStreet, item.expectedCity),
              }))
              .sort((a, b) => b.score - a.score);

            const firstGoogleResult = scoredGoogleResults[0];
            if (!firstGoogleResult) {
              continue;
            }

            if (!bestCandidate || firstGoogleResult.score > bestCandidate.score) {
              bestCandidate = {
                lat: String(firstGoogleResult.geometry.location.lat),
                lon: String(firstGoogleResult.geometry.location.lng),
                score: firstGoogleResult.score,
              };
            }

            if (firstGoogleResult.score >= 110) {
              setStreetCoords({
                lat: String(firstGoogleResult.geometry.location.lat),
                lon: String(firstGoogleResult.geometry.location.lng),
              });
              setStreetCoordsQuery(mapQuery);
              return;
            }
          }
        }

        for (const item of uniqueQueries) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=10&countrycodes=br&q=${encodeURIComponent(
              item.query
            )}`,
            {
              signal: controller.signal,
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            continue;
          }

          const results = (await response.json()) as GeocodingResult[];
          const scoredResults = results
            .filter((result): result is GeocodingResult & { lat: string; lon: string } => Boolean(result.lat && result.lon))
            .map((result) => ({
              ...result,
              score: scoreOpenStreetMapResult(result, item.expectedStreet, item.expectedCity),
            }))
            .sort((a, b) => b.score - a.score);

          const firstResult = scoredResults[0];
          if (!firstResult) {
            continue;
          }

          if (!bestCandidate || firstResult.score > bestCandidate.score) {
            bestCandidate = {
              lat: firstResult.lat,
              lon: firstResult.lon,
              score: firstResult.score,
            };
          }

          if (firstResult.score >= 110) {
            setStreetCoords({ lat: firstResult.lat, lon: firstResult.lon });
            setStreetCoordsQuery(mapQuery);
            return;
          }
        }

        const minimumAcceptedScore = expectedStreetNumber ? 45 : 20;
        if (bestCandidate && bestCandidate.score >= minimumAcceptedScore) {
          setStreetCoords({ lat: bestCandidate.lat, lon: bestCandidate.lon });
          setStreetCoordsQuery(mapQuery);
          return;
        }

        setStreetCoords(null);
      } catch {
        if (!controller.signal.aborted) {
          setStreetCoords(null);
          setStreetCoordsQuery("");
        }
      } finally {
        if (!controller.signal.aborted) {
          setStreetCoordsLoading(false);
        }
      }
    };

    void geocodeStreetView();

    return () => controller.abort();
  }, [viewMode, mapQuery, streetCoords, streetCoordsQuery, normalizedZipcode, addressLine, effectiveStreetNumber, normalizedLocation, city, state]);

  const visibleItems = displayContent.slice(currentIndex, currentIndex + ITEMS_PER_VIEW);

  const openPreview = (absoluteIndex: number) => {
    setSelectedIndex(absoluteIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
        <Button
          variant={viewMode === "photos" ? "default" : "outline"}
          onClick={() => setViewMode("photos")}
          className={`shrink-0 justify-center rounded-full ${viewMode === "photos" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Image className="mr-2 h-4 w-4" />
          Fotos ({photos.length})
        </Button>

        {videos.length > 0 ? (
          <Button
            variant={viewMode === "video" ? "default" : "outline"}
            onClick={() => setViewMode("video")}
            className={`shrink-0 justify-center rounded-full ${viewMode === "video" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
          >
            <Video className="mr-2 h-4 w-4" />
            Vídeo ({videos.length})
          </Button>
        ) : null}

        <Button
          variant={viewMode === "map" ? "default" : "outline"}
          onClick={() => setViewMode("map")}
          className={`shrink-0 justify-center rounded-full ${viewMode === "map" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Map className="mr-2 h-4 w-4" />
          Mapa
        </Button>

        <Button
          variant={viewMode === "street" ? "default" : "outline"}
          onClick={() => setViewMode("street")}
          className={`shrink-0 justify-center rounded-full ${viewMode === "street" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Compass className="mr-2 h-4 w-4" />
          Street View
        </Button>

        <Button
          variant={viewMode === "tour" ? "default" : "outline"}
          onClick={() => setViewMode("tour")}
          className={`shrink-0 justify-center rounded-full ${viewMode === "tour" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        >
          <Scan className="mr-2 h-4 w-4" />
          Tour
        </Button>
      </div>

      {(viewMode === "photos" || viewMode === "video") && displayContent.length > 0 ? (
        <div className="surface-card border-slate-200/80 p-4">
          <div className="sm:hidden">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {displayContent.map((item, absoluteIndex) => (
                <button
                  key={`${item}-${absoluteIndex}`}
                  type="button"
                  onClick={() => openPreview(absoluteIndex)}
                  className="group relative aspect-[4/3] w-[86%] min-w-[86%] snap-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
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
                      loading={absoluteIndex === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
            {displayContent.length > 1 ? (
              <p className="mt-3 text-xs text-slate-500">Deslize para o lado para ver mais fotos.</p>
            ) : null}
          </div>

          <div className="relative hidden sm:block">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                        loading={idx === 0 ? "eager" : "lazy"}
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
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/35 bg-slate-950/55 p-2 text-white shadow-lg transition hover:bg-slate-950/75"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            {displayContent.length > ITEMS_PER_VIEW && currentIndex < maxIndex ? (
              <button
                onClick={() => setCurrentIndex((previous) => Math.min(maxIndex, previous + 1))}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/35 bg-slate-950/55 p-2 text-white shadow-lg transition hover:bg-slate-950/75"
                aria-label="Próximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <p className="mt-3 hidden text-right text-xs text-slate-500 sm:block">
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
          {mapQuery ? (
            <div className="h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-[380px] lg:h-[460px]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedSrc}
                title="Localização do imóvel"
              />
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 sm:h-[380px] lg:h-[460px]">
              Endereço indisponível para exibir no mapa.
            </div>
          )}
        </div>
      ) : null}

      {viewMode === "street" ? (
        <div className="surface-card overflow-hidden border-slate-200/80 p-2">
          {mapQuery && streetCoordsLoading ? (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 sm:h-[380px] lg:h-[460px]">
              Carregando Street View...
            </div>
          ) : mapQuery && streetViewEmbedSrc ? (
            <div className="h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-[380px] lg:h-[460px]">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={streetViewEmbedSrc}
                title="Street View do imóvel"
              />
            </div>
          ) : mapQuery ? (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-600 sm:h-[380px] lg:h-[460px]">
              <p>Street View indisponível no momento para este endereço.</p>
              <a
                href={streetViewOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Abrir Street View no Google Maps
              </a>
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 sm:h-[380px] lg:h-[460px]">
              Endereço indisponível para exibir o Street View.
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
        <DialogContent hideClose className="max-h-[90vh] max-w-[96vw] overflow-y-auto border-none bg-transparent p-0 shadow-none sm:max-w-[92vw]">
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

              <div className="relative flex min-h-[40vh] items-center justify-center md:min-h-[52vh]">
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

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {displayContent.map((item, idx) => (
                  <button
                    key={`${item}-thumb-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition sm:h-16 sm:w-24 ${
                      idx === selectedIndex ? "border-white" : "border-white/25"
                    }`}
                  >
                    {isVideoUrl(item) ? (
                      <video src={item} className="h-full w-full object-cover" muted playsInline />
                    ) : (
                      <img src={item} alt={`Miniatura ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
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
