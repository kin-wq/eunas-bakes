import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { galleryNote } from "@/data/brand";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A taste of the Euna's Bakes style — celebration cakes, cupcakes and finishes. Real bakery photos coming soon.",
  ...canonicalMeta("/gallery"),
};

/**
 * Gallery page (Phase 5).
 * OWNER GUIDE: replace `galleryPlaceholders` in src/data/products.ts with real
 * Euna's Bakes photos (same shape: id, image, alt) — this page needs no edits.
 */
export default async function GalleryPage() {
  const content = await getSiteContent();
  const galleryPlaceholders = content.gallery;
  return (
    <>
      <section className="relative overflow-hidden bg-cream-100" aria-label="Cake gallery">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
        </div>
        <Container className="relative py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            Gallery
          </p>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight font-bold text-balance text-plum-800 sm:text-5xl">
            Fresh from the oven
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
            A taste of the style and finish to expect from Euna&apos;s Bakes.
          </p>
          {galleryNote.isPlaceholder ? (
            <p className="mx-auto mt-5 max-w-xl rounded-2xl bg-gold-400/10 px-5 py-3 text-xs leading-relaxed font-medium text-plum-800 ring-1 ring-gold-400/25">
              {galleryNote.text}
            </p>
          ) : null}
        </Container>
      </section>

      <section className="bg-cream-50 py-12 sm:py-16" aria-label="Gallery photos">
        <Container>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {galleryPlaceholders.map((photo, i) => (
              <figure
                key={photo.id}
                className={
                  i % 4 === 0
                    ? "col-span-2 row-span-2 overflow-hidden rounded-3xl shadow-md shadow-plum-800/10 ring-1 ring-plum-700/10"
                    : "overflow-hidden rounded-3xl shadow-md shadow-plum-800/10 ring-1 ring-plum-700/10"
                }
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  width={600}
                  height={600}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </figure>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton label="Ask to See Recent Work" />
            <Button href="/order" variant="secondary">
              Order a Cake Like These
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
