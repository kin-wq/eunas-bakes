import type { MetadataRoute } from "next";

/**
 * PWA manifest (Phase 6) — makes Euna's Bakes installable on Android
 * and on iPhone (via Add to Home Screen), with a standalone app feel.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Euna's Bakes — Handcrafted Sweetness in Every Bite",
    short_name: "Euna's Bakes",
    description:
      "Browse chiffon, premium and butter-based cakes and order via WhatsApp.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f0",
    theme_color: "#4a1d5d",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
