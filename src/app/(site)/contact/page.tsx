import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getSiteContent } from "@/lib/content";
import { canonicalMeta } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Euna's Bakes — order and enquire on WhatsApp, plus business information, hours and how ordering works.",
  ...canonicalMeta("/contact"),
};

const orderSteps = [
  { title: "Browse & build", text: "Explore the menu, then design your cake on the order page." },
  { title: "Send on WhatsApp", text: "Your order arrives with us as a ready-to-send message." },
  { title: "We confirm", text: "Availability, final price and collection details — personally." },
  { title: "Secure with 50%", text: "A non-refundable deposit locks in your date." },
];

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <>
      <section className="relative overflow-hidden bg-cream-100" aria-label="Contact Euna's Bakes">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
          <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
        </div>
        <Container className="relative py-12 text-center sm:py-16">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            Get In Touch
          </p>
          <h1 className="font-display mx-auto mt-5 max-w-2xl text-4xl leading-tight font-bold text-balance text-plum-800 sm:text-5xl">
            Let&apos;s talk cake
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
            The fastest way to reach us is WhatsApp — enquiries, orders and
            confirmations all happen there, directly with the baker.
          </p>
          <div className="mt-7 flex justify-center">
            <WhatsAppButton
              label={`WhatsApp ${content.whatsapp.displayNumber}`}
              internationalNumber={content.whatsapp.internationalNumber}
              className="px-8 text-base"
            />
          </div>
        </Container>
      </section>

      {/* Contact methods */}
      <section className="bg-cream-50 py-16 sm:py-20" aria-label="Contact methods">
        <SectionHeading
          eyebrow="Reach Us"
          title="How to contact the bakery"
        />
        <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={getWhatsAppLink(undefined, content.whatsapp.internationalNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[1.75rem] bg-white p-6 ring-1 ring-plum-700/10 transition-transform hover:-translate-y-1"
            aria-label="Chat on WhatsApp"
          >
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1fa855]/10 text-xl">
              ✆
            </span>
            <h2 className="mt-4 font-bold text-plum-800">WhatsApp</h2>
            <p className="mt-1 text-sm font-semibold text-[#178a45]">
              {content.whatsapp.displayNumber}
            </p>
            <p className="mt-1 text-xs text-plum-900/55">
              Orders, enquiries &amp; confirmations — fastest response.
            </p>
          </a>
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-plum-700/10">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-700/10 text-xl">
              ☎
            </span>
            <h2 className="mt-4 font-bold text-plum-800">Phone</h2>
            <p className="mt-1 text-sm font-semibold text-plum-700">
              {content.whatsapp.displayNumber}
            </p>
            <p className="mt-1 text-xs text-plum-900/55">
              Call or WhatsApp — same number, same friendly baker.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-plum-700/10">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-700/10 text-xl">
              ◉
            </span>
            <h2 className="mt-4 font-bold text-plum-800">Location</h2>
            <p className="mt-1 text-sm text-plum-900/70">
              {content.business.locationPlaceholder}
            </p>
            <p className="mt-1 text-xs text-plum-900/55 italic">
              Exact pickup details shared on confirmation.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-plum-700/10">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum-700/10 text-xl">
              ◷
            </span>
            <h2 className="mt-4 font-bold text-plum-800">Hours</h2>
            <p className="mt-1 text-sm text-plum-900/70">
              {content.business.hoursPlaceholder}
            </p>
            <p className="mt-1 text-xs text-plum-900/55 italic">
              Order ahead — cakes are baked to order.
            </p>
          </div>
        </Container>
      </section>

      {/* Business information */}
      <section className="bg-white py-16 sm:py-20" aria-label="Business information">
        <SectionHeading
          eyebrow="Good To Know"
          title="Business information"
          description="Everything worth knowing before you place your order."
        />
        <Container className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[1.75rem] bg-cream-50 p-6 ring-1 ring-plum-700/10 sm:p-8">
            <h2 className="font-display text-xl font-bold text-plum-800">
              Ordering &amp; payment
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-plum-900/70">
              <li>· {content.business.depositNotice}</li>
              <li>· {content.business.decorationNotice}</li>
              <li>· No online payments — everything is confirmed with you first.</li>
              <li>· Final prices are always confirmed on WhatsApp before you pay.</li>
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-plum-800 p-6 text-white sm:p-8">
            <h2 className="font-display text-xl font-bold">How ordering works</h2>
            <ol className="mt-4 space-y-4">
              {orderSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-blush-200"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
        <Container className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton label="Message Us on WhatsApp" />
          <Button href="/order" variant="secondary">
            Build Your Order
          </Button>
        </Container>
      </section>
    </>
  );
}
