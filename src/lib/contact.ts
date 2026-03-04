export const CONTACT_WHATSAPP_NUMBER = "5551991288418";
export const CONTACT_WHATSAPP_DISPLAY = "(51) 99128-8418";

export const buildWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
