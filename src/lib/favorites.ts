export const getFavoritesStorageKey = (tenantSlug?: string | null) =>
  tenantSlug ? `favorites:${tenantSlug}` : "favorites";

export const readFavorites = (tenantSlug?: string | null) => {
  try {
    return JSON.parse(localStorage.getItem(getFavoritesStorageKey(tenantSlug)) || "[]") as string[];
  } catch {
    return [] as string[];
  }
};

export const writeFavorites = (favorites: string[], tenantSlug?: string | null) => {
  localStorage.setItem(getFavoritesStorageKey(tenantSlug), JSON.stringify(favorites));
  window.dispatchEvent(new Event("favoritesChanged"));
};

