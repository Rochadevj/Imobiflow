import { Link } from "react-router-dom";
import { Facebook, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 font-bold text-xl mb-4">
              <img src="/logo-aa.svg" alt="Alexandre Andrade" className="h-10 w-auto" />
            </Link>
            <p className="text-primary-foreground/80 text-sm">Canoas / Rio Grande do Sul</p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Menu</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Sobre
              </Link>
              <Link to="/anunciar" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Anunciar
              </Link>
              <Link to="/auth" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Entrar
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contato</h3>
            <div className="space-y-2 text-primary-foreground/80 text-sm">
              <p>Canoas, Rio Grande do Sul</p>
              <p>CRECI: 078852</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            Alexandre Andrade Corretor de Imóveis | {new Date().getFullYear()} © Todos os direitos reservados
          </p>
          <Link to="#" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
            Políticas de privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
