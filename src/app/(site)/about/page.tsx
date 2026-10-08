import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";
import {
  brandStory,
  celebrationOccasions,
  customCakePoints,
  philosophyPillars,
  qualityCommitments,
} from "@/data/brand";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Euna's Bakes — our philosophy, quality promise, custom cakes and the occasions we bake for. Handcrafted Sweetness in Every Bite.",
  ...canonicalMeta("/about"),
};

function PlaceholderBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gold-400/15 px-3 py-1 text-[11px] font-bold tracking-wide text-gold-500 uppercase ring-1 ring-gold-400/30">
      {text}
    </span>
  );
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const testimonialPlaceholders = content.testimonials;
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream-100" aria-label="About Euna's Bakes">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
        </div>
        <Container className="relative py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            Our Story
          </p>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight font-bold text-balance text-plum-800 sm:text-5xl">
            {brandStory.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
            {content.brand.name} — {content.brand.tagline}. A professional
            bakery for birthdays, weddings and every sweet moment in between.
          </p>
        </Container>
      </section>

      {/* Brand story */}
      <section className="bg-cream-50 py-16 sm:py-20" aria-label="Brand story">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-plum-800/15 ring-1 ring-plum-900/10">
            <Image
              src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=900&auto=format&fit=crop"
              alt="Celebration cake baked by Euna's Bakes"
              width={900}
              height={1000}
              priority
              className="aspect-[4/4.4] w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-bold tracking-[0.22em] text-plum-500 uppercase">
                How it started
              </p>
              {brandStory.isPlaceholder ? (
                <PlaceholderBadge text="Placeholder story" />
              ) : null}
            </div>
            <h2 className="font-display mt-3 text-3xl font-bold text-balance text-plum-800 sm:text-4xl">
              From a home kitchen to your celebration table
            </h2>
            {brandStory.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-plum-900/70">
                {p}
              </p>
            ))}
            {brandStory.isPlaceholder ? (
              <p className="mt-4 rounded-2xl bg-gold-400/10 px-4 py-3 text-xs leading-relaxed text-plum-900/65 ring-1 ring-gold-400/25">
                {brandStory.ownerNote}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton label="Say Hello on WhatsApp" />
              <Button href="/menu" variant="secondary">
                Browse the Menu
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="bg-white py-16 sm:py-20" aria-label="Bakery philosophy">
        <SectionHeading
          eyebrow="Our Philosophy"
          title="What guides every cake we bake"
          description="Four simple promises behind every order that leaves our kitchen."
        />
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {philosophyPillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className="rounded-[1.75rem] bg-cream-50 p-6 ring-1 ring-plum-700/10"
            >
              <span
                aria-hidden="true"
                className="font-display flex h-11 w-11 items-center justify-center rounded-2xl bg-plum-700 text-lg font-bold text-white"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold text-plum-800">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-plum-900/65">
                {pillar.text}
              </p>
            </div>
          ))}
        </Container>
      </section>

      {/* Quality band */}
      <section className="bg-plum-800 py-16 sm:py-20" aria-label="Quality promise">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-blush-200 uppercase">
              Quality Promise
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-balance text-white sm:text-4xl">
              Beautiful on the outside, delicious all the way through
            </h2>
            <p className="mt-4 leading-relaxed text-white/75">
              We hold every cake to the same standard — whether it&apos;s a small
              chiffon for family tea or a wedding centrepiece.
            </p>
            <ul className="mt-6 space-y-3">
              {qualityCommitments.map((q) => (
                <li key={q} className="flex items-start gap-3 text-sm text-white/90">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blush-400/25 text-xs font-bold text-blush-200"
                  >
                    ✓
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/20">
            <Image
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=900&auto=format&fit=crop"
              alt="Close-up of a rich premium celebration cake"
              width={900}
              height={700}
              loading="lazy"
              className="aspect-[9/7] w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>

      {/* Custom cakes */}
      <section className="bg-cream-100 py-16 sm:py-20" aria-label="Custom cakes">
        <SectionHeading
          eyebrow="Made Just For You"
          title="Custom cakes for unforgettable moments"
          description="Have a theme in mind? Tell us on WhatsApp and we will design around it."
        />
        <Container className="grid gap-5 sm:grid-cols-2">
          {customCakePoints.map((c) => (
            <div
              key={c.title}
              className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_35px_rgba(74,29,93,0.07)] ring-1 ring-plum-700/10 sm:p-7"
            >
              <h3 className="font-display text-xl font-bold text-plum-800">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-plum-900/65">{c.text}</p>
            </div>
          ))}
        </Container>
        <Container className="mt-6">
          <p className="mx-auto max-w-2xl rounded-2xl bg-white/70 px-5 py-4 text-center text-xs leading-relaxed font-medium text-plum-800 ring-1 ring-plum-700/10">
            {content.business.decorationNotice} {content.business.depositNotice}
          </p>
          <div className="mt-6 text-center">
            <Button href="/order" variant="primary">
              Start a Custom Order →
            </Button>
          </div>
        </Container>
      </section>

      {/* Occasions */}
      <section className="bg-white py-16 sm:py-20" aria-label="Celebration occasions">
        <SectionHeading
          eyebrow="Occasions"
          title="Whatever you are celebrating"
          description="If there is cake involved, we want to bake it."
        />
        <Container>
          <ul className="flex flex-wrap justify-center gap-3" aria-label="Occasions we bake for">
            {celebrationOccasions.map((occasion) => (
              <li
                key={occasion}
                className="rounded-full bg-cream-100 px-6 py-3 text-sm font-bold text-plum-800 ring-1 ring-plum-700/12"
              >
                {occasion}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Testimonials */}
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

      <WhatsAppCta />
    </>
  );
}
