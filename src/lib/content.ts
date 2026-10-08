import { promises as fs } from "node:fs";
import path from "node:path";
import { cacheTag } from "next/cache";
import { siteConfig } from "@/data/site";
import {
  cakeCategories,
  cakeTypeOptions,
  featuredProducts,
  galleryPlaceholders,
  testimonialPlaceholders,
  type CakeCategory,
  type CakeTypeOption,
  type FeaturedProduct,
  type GalleryPlaceholder,
  type TestimonialPlaceholder,
} from "@/data/products";

/**
 * Phase 7 — central content layer.
 *
 * Public pages/components read editable site content through `getSiteContent()`
 * (cached, tag: "site-content") instead of importing static data directly.
 * The admin panel writes sparse overrides to `content/overrides.json`; saving
 * calls `updateTag("site-content")` so edits appear immediately.
 * The same merged content is served to the future native app via /api/content.
 *
 * NOTE: file-based storage persists on traditional hosting/VPS. On
 * ephemeral/serverless hosting, point OVERRIDES_PATH at persistent storage
 * or replace readOverrides/writeOverrides with a database adapter.
 */

export type Promotion = {
  id: string;
  title: string;
  message: string;
  active: boolean;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    description: string;
    developer: string;
  };
  whatsapp: {
    displayNumber: string;
    internationalNumber: string;
    defaultMessage: string;
  };
  business: {
    depositNotice: string;
    decorationNotice: string;
    locationPlaceholder: string;
    hoursPlaceholder: string;
  };
  categories: CakeCategory[];
  cakeTypeOptions: CakeTypeOption[];
  featured: FeaturedProduct[];
  gallery: GalleryPlaceholder[];
  testimonials: TestimonialPlaceholder[];
  promotions: Promotion[];
};

export const CONTENT_TAG = "site-content";

function baseContent(): SiteContent {
  return {
    brand: {
      name: siteConfig.brand.name,
      tagline: siteConfig.brand.tagline,
      description: siteConfig.brand.description,
      developer: siteConfig.brand.developer,
    },
    whatsapp: {
      displayNumber: siteConfig.whatsapp.displayNumber,
      internationalNumber: siteConfig.whatsapp.internationalNumber,
      defaultMessage: siteConfig.whatsapp.defaultMessage,
    },
    business: {
      depositNotice: siteConfig.business.depositNotice,
      decorationNotice: siteConfig.business.decorationNotice,
      locationPlaceholder: siteConfig.contact.locationPlaceholder,
      hoursPlaceholder: siteConfig.contact.hoursPlaceholder,
    },
    categories: cakeCategories,
    cakeTypeOptions,
    featured: featuredProducts,
    gallery: galleryPlaceholders,
    testimonials: testimonialPlaceholders,
    promotions: [],
  };
}

export function overridesPath(): string {
  return path.join(process.cwd(), "content", "overrides.json");
}

/** Raw overrides as stored on disk (sparse deep-partial of SiteContent). */
export type ContentOverrides = Partial<{
  brand: Partial<SiteContent["brand"]>;
  whatsapp: Partial<SiteContent["whatsapp"]>;
  business: Partial<SiteContent["business"]>;
  categories: CakeCategory[];
  cakeTypeOptions: CakeTypeOption[];
  featured: FeaturedProduct[];
  gallery: GalleryPlaceholder[];
  testimonials: TestimonialPlaceholder[];
  promotions: Promotion[];
}>;

export async function readOverrides(): Promise<ContentOverrides> {
  try {
    const raw = await fs.readFile(overridesPath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as ContentOverrides;
    return {};
  } catch {
    return {};
  }
}

export async function writeOverrides(overrides: ContentOverrides): Promise<void> {
  await fs.mkdir(path.dirname(overridesPath()), { recursive: true });
  await fs.writeFile(overridesPath(), JSON.stringify(overrides, null, 2), "utf8");
}

function mergeContent(base: SiteContent, o: ContentOverrides): SiteContent {
  return {
    brand: { ...base.brand, ...o.brand },
    whatsapp: { ...base.whatsapp, ...o.whatsapp },
    business: { ...base.business, ...o.business },
    categories: o.categories ?? base.categories,
    cakeTypeOptions: o.cakeTypeOptions ?? base.cakeTypeOptions,
    featured: o.featured ?? base.featured,
    gallery: o.gallery ?? base.gallery,
    testimonials: o.testimonials ?? base.testimonials,
    promotions: o.promotions ?? base.promotions,
  };
}

/** Merged live content: base data + admin overrides. Cached until updateTag. */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const overrides = await readOverrides();
  return mergeContent(baseContent(), overrides);
}
