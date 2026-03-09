import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Heart, LayoutDashboard, LogOut, Menu, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "@/context/TenantContext";
import TenantLink from "@/components/TenantLink";
import { getTenantBrandName } from "@/lib/tenantBrand";
import { readFavorites } from "@/lib/favorites";

const navItems = [
  { key: "comprar", label: "Comprar", href: "/imobiliaria?list=1&type=comprar" },
  { key: "alugar", label: "Alugar", href: "/imobiliaria?list=1&type=alugar" },
  { key: "lancamentos", label: "Lançamentos", href: "/lancamentos" },
  { key: "sobre", label: "Sobre", href: "/sobre" },
];

const DEFAULT_PUBLIC_DEMO_TENANT_SLUG = "henriquerocha1357-b8d30883";
const configuredDemoTenantSlug = import.meta.env.VITE_DEMO_TENANT_SLUG?.trim().toLowerCase();
const resolvedDemoTenantSlug = configuredDemoTenantSlug || DEFAULT_PUBLIC_DEMO_TENANT_SLUG;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant, tenantPath } = useTenant();
  const [user, setUser] = useState<User | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = useMemo(() => getTenantBrandName(tenant), [tenant]);
  const isPublicDemoTenant = useMemo(
    () => Boolean(tenant && (tenant.is_demo || tenant.slug === resolvedDemoTenantSlug)),
    [tenant],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateFavCount = () => {
      setFavoritesCount(readFavorites(tenant?.slug).length);
    };

    updateFavCount();
    window.addEventListener("favoritesChanged", updateFavCount);
    window.addEventListener("storage", updateFavCount);

    return () => {
      window.removeEventListener("favoritesChanged", updateFavCount);
      window.removeEventListener("storage", updateFavCount);
    };
  }, [tenant?.slug]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isNavItemActive = (itemKey: string) => {
    const search = new URLSearchParams(location.search);
    if (itemKey === "comprar") {
      return location.pathname === "/imobiliaria" && search.get("type") === "comprar";
    }
    if (itemKey === "alugar") {
      return location.pathname === "/imobiliaria" && search.get("type") === "alugar";
    }
    if (itemKey === "sobre") {
      return location.pathname.startsWith("/sobre");
    }
    if (itemKey === "lancamentos") {
      return location.pathname.startsWith("/lancamentos");
    }
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <TenantLink to="/imobiliaria" forceTenant className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_24px_rgba(251,146,60,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-none text-slate-900">{brandName}</p>
              <p className="mt-1 hidden text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:block">
                Soluções imobiliárias
              </p>
            </div>
          </TenantLink>

          <div className="hidden lg:flex items-center rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/85 via-white to-orange-50/80 p-1 shadow-[0_8px_18px_rgba(251,146,60,0.16)]">
            {navItems.map((item) => {
              const active = isNavItemActive(item.key);
              return (
                <TenantLink
                  key={item.href}
                  to={item.href}
                  forceTenant
                  className={cn(
                    "rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 shadow-[0_10px_20px_rgba(251,146,60,0.34)]"
                      : "text-slate-700 hover:bg-amber-100/80 hover:text-amber-900",
                  )}
                >
                  {item.label}
                </TenantLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              className="rounded-full px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              asChild
            >
              <TenantLink to="/favorites" forceTenant>
                <Heart className="mr-2 h-4 w-4" />
                Favoritos ({favoritesCount})
              </TenantLink>
            </Button>

            <Button
              className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-5 text-slate-900 shadow-[0_10px_24px_rgba(251,146,60,0.32)] hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
              asChild
            >
              <TenantLink to="/anunciar" forceTenant>Anunciar</TenantLink>
            </Button>

            {user ? (
              <>
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  asChild
                >
                  <TenantLink to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Gerenciar
                  </TenantLink>
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full px-4 text-slate-600 hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                {isPublicDemoTenant ? (
                  <Button
                    variant="outline"
                    className="rounded-full border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    asChild
                  >
                    <TenantLink to="/admin?demo=1" forceTenant>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Gerenciar demo
                    </TenantLink>
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  asChild
                >
                  <TenantLink to="/auth">Entrar</TenantLink>
                </Button>
              </>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-[320px] border-l border-slate-200 bg-white px-5 sm:px-6">
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start rounded-xl font-semibold",
                        isNavItemActive(item.key)
                          ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                          : "text-slate-700 hover:bg-amber-100/75 hover:text-amber-900",
                      )}
                      asChild
                    >
                      <TenantLink to={item.href} forceTenant>{item.label}</TenantLink>
                    </Button>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    asChild
                  >
                    <TenantLink to="/favorites" forceTenant>
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos ({favoritesCount})
                    </TenantLink>
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button
                    className="mt-3 w-full justify-start rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                    asChild
                  >
                    <TenantLink to="/anunciar" forceTenant>Anunciar</TenantLink>
                  </Button>
                </SheetClose>

                {user ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        asChild
                      >
                        <TenantLink to="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Gerenciar
                        </TenantLink>
                      </Button>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    {isPublicDemoTenant ? (
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start rounded-xl border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                          asChild
                        >
                          <TenantLink to="/admin?demo=1" forceTenant>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Gerenciar demo
                          </TenantLink>
                        </Button>
                      </SheetClose>
                    ) : null}
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        asChild
                      >
                        <TenantLink to="/auth">Entrar</TenantLink>
                      </Button>
                    </SheetClose>
                  </>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  Catálogo público: <span className="font-semibold text-slate-700">{tenantPath("/imobiliaria", true)}</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
