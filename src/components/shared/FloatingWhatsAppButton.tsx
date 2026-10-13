import { siteConfig } from "@/data/site";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Button";

/**
 * Site-wide floating WhatsApp shortcut (Phase 4).
 * A direct wa.me redirect — no fake chat UI. Hidden from print.
 */
export function FloatingWhatsAppButton({
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
}: {
  whatsappNumber?: string;
}) {
  return (
    <a
      href={getWhatsAppLink(undefined, whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${siteConfig.businessName}`}
      title={`WhatsApp ${siteConfig.businessName}`}
      className="fixed right-5 bottom-[max(6.25rem,calc(env(safe-area-inset-bottom)+5rem))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-xl shadow-green-900/30 ring-4 ring-white/60 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:outline-none print:hidden lg:bottom-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
