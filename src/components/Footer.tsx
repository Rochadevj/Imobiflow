import { Link } from "react-router-dom";
import { Facebook, Youtube, Instagram, Mail, Phone } from "lucide-react";

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
              <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-all duration-200 hover:translate-x-2">
                Início
              </Link>
              <Link to="/sobre" className="text-primary-foreground/80 hover:text-accent transition-all duration-200 hover:translate-x-2">
                Sobre
              </Link>
              <Link to="/anunciar" className="text-primary-foreground/80 hover:text-accent transition-all duration-200 hover:translate-x-2">
                Anunciar
              </Link>
              <Link to="/auth" className="text-primary-foreground/80 hover:text-accent transition-all duration-200 hover:translate-x-2">
                Entrar
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contato</h3>
            <div className="space-y-3 text-primary-foreground/80 text-sm">
              <a 
                href="mailto:contato@alexandreandrade.com.br"
                className="flex items-center gap-2 hover:text-accent transition-all duration-200 hover:translate-x-1"
              >
                <Mail className="h-4 w-4" />
                E-mail
              </a>
              <a 
                href="https://wa.me/5551991288418?text=Olá! Gostaria de alguma informação?"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent transition-all duration-200 hover:translate-x-1"
              >
                <Phone className="h-4 w-4" />
                (51) 99128-8418
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-all duration-300 hover:scale-125 hover:-translate-y-1">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            Alexandre Andrade Corretor de Imóveis | {new Date().getFullYear()} © Todos os direitos reservados
          </p>
          <Link to="/politica-privacidade" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
