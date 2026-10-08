import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice } from "@/data/products";
import { getSiteContent } from "@/lib/content";

export async function CakeCategories() {
  const content = await getSiteContent();
  const cakeCategories = content.categories;
  return (
    <section className="bg-white py-16 sm:py-20" aria-label="Cake categories">
      <SectionHeading
        eyebrow="Our Collections"
        title="Three collections, one promise: delicious"
        description="Every collection is baked to order. Prices below are starting prices — final quotes are confirmed on WhatsApp."
      />
      <Container className="grid gap-6 md:grid-cols-3">
        {cakeCategories.map((cat) => {
          const lowest = cat.sizes.reduce((a, b) => (a.price <= b.price ? a : b));
          return (
            <article
              key={cat.id}
              className="flex flex-col overflow-hidden rounded-[1.75rem] bg-cream-50 ring-1 ring-plum-700/10 shadow-[0_10px_40px_rgba(74,29,93,0.08)]"
            >
              <div className="relative">
                <Image
                  src={cat.image}
                  alt={`${cat.name} by ${content.brand.name}`}
                  width={700}
                  height={450}
                  loading="lazy"
                  className="aspect-[7/4.5] w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-900/55 via-transparent to-transparent" aria-hidden="true" />
                <h3 className="font-display absolute bottom-4 left-5 text-2xl font-bold text-white drop-shadow">
                  {cat.name}
                </h3>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-relaxed text-plum-900/65">{cat.shortDescription}</p>
                <ul className="mt-4 space-y-2 text-sm" aria-label={`${cat.name} starting prices`}>
                  {cat.sizes.slice(0, 3).map((s) => (
                    <li key={s.label} className="flex items-center justify-between border-b border-dashed border-plum-700/15 pb-2">
                      <span className="font-medium text-plum-900/75">{s.label}</span>
                      <span className="font-bold text-plum-800">{formatPrice(s.price, s.from)}</span>
                    </li>
                  ))}
                </ul>
                {cat.surchargeNote ? (
                  <p className="mt-3 rounded-xl bg-blush-100 px-3 py-2 text-xs font-semibold text-plum-700">
                    {cat.surchargeNote}
                  </p>
                ) : null}
                <p className="mt-3 text-xs text-plum-900/55">
                  Flavours: {cat.flavours.join(" · ")}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-plum-700/10 pt-4">
                  <p className="text-sm">
                    <span className="text-plum-900/55">From </span>
                    <span className="font-display text-xl font-bold text-plum-800">
                      ${lowest.price}
                    </span>
                  </p>
                  <Link
                    href="/menu"
                    className="rounded-full bg-plum-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-plum-800"
                    aria-label={`Explore ${cat.name}`}
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
