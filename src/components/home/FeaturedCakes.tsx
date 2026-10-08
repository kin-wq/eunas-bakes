import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteContent } from "@/lib/content";

export async function FeaturedCakes() {
  const content = await getSiteContent();
  const featuredProducts = content.featured;
  return (
    <section className="bg-white py-16 sm:py-20" aria-label="Featured cakes">
      <SectionHeading
        eyebrow="Customer Favourites"
        title="Featured cakes"
        description={`A taste of what ${content.brand.name} does best. Full sizes, flavours and prices live on the menu.`}
      />
      <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[1.75rem] bg-cream-50 shadow-[0_10px_40px_rgba(74,29,93,0.08)] ring-1 ring-plum-700/10 transition-transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={700}
                height={500}
                loading="lazy"
                className="aspect-[7/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {product.tag ? (
                <span className="absolute top-4 left-4 rounded-full bg-plum-700/90 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {product.tag}
                </span>
              ) : null}
            </div>
            <div className="p-6">
              <p className="font-display text-xl font-bold text-plum-800">{product.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-plum-900/65">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-plum-700">{product.priceSuffix}</p>
                <Link
                  href="/menu"
                  className="rounded-full bg-plum-700/10 px-4 py-2 text-xs font-semibold text-plum-700 transition-colors hover:bg-plum-700 hover:text-white"
                  aria-label={`View ${product.name} on the menu`}
                >
                  View →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </Container>
      <Container className="mt-8 text-center">
        <Link
          href="/menu"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-plum-700 px-8 text-sm font-semibold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800"
        >
          View Full Menu
        </Link>
      </Container>
    </section>
  );
}
