import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, MapPin, TrendingUp } from "lucide-react";
import { getMostViewedProperties, PropertyViewStats, ViewPeriod } from "@/lib/propertyViews";

const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - index);

export default function MostViewedProperties() {
  const [properties, setProperties] = useState<PropertyViewStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<ViewPeriod>("month");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const periods: { value: ViewPeriod; label: string }[] = [
    { value: "today", label: "Hoje" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "year", label: "Ano" },
    { value: "all", label: "Todos" },
  ];

  const totalViews = useMemo(
    () => properties.reduce((sum, property) => sum + property.total_views, 0),
    [properties]
  );

  const loadMostViewed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMostViewedProperties(selectedPeriod, 10, {
        month: selectedPeriod === "month" ? selectedMonth : undefined,
        year: selectedPeriod === "month" || selectedPeriod === "year" ? selectedYear : undefined,
      });
      setProperties(data);
    } catch (error) {
      console.error("Erro ao carregar imóveis mais visitados:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedPeriod, selectedYear]);

  useEffect(() => {
    void loadMostViewed();
  }, [loadMostViewed]);

  useEffect(() => {
    const handleRefresh = () => {
      void loadMostViewed();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadMostViewed();
      }
    };

    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadMostViewed]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartamento: "Apartamento",
      casa: "Casa",
      terreno: "Terreno",
      comercial: "Comercial",
      industrial: "Industrial",
      sala_comercial: "Sala Comercial",
      loja: "Loja",
      galpao: "Galpão",
      chacara: "Chácara",
      sitio: "Sítio",
    };

    return types[type] || type.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const emptyStateText =
    selectedPeriod === "today"
      ? "Nenhum imóvel foi visualizado hoje."
      : selectedPeriod === "week"
        ? "Nenhum imóvel foi visualizado nesta semana."
        : selectedPeriod === "month"
          ? "Nenhum imóvel foi visualizado neste mês."
          : selectedPeriod === "year"
            ? "Nenhum imóvel foi visualizado neste ano."
            : "Ainda não há visualizações registradas.";

  return (
    <Card className="w-full border-slate-200/80 bg-white/95 shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <TrendingUp className="h-5 w-5 text-accent" />
              Imóveis Mais Visitados
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-600">
              Ranking por acessos reais aos detalhes dos imóveis, atualizado pelos filtros de período.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={selectedPeriod === period.value ? "bg-accent text-white hover:bg-accent/90" : "border-slate-200"}
              >
                <Calendar className="mr-1 h-3 w-3" />
                {period.label}
              </Button>
            ))}

            {selectedPeriod === "month" && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(Number(event.target.value))}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-accent focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleString("pt-BR", { month: "long" })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-accent focus:outline-none"
                >
                  {AVAILABLE_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPeriod === "year" && (
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-accent focus:outline-none"
              >
                {AVAILABLE_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex animate-pulse items-center gap-4 rounded-lg border border-slate-200 p-3">
                <div className="h-20 w-20 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <Eye className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="mb-1 text-lg font-medium">Nenhuma visualização registrada</p>
            <p className="text-sm">{emptyStateText}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.map((property, index) => (
              <Link
                key={property.property_id}
                to={`/property/${property.property_code || property.property_id}`}
                className="block rounded-lg transition-colors hover:bg-accent/5"
              >
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-3 transition-all hover:border-accent hover:shadow-md">
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                            ? "bg-slate-400 text-white"
                            : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {index + 1}º
                    </div>
                  </div>

                  <div className="flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                    <img
                      src={property.primary_image || "/placeholder.jpg"}
                      alt={property.title}
                      className="h-20 w-20 object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h4 className="line-clamp-1 text-sm font-semibold text-foreground">{property.title}</h4>
                      <Badge variant="outline" className="flex-shrink-0 border-slate-200 text-xs text-slate-700">
                        {getPropertyTypeLabel(property.property_type)}
                      </Badge>
                    </div>

                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">
                        {property.location}, {property.city}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="text-sm font-bold text-accent">{formatPrice(property.price)}</div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <Eye className="h-3 w-3" />
                        <span>
                          {property.total_views} {property.total_views === 1 ? "visualização" : "visualizações"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
              <div>
                <div className="text-2xl font-bold text-primary">{properties.length}</div>
                <div className="text-xs text-muted-foreground">Imóveis ranqueados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{totalViews}</div>
                <div className="text-xs text-muted-foreground">Total de visualizações</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-emerald-600">
                  {properties.length > 0 ? Math.round(totalViews / properties.length) : 0}
                </div>
                <div className="text-xs text-muted-foreground">Média por imóvel</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
