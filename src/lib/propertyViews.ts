import { supabase } from "@/integrations/supabase/client";

const VIEW_THROTTLE_MS = 30000;
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("visitor_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }

  return sessionId;
};

const getViewThrottleKey = (propertyId: string) => `property_view_last_${propertyId}`;

const shouldThrottlePropertyView = (propertyId: string): boolean => {
  const lastTrackedAt = sessionStorage.getItem(getViewThrottleKey(propertyId));

  if (!lastTrackedAt) {
    return false;
  }

  return Date.now() - Number(lastTrackedAt) < VIEW_THROTTLE_MS;
};

const markPropertyViewAttempt = (propertyId: string) => {
  sessionStorage.setItem(getViewThrottleKey(propertyId), String(Date.now()));
};

const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "unknown";
  } catch (error) {
    console.error("Erro ao obter IP:", error);
    const userAgent = navigator.userAgent;
    const hash = btoa(`${userAgent}_${new Date().toDateString()}`);
    return hash.substring(0, 45);
  }
};

export const trackPropertyView = async (propertyId: string): Promise<boolean> => {
  try {
    if (shouldThrottlePropertyView(propertyId)) {
      return false;
    }

    markPropertyViewAttempt(propertyId);

    const ipAddress = await getUserIP();
    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;

    const { data, error } = await supabase.rpc("record_property_view", {
      p_property_id: propertyId,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
      p_session_id: sessionId,
    });

    if (error) throw error;

    return Boolean(data);
  } catch (error) {
    console.error("Erro ao rastrear visualização:", error);
    return false;
  }
};

export interface PropertyViewStats {
  property_id: string;
  property_code?: string;
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

export type ViewPeriod = "today" | "week" | "month" | "year" | "all";

export interface ViewPeriodOptions {
  month?: number;
  year?: number;
}

export const getMostViewedProperties = async (
  period: ViewPeriod = "month",
  limit: number = 10,
  options: ViewPeriodOptions = {}
): Promise<PropertyViewStats[]> => {
  try {
    let startDate = new Date();
    let endDate = new Date();

    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week": {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      }
      case "month": {
        const month = options.month ?? new Date().getMonth() + 1;
        const year = options.year ?? new Date().getFullYear();
        startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
        break;
      }
      case "year": {
        const year = options.year ?? new Date().getFullYear();
        startDate = new Date(year, 0, 1, 0, 0, 0, 0);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        break;
      }
      case "all":
        startDate = new Date("2000-01-01T00:00:00.000Z");
        endDate = new Date();
        break;
    }

    const { data: viewData, error: viewError } = await supabase.rpc("get_most_viewed_properties", {
      p_limit: limit,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
    });

    if (viewError) {
      console.error("Erro ao buscar visualizações:", viewError);
      return [];
    }

    if (!viewData || viewData.length === 0) {
      return [];
    }

    const propertyIds = viewData.map((view) => view.property_id);

    const { data: properties, error: propertyError } = await supabase
      .from("properties")
      .select(
        `
          id,
          codigo,
          title,
          property_type,
          price,
          location,
          city,
          created_at,
          property_images(image_url, is_primary)
        `
      )
      .in("id", propertyIds);

    if (propertyError) {
      console.error("Erro ao buscar propriedades:", propertyError);
      return [];
    }

    const viewMap = new Map<string, number>();
    viewData.forEach((view) => {
      viewMap.set(view.property_id, Number(view.unique_views));
    });

    const result: PropertyViewStats[] =
      properties
        ?.map((property) => {
          const totalViews = viewMap.get(property.id) || 0;
          const images = (property.property_images as Array<{ image_url: string; is_primary: boolean }>) || [];
          const primaryImage = images.find((image) => image.is_primary);

          return {
            property_id: property.id,
            property_code: property.codigo || undefined,
            title: property.title,
            property_type: property.property_type,
            price: property.price,
            location: property.location,
            city: property.city,
            unique_views: totalViews,
            total_views: totalViews,
            last_viewed_at: property.created_at,
            primary_image: primaryImage?.image_url || images[0]?.image_url,
          };
        })
        .sort((left, right) => right.total_views - left.total_views) || [];

    return result;
  } catch (error) {
    console.error("Erro ao obter imóveis mais visitados:", error);
    return [];
  }
};

export const getPropertyViewCount = async (propertyId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc("get_property_view_count", {
      p_property_id: propertyId,
    });

    if (error) {
      console.error("Erro ao contar visualizações:", error);
      return 0;
    }

    return Number(data) || 0;
  } catch (error) {
    console.error("Erro ao obter contagem de visualizações:", error);
    return 0;
  }
};
