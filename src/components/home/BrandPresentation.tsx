import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const points = [
  { title: "Baked to order", text: "Every cake is freshly prepared for your celebration — never mass-produced." },
  { title: "Custom designs", text: "Elegant finishes, edible and non-edible prints for your theme." },
  { title: "Honest pricing", text: "Clear sizes and starting prices, confirmed on WhatsApp before you pay." },
];

export function BrandPresentation() {
  return (
    <section className="bg-cream-50 py-16 sm:py-20" aria-label="About Euna's Bakes">
      <SectionHeading
        eyebrow="Our Bakery"
        title="A premium bakery, built around your celebration"
        description="Euna's Bakes blends professional technique with homemade warmth — beautiful cakes that taste as good as they look."
      />
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-3xl shadow-lg shadow-plum-800/10">
            <Image
              src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop"
              alt="Berry-topped celebration cake"
              width={600}
              height={700}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="mt-8 overflow-hidden rounded-3xl shadow-lg shadow-plum-800/10">
            <Image
              src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=600&auto=format&fit=crop"
              alt="Assorted frosted cupcakes"
              width={600}
              height={700}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-plum-800 sm:text-3xl">
            Handcrafted sweetness in every bite — made for birthdays, weddings &amp; more.
          </h3>
          <ul className="mt-6 space-y-4">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-plum-700/10">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blush-100 text-plum-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-plum-800">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-plum-900/65">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/about" variant="primary">
              Our Story
            </Button>
            <Button href="/gallery" variant="secondary">
              See the Gallery
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
