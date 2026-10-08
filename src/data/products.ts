/**
 * Centralized product data for Euna's Bakes.
 *
 * RULE: All prices, flavours and categories come from here.
 * UI components must NOT hardcode product information.
 * Future admin (Phase 7) and mobile app will consume this same shape.
 *
 * Prices are in USD. `from: true` means "from $X" (starting price).
 */

export type CakeSize = {
  label: string;
  price: number;
  from?: boolean;
  note?: string;
};

export type CakeCategory = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  sizes: CakeSize[];
  flavours: string[];
  surchargeNote?: string;
  /** Numeric per-order surcharge in USD (machine-readable twin of surchargeNote). */
  surchargePerOrder?: number;
  featured?: boolean;
};

export const cakeCategories: CakeCategory[] = [
  {
    id: "chiffon",
    name: "Chiffon Cakes",
    slug: "chiffon-cakes",
    shortDescription:
      "Light, soft and airy sponge cakes — perfect for everyday celebrations.",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop",
    sizes: [
      { label: "Small", price: 25 },
      { label: "Medium", price: 35, from: true },
      { label: "Mixed Flavours", price: 40, from: true },
      { label: "Large", price: 45, from: true },
    ],
    flavours: ["Vanilla", "Lemon Poppyseed", "Strawberry", "Cookies and Cream"],
    featured: true,
  },
  {
    id: "premium",
    name: "Premium Cakes",
    slug: "premium-cakes",
    shortDescription:
      "Rich, indulgent flavours for birthdays, weddings and special moments.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    sizes: [
      { label: "Small", price: 35, from: true },
      { label: "Medium", price: 45, from: true },
      { label: "Mixed Flavours", price: 50, from: true },
      { label: "Large", price: 55, from: true },
    ],
    flavours: ["Chocolate", "Choc-Mint", "Red Velvet", "Carrot", "Black Forest"],
    surchargeNote: "+$5 extra on every order",
    surchargePerOrder: 5,
    featured: true,
  },
  {
    id: "butter",
    name: "Butter Based Cakes",
    slug: "butter-based-cakes",
    shortDescription:
      "Dense, buttery and luxurious — our most premium celebration cakes.",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
    sizes: [
      { label: "Small", price: 50, from: true },
      { label: "Medium", price: 65, from: true },
      { label: "Large", price: 80, from: true },
    ],
    flavours: ["Classic Butter", "Vanilla Bean", "Chocolate Butter"],
    featured: true,
  },
];

/** Featured products shown on the homepage (Phase 1). References categories above. */
export type FeaturedProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  startingPrice: number;
  priceSuffix: string;
  image: string;
  tag?: string;
};

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "featured-chiffon-vanilla",
    categoryId: "chiffon",
    name: "Classic Vanilla Chiffon",
    description: "Feather-light vanilla sponge with silky smooth frosting.",
    startingPrice: 25,
    priceSuffix: "Small · $25",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop",
    tag: "Bestseller",
  },
  {
    id: "featured-premium-redvelvet",
    categoryId: "premium",
    name: "Red Velvet Celebration",
    description: "Signature red velvet layers with cream-cheese frosting.",
    startingPrice: 35,
    priceSuffix: "Small · from $35",
    image:
      "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&auto=format&fit=crop",
    tag: "Most Loved",
  },
  {
    id: "featured-butter-classic",
    categoryId: "butter",
    name: "Luxury Butter Cake",
    description: "Rich, dense butter crumb finished with elegant piping.",
    startingPrice: 50,
    priceSuffix: "Small · from $50",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop",
    tag: "Premium",
  },
];

/** Format a price for display, respecting "from" semantics. */
export function formatPrice(price: number, from = false): string {
  return `${from ? "from " : ""}$${price}`;
}

/**
 * Cake-type options for the order builder (Phase 3).
 * Grounded in real business data — no invented products:
 * - "standard": a regular cake from the menu (priced from the size table).
 * - "mixed-flavours": the Mixed Flavours rows on the menu (chiffon & premium).
 * - "custom": custom baked products per the business description; always
 *   quoted individually, so no automatic estimate is shown for these.
 */
export type CakeTypeOption = {
  id: "standard" | "mixed-flavours" | "custom";
  label: string;
  description: string;
};

export const cakeTypeOptions: CakeTypeOption[] = [
  {
    id: "standard",
    label: "Standard cake",
    description: "A classic cake in your chosen flavour and size.",
  },
  {
    id: "mixed-flavours",
    label: "Mixed flavours",
    description: "More than one flavour in a single cake (menu Mixed Flavours pricing).",
  },
  {
    id: "custom",
    label: "Custom cake",
    description: "Custom design or special request — quoted individually on WhatsApp.",
  },
];

/* ------------------------------------------------------------------ */
/* Placeholders — clearly marked for the owner to replace later.       */
/* Do NOT present these as real reviews or real gallery photos.        */
/* ------------------------------------------------------------------ */

export type TestimonialPlaceholder = {
  id: string;
  quote: string;
  name: string;
  occasion: string;
  /** True while awaiting a genuine review — shown labelled on the website. */
  isPlaceholder: boolean;
};

export const testimonialPlaceholders: TestimonialPlaceholder[] = [
  {
    id: "t1",
    quote:
      "Placeholder review — real customer stories from Euna's Bakes celebrations will appear here.",
    name: "Happy Customer",
    occasion: "Birthday Cake",
    isPlaceholder: true,
  },
  {
    id: "t2",
    quote:
      "Placeholder review — the bakery owner can replace this with genuine testimonials.",
    name: "Happy Customer",
    occasion: "Wedding Cake",
    isPlaceholder: true,
  },
  {
    id: "t3",
    quote:
      "Placeholder review — every celebration deserves handcrafted sweetness.",
    name: "Happy Customer",
    occasion: "Custom Order",
    isPlaceholder: true,
  },
];

export type GalleryPlaceholder = {
  id: string;
  image: string;
  alt: string;
};

export const galleryPlaceholders: GalleryPlaceholder[] = [
  {
    id: "g1",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    alt: "Placeholder gallery image — chocolate celebration cake",
  },
  {
    id: "g2",
    image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
    alt: "Placeholder gallery image — berry birthday cake",
  },
  {
    id: "g3",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=600&auto=format&fit=crop",
    alt: "Placeholder gallery image — cupcakes",
  },
  {
    id: "g4",
    image:
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=600&auto=format&fit=crop",
    alt: "Placeholder gallery image — frosted cake slice",
  },
];
