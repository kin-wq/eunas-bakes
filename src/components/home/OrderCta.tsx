import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getSiteContent } from "@/lib/content";

/** Mid-page order CTA — conversion-focused banner. */
export async function OrderCta() {
  const content = await getSiteContent();
  return (
    <section className="bg-white pb-16 sm:pb-20" aria-label="How to order">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-plum-800 px-6 py-12 sm:px-12 lg:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-blush-400/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="text-center lg:text-left">
              <p className="text-xs font-semibold tracking-[0.22em] text-blush-200 uppercase">
                Simple ordering
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold text-balance text-white sm:text-4xl">
                Ready to order your cake?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base lg:mx-0">
                Three steps: pick your collection, choose a size &amp; flavour, then send
                it to us on WhatsApp. We confirm availability and your final price.
              </p>
              <ol className="mx-auto mt-6 flex max-w-lg flex-col gap-2 text-left text-sm text-white/85 sm:flex-row sm:gap-4 lg:mx-0">
                <li className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="font-bold text-blush-200">1.</span> Choose cake
                </li>
                <li className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="font-bold text-blush-200">2.</span> Send on WhatsApp
                </li>
                <li className="flex-1 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="font-bold text-blush-200">3.</span> Pay 50% deposit
                </li>
              </ol>
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <WhatsAppButton label="Start Your Order" internationalNumber={content.whatsapp.internationalNumber} />
                <Button href="/order" variant="outline-light">
                  Order Page
                </Button>
              </div>
            </div>
            <div className="relative mx-auto hidden w-full max-w-xs lg:block">
              <div className="overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=600&auto=format&fit=crop"
                  alt="Elegant frosted cake slice"
                  width={500}
                  height={620}
                  loading="lazy"
                  className="aspect-[5/6] w-full object-cover"
                  sizes="320px"
                />
              </div>
              <p className="absolute -bottom-4 left-1/2 w-max -translate-x-1/2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-plum-800 shadow-lg">
                {content.business.depositNotice}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
