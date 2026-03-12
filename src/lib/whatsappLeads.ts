import { supabase } from "@/integrations/supabase/client";

const VISITOR_SESSION_STORAGE_KEY = "imobiflow.whatsapp.visitor-session";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export type WhatsAppLeadSource =
  | "floating_button"
  | "property_detail_mobile_cta"
  | "property_detail_sidebar"
  | "property_realtor_card"
  | "footer_contact"
  | "about_hero"
  | "landing_contact"
  | "property_submit_help";

export interface TrackWhatsAppLeadInput {
  source: WhatsAppLeadSource;
  tenantSlug?: string | null;
  propertyId?: string | null;
  message?: string;
}

const getVisitorSessionId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const existingId = window.localStorage.getItem(VISITOR_SESSION_STORAGE_KEY);
  if (existingId) {
    return existingId;
  }

  const nextId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(VISITOR_SESSION_STORAGE_KEY, nextId);
  return nextId;
};

export const trackWhatsAppLead = async ({
  source,
  tenantSlug,
  propertyId,
  message,
}: TrackWhatsAppLeadInput) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!tenantSlug?.trim() && !propertyId) {
    return null;
  }

  const payload = {
    p_source: source,
    p_tenant_slug: tenantSlug?.trim() || null,
    p_property_id: propertyId || null,
    p_source_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    p_page_url: window.location.href,
    p_referrer: document.referrer || null,
    p_message: message?.trim() || null,
    p_visitor_session_id: getVisitorSessionId(),
  };

  try {
    if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/create_whatsapp_lead`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        throw new Error(`RPC create_whatsapp_lead falhou com status ${response.status}`);
      }

      return response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : null;
    }

    const { data, error } = await supabase.rpc("create_whatsapp_lead", payload);

    if (error) {
      throw error;
    }

    return data ?? null;
  } catch (error) {
    console.error("Erro ao registrar lead do WhatsApp:", error);
    return null;
  }
};
