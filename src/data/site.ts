/**
 * Central site configuration for Euna's Bakes.
 *
 * RULE: The WhatsApp number must ONLY be defined here.
 * All components must import from this file — never hardcode the number.
 *
 * To change the number, update `whatsapp` below.
 * Display format: "0776 594 276"
 * International format (no +, no spaces): "263776594276" (Zimbabwe +263, drop leading 0)
 */

export const siteConfig = {
  brand: {
    name: "Euna's Bakes",
    tagline: "Handcrafted Sweetness in Every Bite",
    developer: "Developed by Art of Bvumbi",
    description:
      "Euna's Bakes is a professional bakery crafting chiffon, premium and butter-based cakes for birthdays, weddings and everyday celebrations.",
  },
  whatsapp: {
    /** Human-readable number shown in the UI */
    displayNumber: "0776 594 276",
    /** International format for wa.me links (country code + number, no +/spaces) */
    internationalNumber: "263776594276",
    /** Default message used when no order context exists yet (Phase 1 generic CTA) */
    defaultMessage:
      "Hello Euna's Bakes! I would like to enquire about your cakes.",
  },
  business: {
    depositNotice: "50% non-refundable deposit is required to secure your order.",
    decorationNotice:
      "Fancy decorations, non-edible and edible prints attract an extra fee.",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "Order", href: "/order", highlight: true },
  ] as { label: string; href: string; highlight?: boolean }[],
  contact: {
    // PLACEHOLDER — owner to replace with real details. No fake address invented.
    locationPlaceholder: "Location shared on order confirmation via WhatsApp",
    hoursPlaceholder: "Open for orders — chat with us on WhatsApp for hours",
  },
} as const;

export type SiteConfig = typeof siteConfig;
