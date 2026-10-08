import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse the Euna's Bakes menu: chiffon cakes from $25, premium cakes from $35, and butter-based cakes from $50. Sizes, flavours and WhatsApp ordering.",
  ...canonicalMeta("/menu"),
};

export default async function MenuPage() {
  const content = await getSiteContent();
  return (
    <>
      <section className="relative overflow-hidden bg-cream-100" aria-label="Bakery menu">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
        </div>
        <Container className="relative py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            Our Menu
          </p>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight font-bold text-balance text-plum-800 sm:text-5xl">
            Cakes for every celebration
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
            Three collections, honest starting prices. Pick a size and flavour,
            then enquire on WhatsApp — we confirm availability and your final price.
          </p>
          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-2.5 sm:flex-row">
            <p className="flex-1 rounded-2xl bg-white/70 px-4 py-3 text-xs leading-relaxed font-medium text-plum-800 ring-1 ring-plum-700/10 backdrop-blur">
              {content.business.depositNotice}
            </p>
            <p className="flex-1 rounded-2xl bg-white/70 px-4 py-3 text-xs leading-relaxed font-medium text-plum-800 ring-1 ring-plum-700/10 backdrop-blur">
              {content.business.decorationNotice}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-cream-50 pt-8 pb-16 sm:pb-20" aria-label="Menu items">
        <Container>
          <MenuExplorer
            categories={content.categories}
            brandName={content.brand.name}
            whatsappNumber={content.whatsapp.internationalNumber}
          />
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-plum-900/60">
            Can&apos;t see your dream flavour? We take custom requests — just ask on
            WhatsApp and we&apos;ll confirm what&apos;s possible and the final price.
          </p>
        </Container>
      </section>

      <WhatsAppCta />
    </>
  );
}
