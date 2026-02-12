import { Link } from "react-router-dom";
import { Building2, Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-gradient-to-b from-white/95 to-slate-100/85">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/imobiliaria" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_20px_rgba(251,146,60,0.32)]">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-900">Imobiflow</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Solucoes imobiliarias
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-600">
              Plataforma demo para apresentar captacao, atendimento e negociacao de imoveis em um unico fluxo.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Atendimento em todo o Brasil
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Navegacao</h3>
            <nav className="mt-4 space-y-2 text-sm">
              <Link to="/imobiliaria" className="block text-slate-700 transition hover:text-amber-600">
                Inicio
              </Link>
              <Link to="/sobre" className="block text-slate-700 transition hover:text-amber-600">
                Sobre
              </Link>
              <Link to="/anunciar" className="block text-slate-700 transition hover:text-amber-600">
                Anunciar imovel
              </Link>
              <Link to="/favorites" className="block text-slate-700 transition hover:text-amber-600">
                Favoritos
              </Link>
              <Link to="/auth" className="block text-slate-700 transition hover:text-amber-600">
                Acesso ao painel
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contato</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <a
                href="mailto:contato@imobiflow.com"
                className="flex items-center gap-2 transition hover:text-amber-600"
              >
                <Mail className="h-4 w-4 text-amber-500" />
                contato@imobiflow.com
              </a>
              <a
                href="https://wa.me/5500000000000?text=Ola! Gostaria de mais informacoes sobre os imoveis."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-amber-600"
              >
                <Phone className="h-4 w-4 text-amber-500" />
                (00) 00000-0000
              </a>
              <span className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                Atendimento nacional
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Redes</h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-600"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-600"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Estrutura pronta para demonstrar operacao imobiliaria com visual profissional.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Imobiflow | {new Date().getFullYear()} | Todos os direitos reservados</p>
          <Link to="/politica-privacidade" className="transition hover:text-amber-600">
            Politica de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
