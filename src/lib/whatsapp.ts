import { siteConfig } from "@/data/site";

/**
 * Build a wa.me link using the bakery's WhatsApp number.
 * Pass the live content number when available (admin-editable);
 * falls back to the central static config.
 * Works on Android, iPhone and Desktop (wa.me handles all platforms).
 */
export function getWhatsAppLink(
  message?: string,
  internationalNumber: string = siteConfig.whatsapp.internationalNumber
): string {
  const text = message ?? siteConfig.whatsapp.defaultMessage;
  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(text)}`;
}
