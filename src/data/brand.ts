/**
 * Central brand content for Euna's Bakes (Phase 5).
 *
 * OWNER GUIDE: everything on the About / Contact / Gallery pages reads from
 * here. Replace any section flagged `isPlaceholder: true` with the real
 * bakery story, photos and details — no code changes needed elsewhere.
 */

export type PlaceholderSection = {
  /** True while the copy below is a stand-in awaiting the owner's real text. */
  isPlaceholder: boolean;
};

export const brandStory = {
  isPlaceholder: true,
  heading: "Baked with love, made to celebrate",
  paragraphs: [
    "Euna's Bakes began with a simple belief: every celebration deserves a cake made with genuine care. From a home kitchen armed with treasured recipes, each order is still baked to order — never rushed, never mass-produced.",
    "Today, Euna's Bakes crafts chiffon, premium and butter-based cakes for birthdays, weddings and everyday sweet moments, finishing every cake by hand and confirming every detail with you personally on WhatsApp.",
  ],
  ownerNote:
    "Placeholder story — the bakery owner should replace these paragraphs with the real Euna's Bakes journey.",
} as const;

export const philosophyPillars = [
  {
    title: "Fresh to order",
    text: "Nothing sits on a shelf. Your cake is baked for your date, so it arrives at its very best.",
  },
  {
    title: "Honest pricing",
    text: "Clear starting prices on the menu, confirmed quotes on WhatsApp, and a 50% deposit to secure your date.",
  },
  {
    title: "Made for your moment",
    text: "Colours, themes, messages and prints — designed around your celebration, not a catalogue.",
  },
  {
    title: "Personal service",
    text: "You speak directly with the baker, from first enquiry to final confirmation.",
  },
] as const;

export const qualityCommitments = [
  "Every cake baked to order for your celebration date",
  "Careful finishing — smooth frosting, neat piping, elegant presentation",
  "Flavours balanced for sweetness, texture and freshness",
  "Custom requests confirmed with you before anything is baked",
] as const;

export const customCakePoints = [
  {
    title: "Themed celebration cakes",
    text: "Birthday and party themes in your colours, with a personal message.",
  },
  {
    title: "Wedding & milestone cakes",
    text: "Elegant centrepieces for weddings, anniversaries and graduations.",
  },
  {
    title: "Edible & non-edible prints",
    text: "Photo and character prints for a personal touch (extra fee applies).",
  },
  {
    title: "Fancy decorations",
    text: "Toppers, florals and finishes to match your style (extra fee applies).",
  },
] as const;

export const celebrationOccasions = [
  "Birthdays",
  "Weddings",
  "Graduations",
  "Baby Showers",
  "Anniversaries",
  "Bridal Showers",
  "Corporate Events",
  "Everyday Treats",
] as const;

export const galleryNote = {
  isPlaceholder: true,
  text: "Sample styling shown — these photos illustrate the look and finish to expect. The owner will replace them with real Euna's Bakes creations.",
} as const;
