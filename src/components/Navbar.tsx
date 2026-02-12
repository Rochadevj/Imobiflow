import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LayoutDashboard, LogOut, Menu, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { label: "Comprar", href: "/imobiliaria?type=comprar" },
  { label: "Alugar", href: "/imobiliaria?type=alugar" },
  { label: "Sobre", href: "/sobre" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      try {
        const favs = JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
        setFavoritesCount(favs.length);
      } catch {
        setFavoritesCount(0);
      }
    };
    updateFavCount();
    window.addEventListener("favoritesChanged", updateFavCount);
    window.addEventListener("storage", updateFavCount);
    return () => {
      window.removeEventListener("favoritesChanged", updateFavCount);
      window.removeEventListener("storage", updateFavCount);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/imobiliaria" className="group inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_24px_rgba(251,146,60,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-none text-slate-900">Imobiflow</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-500">
                Solucoes imobiliarias
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="rounded-full px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                asChild
              >
                <Link to={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              className="rounded-full px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              asChild
            >
              <Link to="/favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favoritos ({favoritesCount})
              </Link>
            </Button>

            <Button
              className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-5 text-slate-900 shadow-[0_10px_24px_rgba(251,146,60,0.32)] hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
              asChild
            >
              <Link to="/anunciar">Anunciar</Link>
            </Button>

            {user ? (
              <>
                <Button
                  variant="outline"
                  className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  asChild
                >
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Gerenciar
                  </Link>
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
              <Button
                variant="outline"
                className="rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                asChild
              >
                <Link to="/auth">Entrar</Link>
              </Button>
            )}
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] border-l border-slate-200 bg-white">
              <div className="mt-6 space-y-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      asChild
                    >
                      <Link to={item.href}>{item.label}</Link>
                    </Button>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    asChild
                  >
                    <Link to="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos ({favoritesCount})
                    </Link>
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button
                    className="mt-3 w-full justify-start rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                    asChild
                  >
                    <Link to="/anunciar">Anunciar</Link>
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
                        <Link to="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Gerenciar
                        </Link>
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
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      asChild
                    >
                      <Link to="/auth">Entrar</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
