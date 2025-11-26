import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Home, LayoutDashboard, Menu, X, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const updateFavCount = () => {
      try {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]') as string[];
        setFavoritesCount(favs.length);
      } catch {
        setFavoritesCount(0);
      }
    };
    updateFavCount();
    window.addEventListener('favoritesChanged', updateFavCount);
    window.addEventListener('storage', updateFavCount);
    return () => {
      window.removeEventListener('favoritesChanged', updateFavCount);
      window.removeEventListener('storage', updateFavCount);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-all duration-200 hover:scale-105">
            <img src="/logo-aa.svg" alt="Alexandre Andrade" className="h-10 w-auto" />
            <span className="sr-only">Alexandre Andrade Imobiliária</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 transition-all duration-200 hover:scale-105" asChild>
              <Link to="/?type=comprar">Comprar</Link>
            </Button>
            <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 transition-all duration-200 hover:scale-105" asChild>
              <Link to="/?type=alugar">Alugar</Link>
            </Button>

            <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 transition-all duration-200 hover:scale-105" asChild>
              <Link to="/sobre">Sobre</Link>
            </Button>

            <Button className="bg-accent text-primary hover:bg-accent/95 px-6 py-2 rounded-full hover:scale-105 transition-all duration-200 hover:shadow-lg" asChild>
              <Link to="/anunciar">Anunciar</Link>
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:text-accent hover:bg-primary/90"
                  asChild
                >
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Gerenciar
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-accent text-accent hover:bg-accent hover:text-primary"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                className="bg-accent text-primary hover:bg-accent/90"
                asChild
              >
                <Link to="/auth">Entrar</Link>
              </Button>
            )}
            <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90" asChild>
              <Link to="/favorites">
                <Heart className="mr-2 h-4 w-4" />
                ({favoritesCount})
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-primary-foreground hover:text-accent hover:bg-primary/90"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-primary text-primary-foreground">
              <div className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 justify-start" asChild>
                    <Link to="/?type=comprar">Comprar</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 justify-start" asChild>
                    <Link to="/?type=alugar">Alugar</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 justify-start" asChild>
                    <Link to="/sobre">Sobre</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="bg-accent text-primary hover:bg-accent/95 justify-start" asChild>
                    <Link to="/anunciar">Anunciar</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="text-primary-foreground hover:text-accent hover:bg-primary/90 justify-start" asChild>
                    <Link to="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favoritos ({favoritesCount})
                    </Link>
                  </Button>
                </SheetClose>
                {user ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="text-primary-foreground hover:text-accent hover:bg-primary/90 justify-start"
                        asChild
                      >
                        <Link to="/admin">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Gerenciar
                        </Link>
                      </Button>
                    </SheetClose>
                    <Button
                      variant="outline"
                      className="bg-transparent border-accent text-accent hover:bg-accent hover:text-primary justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Button
                      className="bg-accent text-primary hover:bg-accent/90 justify-start"
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
