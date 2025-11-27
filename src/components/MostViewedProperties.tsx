import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, Calendar, MapPin } from "lucide-react";
import { getMostViewedProperties, PropertyViewStats, ViewPeriod } from "@/lib/propertyViews";
import { Link } from "react-router-dom";

export default function MostViewedProperties() {
  const [properties, setProperties] = useState<PropertyViewStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<ViewPeriod>('month');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const periods: { value: ViewPeriod; label: string }[] = [
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
    { value: 'year', label: 'Ano' },
    { value: 'all', label: 'Todos' },
  ];

  useEffect(() => {
    loadMostViewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedMonth, selectedYear]);

  const loadMostViewed = async () => {
    setLoading(true);
    try {
      const data = await getMostViewedProperties(selectedPeriod, 10, {
        month: selectedPeriod === 'month' ? selectedMonth : undefined,
        year: selectedPeriod === 'month' || selectedPeriod === 'year' ? selectedYear : undefined,
      });
      setProperties(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis mais visitados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
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
      sitio: "Sítio"
    };
    return types[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Não exibir tempo da última visualização conforme solicitado

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Imóveis Mais Visitados
            </CardTitle>
          </div>
          
          <div className="flex gap-2 flex-wrap items-center">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={selectedPeriod === period.value ? "bg-accent hover:bg-accent/90" : ""}
              >
                <Calendar className="w-3 h-3 mr-1" />
                {period.label}
              </Button>
            ))}

            {selectedPeriod === 'month' && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                    <option key={m} value={m}>
                      {new Date(2000, m-1).toLocaleString('pt-BR', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[new Date().getFullYear()].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedPeriod === 'year' && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[new Date().getFullYear()].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg border">
                <div className="w-20 h-20 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium mb-1">Nenhuma visualização registrada</p>
            <p className="text-sm">
              {selectedPeriod === 'today' ? 'Nenhum imóvel foi visualizado hoje' : 
               selectedPeriod === 'week' ? 'Nenhum imóvel foi visualizado esta semana' :
               selectedPeriod === 'month' ? 'Nenhum imóvel foi visualizado este mês' :
               'Ainda não há visualizações registradas'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.map((property, index) => (
              <Link
                key={property.property_id}
                to={`/property/${property.property_id}`}
                className="block hover:bg-accent/5 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-accent hover:shadow-md transition-all">
                  {/* Ranking Badge */}
                  <div className="flex-shrink-0">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {index + 1}º
                    </div>
                  </div>

                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={property.primary_image || '/placeholder.jpg'}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                        {property.title}
                      </h4>
                      <Badge variant="outline" className="flex-shrink-0 text-xs">
                        {getPropertyTypeLabel(property.property_type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{property.location}, {property.city}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="font-bold text-accent text-sm">
                        {formatPrice(property.price)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-primary font-semibold">
                          <Eye className="w-3 h-3" />
                          <span>{property.unique_views} {property.unique_views === 1 ? 'visita' : 'visitas'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && properties.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {properties.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Imóveis Visitados
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {properties.reduce((sum, p) => sum + p.unique_views, 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total de Visitas
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-green-600">
                  {properties.length > 0 
                    ? Math.round(properties.reduce((sum, p) => sum + p.unique_views, 0) / properties.length)
                    : 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Média por Imóvel
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
