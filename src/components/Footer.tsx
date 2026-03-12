import { Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import TrackedWhatsAppLink from "@/components/TrackedWhatsAppLink";
import TenantLink from "@/components/TenantLink";
import { useTenant } from "@/context/TenantContext";
import { formatPhoneDisplay } from "@/lib/contact";
import {
  getTenantBrandName,
  getTenantCreci,
  getTenantLocationLabel,
  getTenantSupportEmail,
  getTenantWhatsApp,
} from "@/lib/tenantBrand";

const Footer = () => {
  const { tenant } = useTenant();
  const brandName = getTenantBrandName(tenant);
  const supportEmail = getTenantSupportEmail(tenant);
  const whatsapp = getTenantWhatsApp(tenant);
  const locationLabel = getTenantLocationLabel(tenant);
  const creci = getTenantCreci(tenant);

  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-gradient-to-b from-white/95 to-slate-100/85">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <TenantLink to="/imobiliaria" forceTenant className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 text-slate-900 shadow-[0_10px_20px_rgba(251,146,60,0.32)]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-semibold text-slate-900">{brandName}</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Soluções imobiliárias
                </p>
              </div>
            </TenantLink>
            <p className="text-sm text-slate-600">
              Catálogo imobiliário com atendimento organizado, vitrine profissional e experiência pública pronta para a operação da imobiliária.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {creci}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Navegação</h3>
            <nav className="mt-4 space-y-2 text-sm">
              <TenantLink to="/imobiliaria" forceTenant className="block text-slate-700 transition hover:text-amber-600">
                Início
              </TenantLink>
              <TenantLink to="/sobre" forceTenant className="block text-slate-700 transition hover:text-amber-600">
                Sobre
              </TenantLink>
              <TenantLink to="/lancamentos" forceTenant className="block text-slate-700 transition hover:text-amber-600">
                Lançamentos
              </TenantLink>
              <TenantLink to="/anunciar" forceTenant className="block text-slate-700 transition hover:text-amber-600">
                Anunciar imóvel
              </TenantLink>
              <TenantLink to="/favorites" forceTenant className="block text-slate-700 transition hover:text-amber-600">
                Favoritos
              </TenantLink>
              <TenantLink to="/auth" className="block text-slate-700 transition hover:text-amber-600">
                Acesso ao painel
              </TenantLink>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contato</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <a href={`mailto:${supportEmail}`} className="flex items-center gap-2 transition hover:text-amber-600">
                <Mail className="h-4 w-4 text-amber-500" />
                {supportEmail}
              </a>
              <TrackedWhatsAppLink
                phone={whatsapp}
                message={`Olá! Gostaria de saber mais sobre os imóveis da ${brandName}.`}
                source="footer_contact"
                tenantSlug={tenant?.slug}
                className="flex items-center gap-2 transition hover:text-amber-600"
              >
                <Phone className="h-4 w-4 text-amber-500" />
                {formatPhoneDisplay(whatsapp)}
              </TrackedWhatsAppLink>
              <span className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-amber-500" />
                {locationLabel}
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
              Estrutura pronta para a imobiliária publicar estoque, atender leads e apresentar imóveis com padrão profissional.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{brandName} | {new Date().getFullYear()} | Todos os direitos reservados</p>
          <TenantLink to="/politica-privacidade" forceTenant className="transition hover:text-amber-600">
            Política de Privacidade
          </TenantLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
