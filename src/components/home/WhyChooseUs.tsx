import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    title: "Professional quality",
    text: "Structured layers, smooth finishes and balanced sweetness in every slice.",
    icon: "✦",
  },
  {
    title: "Made for occasions",
    text: "Birthdays, weddings, graduations, baby showers — designed around your theme.",
    icon: "♥",
  },
  {
    title: "Easy WhatsApp ordering",
    text: "Browse, tap to order, and confirm your date and price directly with us.",
    icon: "✉",
  },
  {
    title: "Transparent process",
    text: "Clear starting prices plus a 50% deposit to secure your date. No surprises.",
    icon: "✓",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream-100 py-16 sm:py-20" aria-label="Why choose Euna's Bakes">
      <SectionHeading
        eyebrow="Why Euna's Bakes"
        title="Bakes you can trust for your biggest moments"
        description="We keep it simple: beautiful cakes, honest communication, and flavours worth celebrating."
      />
      <Container className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_10px_35px_rgba(74,29,93,0.07)] ring-1 ring-plum-700/10"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-700 to-blush-400 text-xl text-white shadow-md"
            >
              {r.icon}
            </span>
            <h3 className="mt-4 text-base font-bold text-plum-800">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-900/65">{r.text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
