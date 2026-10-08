import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getSiteContent } from "@/lib/content";

/** Final conversion block with WhatsApp CTA. */
export async function WhatsAppCta() {
  const content = await getSiteContent();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blush-100 via-cream-100 to-cream-200 py-16 sm:py-20" aria-label="Chat on WhatsApp">
      <Container className="relative text-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-plum-600 uppercase">
          Fastest response
        </p>
        <h2 className="font-display mx-auto mt-3 max-w-2xl text-3xl font-bold text-balance text-plum-800 sm:text-4xl">
          Have a date in mind? Let&apos;s bake it happen.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-plum-900/70">
          Message us on WhatsApp with your cake idea, size and date — we&apos;ll
          confirm availability and your final price.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WhatsAppButton
            label={`WhatsApp ${content.whatsapp.displayNumber}`}
            internationalNumber={content.whatsapp.internationalNumber}
            className="px-8 py-1 text-base"
          />
        </div>
        <p className="mt-5 text-xs text-plum-900/55">{content.business.depositNotice}</p>
      </Container>
    </section>
  );
}
