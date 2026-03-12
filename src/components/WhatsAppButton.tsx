import { useEffect, useMemo, useState } from "react";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/contact";
import TrackedWhatsAppLink from "./TrackedWhatsAppLink";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  tenantSlug?: string | null;
}

const WhatsAppIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.601 2.326A7.854 7.854 0 0 0 8.012.001C3.594 0 .017 3.574.017 7.992c0 1.41.367 2.786 1.065 4.001L0 16l4.093-1.063a7.964 7.964 0 0 0 3.92 1.032h.003c4.417 0 7.993-3.574 7.993-7.992a7.936 7.936 0 0 0-2.408-5.651ZM8.016 14.48h-.003a6.46 6.46 0 0 1-3.294-.905l-.236-.14-2.429.632.649-2.369-.154-.243a6.487 6.487 0 0 1-.998-3.43c0-3.58 2.915-6.495 6.499-6.495A6.44 6.44 0 0 1 14.51 8.01c0 3.58-2.916 6.47-6.495 6.47Zm3.688-4.83c-.202-.101-1.195-.59-1.38-.657-.185-.067-.32-.101-.456.101-.134.202-.523.657-.642.79-.119.134-.237.151-.44.05-.202-.101-.853-.314-1.626-1a6.084 6.084 0 0 1-1.129-1.39c-.118-.202-.013-.312.089-.413.092-.092.202-.237.303-.355.101-.119.134-.202.202-.337.067-.134.034-.252-.017-.354-.05-.101-.456-1.101-.625-1.507-.165-.397-.334-.343-.456-.349l-.39-.007a.753.753 0 0 0-.547.252c-.185.202-.71.694-.71 1.69 0 .996.728 1.957.83 2.09.101.134 1.435 2.189 3.478 3.07.486.21.866.335 1.162.429.487.155.93.133 1.28.08.391-.058 1.195-.489 1.363-.961.168-.472.168-.876.118-.961-.05-.084-.185-.134-.387-.235Z"/>
  </svg>
);

export default function WhatsAppButton({
  phone = CONTACT_WHATSAPP_NUMBER,
  message = "Olá! Gostaria de saber mais sobre a Imobiflow.",
  tenantSlug,
}: WhatsAppButtonProps) {
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const digits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const phoneWithCountry = useMemo(() => {
    if (digits.startsWith("55")) return digits;
    return `55${digits}`;
  }, [digits]);

  return (
    <div className="fixed bottom-5 right-4 z-50 select-none md:bottom-8 md:right-8">
      <div
        className="relative group"
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <TrackedWhatsAppLink
          phone={phoneWithCountry}
          message={message}
          source="floating_button"
          tenantSlug={tenantSlug}
          aria-label="Abrir conversa no WhatsApp"
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] md:h-14 md:w-14"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 opacity-0 group-hover:opacity-100 animate-ping pointer-events-none" />
          <WhatsAppIcon className="w-7 h-7 relative" />
        </TrackedWhatsAppLink>

        <div
          className={`absolute right-14 top-1/2 hidden -translate-y-1/2 transition-opacity md:right-16 md:block ${showTip ? "opacity-100" : "opacity-0"}`}
        >
          <div className="relative bg-white text-foreground text-xs md:text-sm rounded-lg shadow-md px-3 py-2 border border-gray-200 w-56 md:w-72 max-w-[80vw] whitespace-normal">
            {message}
            <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
