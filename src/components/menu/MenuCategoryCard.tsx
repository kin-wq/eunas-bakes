import Image from "next/image";
import type { CakeCategory } from "@/data/products";
import { formatPrice } from "@/data/products";
import { siteConfig } from "@/data/site";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Button";

/**
 * Presentational menu card for one cake category.
 * Server-safe (no hooks). All prices/flavours come from live content via props.
 */
export function MenuCategoryCard({
  category,
  brandName = "Euna's Bakes",
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
}: {
  category: CakeCategory;
  brandName?: string;
  whatsappNumber?: string;
}) {
  const enquiryMessage = `Hello ${brandName}! I would like to enquire about your ${category.name}.`;
  const lowest = category.sizes.reduce((a, b) => (a.price <= b.price ? a : b));

  return (
    <article
      id={`menu-${category.slug}`}
      aria-label={category.name}
      className="flex scroll-mt-24 flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_rgba(74,29,93,0.08)] ring-1 ring-plum-700/10"
    >
      <div className="relative">
        <Image
          src={category.image}
          alt={`${category.name} by ${brandName}`}
          width={800}
          height={420}
          loading="lazy"
          className="aspect-[16/8] w-full object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-plum-900/60 via-plum-900/10 to-transparent"
        />
        <div className="absolute right-5 bottom-4 left-5 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-white drop-shadow sm:text-[1.7rem]">
            {category.name}
          </h2>
          <p className="shrink-0 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-plum-800 backdrop-blur">
            From ${lowest.price}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <p className="text-sm leading-relaxed text-plum-900/70 sm:text-[15px]">
          {category.shortDescription}
        </p>

        <h3 className="mt-6 text-xs font-bold tracking-[0.2em] text-plum-600 uppercase">
          Sizes &amp; Prices
        </h3>
        <ul className="mt-3 divide-y divide-dashed divide-plum-700/15 overflow-hidden rounded-2xl bg-cream-50 ring-1 ring-plum-700/10">
          {category.sizes.map((size) => (
            <li
              key={size.label}
              className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
            >
              <div>
                <p className="text-[15px] font-bold text-plum-800">{size.label}</p>
                {size.note ? (
                  <p className="text-xs text-plum-900/55">{size.note}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-lg font-bold whitespace-nowrap text-plum-700">
                  {formatPrice(size.price, size.from)}
                </p>
                <a
                  href={getWhatsAppLink(
                    `Hello ${brandName}! I would like to enquire about ${category.name} — ${size.label} (${formatPrice(size.price, size.from)}).`,
                    whatsappNumber
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enquire about ${category.name}, ${size.label} on WhatsApp`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1fa855]/10 text-[#178a45] transition-colors hover:bg-[#1fa855] hover:text-white"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </li>
          ))}
        </ul>

        {category.surchargeNote ? (
          <p className="mt-3 rounded-xl bg-blush-100 px-4 py-2.5 text-xs font-bold text-plum-700">
            Note: {category.surchargeNote}
          </p>
        ) : null}

        <h3 className="mt-6 text-xs font-bold tracking-[0.2em] text-plum-600 uppercase">
          Flavours
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${category.name} flavours`}>
          {category.flavours.map((flavour) => (
            <li
              key={flavour}
              className="rounded-full bg-plum-700/8 px-4 py-2 text-[13px] font-semibold text-plum-800 ring-1 ring-plum-700/12"
            >
              {flavour}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-dashed border-plum-700/15 pt-5">
          <WhatsAppButton
            message={enquiryMessage}
            internationalNumber={whatsappNumber}
            label={`Enquire about ${category.name}`}
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
