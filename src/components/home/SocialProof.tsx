import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/content";

export async function Testimonials() {
  const content = await getSiteContent();
  const testimonialPlaceholders = content.testimonials;
  return (
    <section className="bg-cream-100 py-16 sm:py-20" aria-label="Customer testimonials">
      <SectionHeading
        eyebrow="Sweet Words"
        title="Loved for life's sweetest moments"
        description="Sample layout — genuine customer reviews will replace these placeholders once provided by the bakery."
      />
      <Container className="grid gap-5 md:grid-cols-3">
        {testimonialPlaceholders.map((t) => (
          <figure
            key={t.id}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_35px_rgba(74,29,93,0.07)] ring-1 ring-plum-700/10"
          >
            <div aria-hidden="true" className="flex gap-1 text-gold-400">
              {"★★★★★".split("").map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-plum-900/75">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-4 border-t border-dashed border-plum-700/15 pt-4">
              <p className="text-sm font-bold text-plum-800">{t.name}</p>
              <p className="text-xs text-plum-900/55">
                {t.occasion} · <span className="italic">placeholder</span>
              </p>
            </figcaption>
          </figure>
        ))}
      </Container>
    </section>
  );
}

export async function GalleryPreview() {
  const content = await getSiteContent();
  const galleryPlaceholders = content.gallery;
  return (
    <section className="bg-white py-16 sm:py-20" aria-label="Gallery preview">
      <SectionHeading
        eyebrow="Gallery"
        title="Fresh from the oven"
        description="A preview of the style and finish to expect. The full gallery arrives in a later phase."
      />
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {galleryPlaceholders.map((g) => (
            <div
              key={g.id}
              className="overflow-hidden rounded-3xl shadow-md shadow-plum-800/10 ring-1 ring-plum-700/10"
            >
              <Image
                src={g.image}
                alt={g.alt}
                width={500}
                height={500}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/gallery" variant="secondary">
            View Gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}
