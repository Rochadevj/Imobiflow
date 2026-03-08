import type { Tables } from "@/integrations/supabase/types";

type Tenant = Tables<"tenants"> | null | undefined;

export const getTenantBrandName = (tenant: Tenant) =>
  tenant?.site_title?.trim() || tenant?.name?.trim() || "Imobiflow";

export const getTenantSupportEmail = (tenant: Tenant) =>
  tenant?.support_email?.trim() || "contato@imobiflow.com";

export const getTenantPhone = (tenant: Tenant) =>
  tenant?.phone?.trim() || tenant?.whatsapp?.trim() || "(51) 99128-8418";

export const getTenantWhatsApp = (tenant: Tenant) =>
  tenant?.whatsapp?.trim() || tenant?.phone?.trim() || "(51) 99128-8418";

export const getTenantCreci = (tenant: Tenant) =>
  tenant?.creci?.trim() || "CRECI 000000-XX";

export const getTenantLocationLabel = (tenant: Tenant) => {
  const parts = [tenant?.city?.trim(), tenant?.state?.trim()].filter(Boolean);
  return parts.length ? parts.join(", ") : "Atendimento nacional";
};

