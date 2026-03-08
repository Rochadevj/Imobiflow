export const CONTACT_WHATSAPP_NUMBER = "5551991288418";
export const CONTACT_WHATSAPP_DISPLAY = "(51) 99128-8418";

export const formatPhoneDisplay = (phone?: string | null) => {
  const digits = (phone || "").replace(/\D/g, "");

  if (digits.length === 13) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  return phone || CONTACT_WHATSAPP_DISPLAY;
};

export const buildWhatsAppLink = (message?: string, phone = CONTACT_WHATSAPP_NUMBER) => {
  const normalizedPhone = phone.replace(/\D/g, "") || CONTACT_WHATSAPP_NUMBER;
  const baseUrl = `https://wa.me/${normalizedPhone}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
