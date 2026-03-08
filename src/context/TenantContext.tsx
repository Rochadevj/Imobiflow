/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Tenant = Tables<"tenants">;

type TenantContextValue = {
  tenant: Tenant | null;
  loading: boolean;
  isTenantRequest: boolean;
  tenantPath: (path: string, forceTenant?: boolean) => string;
  refreshTenant: () => Promise<void>;
};

const BASE_HOSTS = new Set(["localhost", "127.0.0.1", "imobiflow.vercel.app"]);
const PUBLIC_SITE_PREFIXES = [
  "/",
  "/imobiliaria",
  "/property",
  "/lancamentos",
  "/favorites",
  "/sobre",
  "/anunciar",
  "/politica-privacidade",
];

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

const normalizeHost = (host: string) => host.replace(/^www\./i, "").toLowerCase();

const isBaseHost = (host: string) => {
  const normalized = normalizeHost(host);

  if (BASE_HOSTS.has(normalized)) {
    return true;
  }

  if (normalized.endsWith(".vercel.app") && normalized.split(".").length <= 3) {
    return true;
  }

  return false;
};

const shouldResolvePublicTenant = (pathname: string, isTenantRequest: boolean) => {
  if (pathname === "/") {
    return isTenantRequest;
  }

  return PUBLIC_SITE_PREFIXES.some((prefix) =>
    prefix === "/"
      ? pathname === "/"
      : pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
};

const buildTenantQueryPath = (
  path: string,
  tenantSlug: string | null,
  isTenantRequest: boolean,
  forceTenant = false,
) => {
  if (!tenantSlug || (!isTenantRequest && !forceTenant)) {
    return path;
  }

  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  params.set("tenant", tenantSlug);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTenantRequest, setIsTenantRequest] = useState(false);

  const resolveTenantByPublicRequest = useCallback(async () => {
    const hostname =
      typeof window === "undefined" ? "localhost" : normalizeHost(window.location.hostname);
    const params = new URLSearchParams(location.search);
    const tenantSlugFromQuery = params.get("tenant")?.trim().toLowerCase() || null;
    const tenantRequest = Boolean(tenantSlugFromQuery) || !isBaseHost(hostname);
    const defaultFallbackDemoQuery = supabase
      .from("tenants")
      .select("*")
      .eq("is_demo", true)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    setIsTenantRequest(tenantRequest);

    if (tenantSlugFromQuery) {
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("slug", tenantSlugFromQuery)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Erro ao resolver tenant público por slug:", error);
        setTenant(null);
        return;
      }

      if (data) {
        setTenant(data);
        return;
      }
    }

    if (!isBaseHost(hostname)) {
      const { data: byDomain, error: byDomainError } = await supabase
        .from("tenants")
        .select("*")
        .eq("custom_domain", hostname)
        .eq("is_active", true)
        .maybeSingle();

      if (byDomainError) {
        console.error("Erro ao resolver tenant por domínio:", byDomainError);
        setTenant(null);
        return;
      }

      if (byDomain) {
        setTenant(byDomain);
        return;
      }
    }

    const { data: fallbackDemo, error: fallbackDemoError } = await defaultFallbackDemoQuery;

    if (fallbackDemoError) {
      console.error("Erro ao carregar tenant demo:", fallbackDemoError);
    }

    setTenant(fallbackDemo ?? null);
  }, [location.search]);

  const resolveTenantBySession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setTenant(null);
      return;
    }

    const { data: tenantId, error: tenantIdError } = await supabase.rpc("get_current_tenant_id");

    if (tenantIdError) {
      console.error("Erro ao obter tenant da sessão:", tenantIdError);
      setTenant(null);
      return;
    }

    if (!tenantId) {
      setTenant(null);
      return;
    }

    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar tenant da sessão:", error);
      setTenant(null);
      return;
    }

    setTenant(data ?? null);
  }, []);

  const refreshTenant = useCallback(async () => {
    const hostname =
      typeof window === "undefined" ? "localhost" : normalizeHost(window.location.hostname);
    const params = new URLSearchParams(location.search);
    const tenantRequest = Boolean(params.get("tenant")) || !isBaseHost(hostname);

    setLoading(true);

    try {
      if (shouldResolvePublicTenant(location.pathname, tenantRequest)) {
        await resolveTenantByPublicRequest();
      } else {
        await resolveTenantBySession();
      }
    } finally {
      setLoading(false);
    }
  }, [location.pathname, location.search, resolveTenantByPublicRequest, resolveTenantBySession]);

  useEffect(() => {
    void refreshTenant();
  }, [refreshTenant]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshTenant();
    });

    return () => subscription.unsubscribe();
  }, [refreshTenant]);

  useEffect(() => {
    const root = document.documentElement;

    if (!tenant) {
      root.style.removeProperty("--tenant-primary");
      root.style.removeProperty("--tenant-secondary");
      root.style.removeProperty("--tenant-accent");
      return;
    }

    root.style.setProperty("--tenant-primary", tenant.primary_color);
    root.style.setProperty("--tenant-secondary", tenant.secondary_color);
    root.style.setProperty("--tenant-accent", tenant.accent_color);
  }, [tenant]);

  const tenantPath = useCallback(
    (path: string, forceTenant = false) =>
      buildTenantQueryPath(path, tenant?.slug ?? null, isTenantRequest, forceTenant),
    [isTenantRequest, tenant?.slug],
  );

  const value = useMemo<TenantContextValue>(
    () => ({
      tenant,
      loading,
      isTenantRequest,
      tenantPath,
      refreshTenant,
    }),
    [tenant, loading, isTenantRequest, tenantPath, refreshTenant],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used inside TenantProvider");
  }

  return context;
};
