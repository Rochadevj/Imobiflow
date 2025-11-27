import { supabase } from "@/integrations/supabase/client";

// Gerar um ID de sessão único para o navegador
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  
  return sessionId;
};

// Obter IP do usuário (simulado - em produção usar API externa ou backend)
const getUserIP = async (): Promise<string> => {
  try {
    // Em produção, você pode usar serviços como ipify.org, ipapi.co, etc.
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    // Fallback: usar hash do user agent + timestamp como identificador único
    const userAgent = navigator.userAgent;
    const hash = btoa(`${userAgent}_${new Date().toDateString()}`);
    return hash.substring(0, 45); // Limitar tamanho
  }
};

// Verificar se já existe visualização recente deste IP para este imóvel
const hasRecentView = async (propertyId: string, ipAddress: string): Promise<boolean> => {
  try {
    // Verificar se há visualização deste IP nas últimas 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const { data, error } = await supabase
      .from('property_views')
      .select('id')
      .eq('property_id', propertyId)
      .eq('ip_address', ipAddress)
      .gte('viewed_at', oneDayAgo.toISOString())
      .limit(1);

    if (error) {
      console.error('Erro ao verificar visualização recente:', error);
      return false;
    }

    return (data && data.length > 0);
  } catch (error) {
    console.error('Erro ao verificar visualização:', error);
    return false;
  }
};

// Registrar visualização de imóvel
export const trackPropertyView = async (propertyId: string): Promise<boolean> => {
  try {
    const ipAddress = await getUserIP();
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;

    // Verificar se já existe visualização recente
    const alreadyViewed = await hasRecentView(propertyId, ipAddress);
    
    if (alreadyViewed) {
      console.log('Visualização já registrada nas últimas 24h');
      return false;
    }

    // Registrar nova visualização
    const { error } = await supabase
      .from('property_views')
      .insert({
        property_id: propertyId,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
      });

    if (error) {
      console.error('Erro ao registrar visualização:', error);
      return false;
    }

    console.log('Visualização registrada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao rastrear visualização:', error);
    return false;
  }
};

// Interface para estatísticas de visualizações
export interface PropertyViewStats {
  property_id: string;
  title: string;
  property_type: string;
  price: number;
  location: string;
  city: string;
  unique_views: number;
  total_views: number;
  last_viewed_at: string;
  primary_image?: string;
}

// Filtros de período
export type ViewPeriod = 'today' | 'week' | 'month' | 'year' | 'all';
export interface ViewPeriodOptions {
  month?: number; // 1-12
  year?: number; // e.g., 2025
}

// Obter imóveis mais visitados
export const getMostViewedProperties = async (
  period: ViewPeriod = 'month',
  limit: number = 10,
  options: ViewPeriodOptions = {}
): Promise<PropertyViewStats[]> => {
  try {
    let startDate = new Date();
    let endDate = new Date();
    
    // Normalizar para usar intervalo [startDate, endDate]
    endDate.setHours(23, 59, 59, 999);
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        {
          // Semana atual: do início da semana (segunda) até hoje
          const d = new Date();
          const day = d.getDay(); // 0 domingo ... 6 sábado
          const diffToMonday = (day === 0 ? -6 : 1 - day); // leva ao Monday
          startDate = new Date(d);
          startDate.setDate(d.getDate() + diffToMonday);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(d);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      case 'month':
        {
          // Mês específico se fornecido, senão mês atual
          const month = options.month ?? (new Date().getMonth() + 1); // 1-12
          const year = options.year ?? new Date().getFullYear();
          startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
          endDate = new Date(year, month, 0, 23, 59, 59, 999); // último dia do mês
        }
        break;
      case 'year':
        {
          // Ano específico se fornecido, senão ano atual
          const y = options.year ?? new Date().getFullYear();
          startDate = new Date(y, 0, 1, 0, 0, 0, 0);
          endDate = new Date(y, 11, 31, 23, 59, 59, 999);
        }
        break;
      case 'all':
        startDate = new Date('2000-01-01');
        endDate = new Date();
        break;
    }

    // Query para buscar estatísticas de visualizações
    const { data: viewData, error: viewError } = await supabase
      .from('property_views')
      .select('property_id, ip_address, viewed_at')
      .gte('viewed_at', startDate.toISOString())
      .lte('viewed_at', endDate.toISOString());

    if (viewError) {
      console.error('Erro ao buscar visualizações:', viewError);
      return [];
    }

    // Agrupar por property_id e contar IPs únicos
    const viewStats = new Map<string, { uniqueIps: Set<string>, lastView: string }>();
    
    viewData?.forEach(view => {
      if (!viewStats.has(view.property_id)) {
        viewStats.set(view.property_id, {
          uniqueIps: new Set(),
          lastView: view.viewed_at
        });
      }
      const stats = viewStats.get(view.property_id)!;
      stats.uniqueIps.add(view.ip_address);
      if (new Date(view.viewed_at) > new Date(stats.lastView)) {
        stats.lastView = view.viewed_at;
      }
    });

    // Ordenar por número de visualizações únicas
    const sortedPropertyIds = Array.from(viewStats.entries())
      .sort((a, b) => b[1].uniqueIps.size - a[1].uniqueIps.size)
      .slice(0, limit)
      .map(([id]) => id);

    if (sortedPropertyIds.length === 0) {
      return [];
    }

    // Buscar informações dos imóveis, restringindo ao período de cadastro quando period for mês/ano
    let propertiesQuery = supabase
      .from('properties')
      .select(`
        id,
        title,
        property_type,
        price,
        location,
        city,
        created_at,
        property_images!inner(image_url, is_primary)
      `)
      .in('id', sortedPropertyIds);

    if (period === 'month' || period === 'year') {
      propertiesQuery = propertiesQuery
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
    }

    const { data: properties, error: propError } = await propertiesQuery;

    if (propError) {
      console.error('Erro ao buscar propriedades:', propError);
      return [];
    }

    // Montar resultado final
    const result: PropertyViewStats[] = properties?.map(prop => {
      const stats = viewStats.get(prop.id)!;
      const primaryImage = prop.property_images.find(img => img.is_primary);
      
      return {
        property_id: prop.id,
        title: prop.title,
        property_type: prop.property_type,
        price: prop.price,
        location: prop.location,
        city: prop.city,
        unique_views: stats.uniqueIps.size,
        total_views: stats.uniqueIps.size, // Usando unique views
        last_viewed_at: stats.lastView,
        primary_image: primaryImage?.image_url || prop.property_images[0]?.image_url
      };
    }).sort((a, b) => b.unique_views - a.unique_views) || [];

    return result;
  } catch (error) {
    console.error('Erro ao obter imóveis mais visitados:', error);
    return [];
  }
};

// Obter total de visualizações de um imóvel específico
export const getPropertyViewCount = async (propertyId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('property_views')
      .select('ip_address', { count: 'exact' })
      .eq('property_id', propertyId);

    if (error) {
      console.error('Erro ao contar visualizações:', error);
      return 0;
    }

    // Contar IPs únicos
    const uniqueIps = new Set(data?.map(v => v.ip_address) || []);
    return uniqueIps.size;
  } catch (error) {
    console.error('Erro ao obter contagem de visualizações:', error);
    return 0;
  }
};
