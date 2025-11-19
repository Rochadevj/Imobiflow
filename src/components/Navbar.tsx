import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Home, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <Building2 className="h-8 w-8 text-accent" />
            <span>Imóveis Premium</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-accent hover:bg-primary/90"
              asChild
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Início
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-accent hover:bg-primary/90"
              asChild
            >
              <Link to="/sobre">Sobre</Link>
            </Button>

            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-accent hover:bg-primary/90"
              asChild
            >
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
