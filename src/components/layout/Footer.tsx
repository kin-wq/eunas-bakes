import Link from "next/link";
import { siteConfig } from "@/data/site";
import { getSiteContent } from "@/lib/content";
import { getWhatsAppLink } from "@/lib/whatsapp";

export async function Footer() {
  const content = await getSiteContent();
  return (
    <footer className="bg-plum-800 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
              E
            </span>
            <div className="leading-tight">
              <p className="font-display text-xl font-bold">{content.brand.name}</p>
              <p className="text-xs tracking-[0.16em] text-white/60 uppercase">
                {content.brand.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            {content.brand.description}
          </p>
          <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-xs leading-relaxed text-white/80 backdrop-blur">
            {content.business.depositNotice}
            <br />
            {content.business.decorationNotice}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold tracking-[0.2em] text-blush-200 uppercase">
            Explore
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-blush-200 uppercase">
            Order
          </p>
          <p className="mt-4 text-sm text-white/80">
            Fastest way to order — chat with us directly:
          </p>
          <a
            href={getWhatsAppLink(undefined, content.whatsapp.internationalNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#1fa855] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#178a45]"
          >
            WhatsApp · {content.whatsapp.displayNumber}
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/60">
            {content.business.locationPlaceholder}
            <br />
            {content.business.hoursPlaceholder}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:px-8">
          <p>
            © 2026 {content.brand.name}. All rights reserved.
          </p>
          <p>{content.brand.developer}</p>
        </div>
      </div>
    </footer>
  );
}
