import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { buildWhatsAppLink, CONTACT_WHATSAPP_NUMBER } from "@/lib/contact";
import { trackWhatsAppLead, type WhatsAppLeadSource } from "@/lib/whatsappLeads";

type TrackedWhatsAppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  phone?: string;
  message: string;
  source: WhatsAppLeadSource;
  tenantSlug?: string | null;
  propertyId?: string | null;
};

const TrackedWhatsAppLink = forwardRef<HTMLAnchorElement, TrackedWhatsAppLinkProps>(
  (
    {
      phone = CONTACT_WHATSAPP_NUMBER,
      message,
      source,
      tenantSlug,
      propertyId,
      onClick,
      target = "_blank",
      rel = "noopener noreferrer",
      ...props
    },
    ref,
  ) => {
    const href = buildWhatsAppLink(message, phone);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      void trackWhatsAppLead({
        source,
        tenantSlug,
        propertyId,
        message,
      });
    };

    return (
      <a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

TrackedWhatsAppLink.displayName = "TrackedWhatsAppLink";

export default TrackedWhatsAppLink;
