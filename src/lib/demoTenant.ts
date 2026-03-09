const DEFAULT_DEMO_TENANT_SLUG = "henriquerocha1357-b8d30883";

export const resolvedDemoTenantSlug =
  import.meta.env.VITE_DEMO_TENANT_SLUG?.trim().toLowerCase() || DEFAULT_DEMO_TENANT_SLUG;
