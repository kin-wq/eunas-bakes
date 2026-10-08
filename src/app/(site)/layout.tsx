import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/shared/FloatingWhatsAppButton";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";

/**
 * Customer-facing site chrome. Admin (/admin) and API routes live outside
 * this group, so bakery navigation never appears on admin screens.
 */
export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: {
      default: `${content.brand.name} — ${content.brand.tagline}`,
      template: `%s · ${content.brand.name}`,
    },
    description: content.brand.description,
    openGraph: {
      title: content.brand.name,
      description: content.brand.description,
      type: "website",
      locale: "en_ZW",
      siteName: content.brand.name,
    },
    twitter: {
      card: "summary_large_image",
      title: content.brand.name,
      description: content.brand.description,
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      title: content.brand.name,
      statusBarStyle: "black-translucent",
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
    },
    ...canonicalMeta("/"),
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();
  return (
    <>
      <Header
        brandName={content.brand.name}
        whatsappDisplay={content.whatsapp.displayNumber}
        whatsappNumber={content.whatsapp.internationalNumber}
        depositNotice={content.business.depositNotice}
      />
      <main id="main-content" className="flex-1 pt-[68px]">
        {children}
      </main>
      <Footer />
      <MobileBottomNav whatsappNumber={content.whatsapp.internationalNumber} />
      <FloatingWhatsAppButton
        brandName={content.brand.name}
        whatsappDisplay={content.whatsapp.displayNumber}
        whatsappNumber={content.whatsapp.internationalNumber}
      />
    </>
  );
}
