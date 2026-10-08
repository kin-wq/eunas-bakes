import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getSiteContent } from "@/lib/content";

export async function Hero() {
  const content = await getSiteContent();
  return (
    <section className="relative overflow-hidden bg-cream-100 pt-[68px]" aria-label={`Welcome to ${content.brand.name}`}>
      {/* soft brand blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/60 blur-3xl" />
        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-plum-500/10 blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="animate-fade-up text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-plum-700 uppercase ring-1 ring-plum-700/10 backdrop-blur">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-blush-500" />
            Professional Bakery · Custom Cakes
          </p>
          <h1 className="font-display mt-5 text-4xl leading-[1.08] font-bold text-balance text-plum-800 sm:text-5xl lg:text-[3.6rem]">
            {content.brand.tagline}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-plum-900/70 sm:text-lg lg:mx-0">
            From feather-light chiffon to rich premium layers and luxurious butter
            cakes — baked to order for birthdays, weddings and sweet everyday moments.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <WhatsAppButton label="Order on WhatsApp" showNumber number={content.whatsapp.displayNumber} internationalNumber={content.whatsapp.internationalNumber} />
            <Button href="/menu" variant="secondary">
              Browse the Menu
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
            <div>
              <p className="font-display text-2xl font-bold text-plum-800">3</p>
              <p className="text-xs font-medium tracking-wide text-plum-900/60 uppercase">Cake Collections</p>
            </div>
            <div className="h-10 w-px bg-plum-700/15" aria-hidden="true" />
            <div>
              <p className="font-display text-2xl font-bold text-plum-800">from $25</p>
              <p className="text-xs font-medium tracking-wide text-plum-900/60 uppercase">Chiffon Small</p>
            </div>
            <div className="h-10 w-px bg-plum-700/15" aria-hidden="true" />
            <div>
              <p className="font-display text-2xl font-bold text-plum-800">50%</p>
              <p className="text-xs font-medium tracking-wide text-plum-900/60 uppercase">Deposit to Secure</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-plum-800/20 ring-1 ring-plum-900/10">
            <Image
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
              alt="Signature chocolate celebration cake by Euna's Bakes"
              width={900}
              height={1100}
              priority
              className="aspect-[4/5] w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* glassmorphism price card */}
          <div className="absolute -bottom-5 left-4 right-4 rounded-3xl bg-white/75 p-4 shadow-xl ring-1 ring-white/60 backdrop-blur-xl sm:left-6 sm:right-auto sm:min-w-[280px]">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-plum-600 uppercase">
              Starting from
            </p>
            <p className="font-display text-2xl font-bold text-plum-800">
              $25 <span className="text-sm font-medium text-plum-900/60">· Chiffon Small</span>
            </p>
            <p className="mt-1 text-xs text-plum-900/60">{content.business.depositNotice}</p>
          </div>
          <div className="absolute -top-4 -right-2 rounded-full bg-plum-700 px-4 py-2 text-xs font-semibold text-white shadow-lg sm:right-4">
            Baked to order
          </div>
        </div>
      </Container>
    </section>
  );
}
