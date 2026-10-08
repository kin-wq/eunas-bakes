import { getWhatsAppLink } from "@/lib/whatsapp";
import { cakeCategories, type CakeCategory } from "@/data/products";
import {
  calculateEstimate,
  formatUSD,
  getCakeTypeLabel,
  getCategoryName,
  FINAL_PRICE_NOTE,
  type OrderDetails,
} from "@/lib/order";

/**
 * Phase 4 — WhatsApp order integration.
 * Builds the customer order into the business-approved WhatsApp message
 * format and wraps it in a wa.me link (works on Android, iPhone, Desktop).
 * Number comes from central site config via getWhatsAppLink — never hardcoded.
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-10-15" -> "15 October 2026" (parsed as local time, no UTC shift). */
export function formatLongDate(isoDate: string): string {
  const parts = isoDate.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n))) return isoDate;
  const [year, month, day] = parts;
  if (month < 1 || month > 12 || day < 1 || day > 31) return isoDate;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function yesNo(value: "" | "yes" | "no"): string {
  return value === "yes" ? "Yes" : "No";
}

/** Auto-generated order message in the business-approved format. */
export function buildOrderMessage(
  order: OrderDetails,
  categories: CakeCategory[] = cakeCategories
): string {
  const estimate = calculateEstimate(order, categories);
  const lines: string[] = [
    "Hello Euna's Bakes 👋",
    "",
    "I would like to place an order.",
    "",
    `Cake: ${getCategoryName(order.categoryId, categories)}`,
    `Cake Type: ${getCakeTypeLabel(order.cakeTypeId)}`,
    `Size: ${order.sizeLabel}`,
    `Flavour: ${order.flavour}`,
    `Quantity: ${order.quantity}`,
    "",
    `Decoration: ${yesNo(order.decoration)}`,
    `Edible Print: ${yesNo(order.ediblePrint)}`,
    `Non-edible Print: ${yesNo(order.nonEdiblePrint)}`,
    "",
    `Preferred Date: ${formatLongDate(order.preferredDate)}`,
    `Order Type: ${order.fulfilment === "delivery" ? "Delivery" : "Pickup"}`,
    "",
    `Customer Name: ${order.customerName.trim()}`,
    `Phone: ${order.customerPhone.trim()}`,
    "",
    "Additional Notes:",
    order.notes.trim() ? order.notes.trim() : "(none)",
    "",
  ];

  if (estimate.calculable) {
    lines.push(
      `Estimated Subtotal: ${formatUSD(estimate.subtotal)} (Estimated 50% deposit: ${formatUSD(estimate.deposit)})`,
      ""
    );
  } else {
    lines.push(`${FINAL_PRICE_NOTE}`, "");
  }

  lines.push("Please confirm availability and the final price.", "", "Thank you.");

  return lines.join("\n");
}

/** Direct wa.me redirect link carrying the full order message. */
export function getOrderWhatsAppLink(
  order: OrderDetails,
  options?: { categories?: CakeCategory[]; internationalNumber?: string }
): string {
  return getWhatsAppLink(
    buildOrderMessage(order, options?.categories ?? cakeCategories),
    options?.internationalNumber
  );
}
