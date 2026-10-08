import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OrderBuilder } from "@/components/order/OrderBuilder";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Build your custom cake order at Euna's Bakes — category, size, flavour, decoration, date and pickup or delivery — with an instant estimated subtotal.",
  ...canonicalMeta("/order"),
};

export default async function OrderPage() {
  const content = await getSiteContent();
  return (
    <>
      <section className="relative overflow-hidden bg-cream-100" aria-label="Order your cake">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
        </div>
        <Container className="relative py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            Order Builder
          </p>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight font-bold text-balance text-plum-800 sm:text-5xl">
            Design your perfect cake
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
            Answer four quick steps and watch your order summary and estimated
            subtotal update live. No payment online — you confirm everything with
            us first.
          </p>
          <p className="mx-auto mt-6 max-w-xl rounded-2xl bg-white/70 px-4 py-3 text-xs leading-relaxed font-medium text-plum-800 ring-1 ring-plum-700/10 backdrop-blur">
            {content.business.depositNotice}
          </p>
        </Container>
      </section>

      <section className="bg-cream-50 py-10 sm:py-14" aria-label="Order form">
        <Container>
          <OrderBuilder
            categories={content.categories}
            typeOptions={content.cakeTypeOptions}
            depositNotice={content.business.depositNotice}
            whatsappNumber={content.whatsapp.internationalNumber}
          />
        </Container>
      </section>
    </>
  );
}
