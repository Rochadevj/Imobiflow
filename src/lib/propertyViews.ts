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

// Registrar visualização de imóvel
// Nota: A verificação de visualização recente é feita apenas para evitar chamadas desnecessárias
// O INSERT ainda funciona pois há política que permite inserção
export const trackPropertyView = async (propertyId: string): Promise<boolean> => {
  try {
    const ipAddress = await getUserIP();
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;

    // Registrar nova visualização (a verificação de duplicatas pode ser feita no banco)
    const { error } = await supabase
      .from('property_views')
      .insert({
        property_id: propertyId,
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId,
      });

    if (error) {
      // Se for erro de política, provavelmente já existe visualização recente
      console.log('Visualização já registrada ou erro:', error.message);
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

// Obter imóveis mais visitados usando função segura do banco
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

    // Usar função segura do banco que retorna apenas dados agregados
    const { data: viewData, error: viewError } = await supabase
      .rpc('get_most_viewed_properties', {
        p_limit: limit,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString()
      });

    if (viewError) {
      console.error('Erro ao buscar visualizações:', viewError);
      return [];
    }

    if (!viewData || viewData.length === 0) {
      return [];
    }

    const propertyIds = viewData.map((v: { property_id: string }) => v.property_id);

    // Buscar informações dos imóveis
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select(`
        id,
        title,
        property_type,
        price,
        location,
        city,
        created_at,
        property_images(image_url, is_primary)
      `)
      .in('id', propertyIds);

    if (propError) {
      console.error('Erro ao buscar propriedades:', propError);
      return [];
    }

    // Criar mapa de visualizações
    const viewMap = new Map<string, number>();
    viewData.forEach((v: { property_id: string; unique_views: number }) => {
      viewMap.set(v.property_id, Number(v.unique_views));
    });

    // Montar resultado final
    const result: PropertyViewStats[] = properties?.map(prop => {
      const uniqueViews = viewMap.get(prop.id) || 0;
      const images = prop.property_images as Array<{ image_url: string; is_primary: boolean }> || [];
      const primaryImage = images.find(img => img.is_primary);
      
      return {
        property_id: prop.id,
        title: prop.title,
        property_type: prop.property_type,
        price: prop.price,
        location: prop.location,
        city: prop.city,
        unique_views: uniqueViews,
        total_views: uniqueViews, // Usando unique views
        last_viewed_at: prop.created_at, // Não temos mais acesso direto às datas
        primary_image: primaryImage?.image_url || images[0]?.image_url
      };
    }).sort((a, b) => b.unique_views - a.unique_views) || [];

    return result;
  } catch (error) {
    console.error('Erro ao obter imóveis mais visitados:', error);
    return [];
  }
};

// Obter total de visualizações de um imóvel específico usando função segura
export const getPropertyViewCount = async (propertyId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .rpc('get_property_view_count', { p_property_id: propertyId });

    if (error) {
      console.error('Erro ao contar visualizações:', error);
      return 0;
    }

    return Number(data) || 0;
  } catch (error) {
    console.error('Erro ao obter contagem de visualizações:', error);
    return 0;
  }
};
