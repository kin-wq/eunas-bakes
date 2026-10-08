import { cakeCategories, cakeTypeOptions, type CakeCategory } from "@/data/products";

/**
 * Order-builder domain logic (Phase 3).
 * Pure functions over central product data — no UI, no WhatsApp formatting.
 * Phase 4 (WhatsApp integration) will consume `OrderDetails` directly.
 */

export type YesNo = "yes" | "no";
export type Fulfilment = "pickup" | "delivery";

export type OrderDetails = {
  categoryId: string;
  cakeTypeId: "" | "standard" | "mixed-flavours" | "custom";
  sizeLabel: string;
  flavour: string;
  quantity: number;
  decoration: "" | YesNo;
  ediblePrint: "" | YesNo;
  nonEdiblePrint: "" | YesNo;
  notes: string;
  preferredDate: string; // yyyy-mm-dd
  fulfilment: "" | Fulfilment;
  customerName: string;
  customerPhone: string;
};

export const emptyOrder: OrderDetails = {
  categoryId: "",
  cakeTypeId: "",
  sizeLabel: "",
  flavour: "",
  quantity: 1,
  decoration: "",
  ediblePrint: "",
  nonEdiblePrint: "",
  notes: "",
  preferredDate: "",
  fulfilment: "",
  customerName: "",
  customerPhone: "",
};

export type Estimate =
  | {
      calculable: true;
      unitPrice: number;
      surcharge: number;
      quantity: number;
      subtotal: number;
      deposit: number;
    }
  | { calculable: false };

export const FINAL_PRICE_NOTE =
  "Final price will be confirmed by Euna's Bakes.";

/** Format USD, trimming unnecessary decimals (e.g. $47.50, never $47.5). */
export function formatUSD(value: number): string {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

/**
 * Estimated subtotal from live pricing (admin-editable categories accepted).
 * Not calculable when: category/size unchosen, or a custom cake (quoted individually).
 * Decoration & prints always attract an extra fee confirmed on WhatsApp,
 * so the estimate is always shown alongside FINAL_PRICE_NOTE.
 */
export function calculateEstimate(
  order: OrderDetails,
  categories: CakeCategory[] = cakeCategories
): Estimate {
  if (order.cakeTypeId === "custom") return { calculable: false };
  const category = categories.find((c) => c.id === order.categoryId);
  const size = category?.sizes.find((s) => s.label === order.sizeLabel);
  if (!category || !size) return { calculable: false };

  const surcharge = category.surchargePerOrder ?? 0;
  const unitPrice = size.price + surcharge;
  const subtotal = unitPrice * order.quantity;
  return {
    calculable: true,
    unitPrice,
    surcharge,
    quantity: order.quantity,
    subtotal,
    deposit: subtotal * 0.5,
  };
}

export type OrderErrors = Partial<Record<keyof OrderDetails, string>>;

/** Validate the order form. Returns an error per invalid field (empty = valid). */
export function validateOrder(order: OrderDetails): OrderErrors {
  const errors: OrderErrors = {};

  if (!order.categoryId) errors.categoryId = "Please choose a cake category.";
  if (!order.cakeTypeId) errors.cakeTypeId = "Please choose a cake type.";
  if (!order.sizeLabel) errors.sizeLabel = "Please choose a size.";
  if (!order.flavour) errors.flavour = "Please choose a flavour.";
  if (!Number.isInteger(order.quantity) || order.quantity < 1)
    errors.quantity = "Quantity must be at least 1.";
  else if (order.quantity > 20)
    errors.quantity = "For more than 20 cakes, please enquire on WhatsApp first.";
  if (!order.decoration)
    errors.decoration = "Please tell us whether you need decoration.";
  if (!order.ediblePrint)
    errors.ediblePrint = "Please choose whether you need an edible print.";
  if (!order.nonEdiblePrint)
    errors.nonEdiblePrint = "Please choose whether you need a non-edible print.";

  if (!order.preferredDate) {
    errors.preferredDate = "Please choose a preferred date.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${order.preferredDate}T00:00:00`);
    if (Number.isNaN(chosen.getTime()))
      errors.preferredDate = "Please enter a valid date.";
    else if (chosen < today)
      errors.preferredDate = "Preferred date cannot be in the past.";
  }

  if (!order.fulfilment)
    errors.fulfilment = "Please choose pickup or delivery.";
  if (order.customerName.trim().length < 2)
    errors.customerName = "Please enter your name.";
  if (order.customerPhone.replace(/\D/g, "").length < 7)
    errors.customerPhone = "Please enter a valid phone number.";

  return errors;
}

/** Human-readable summary helpers (shared by summary UI now, WhatsApp text in Phase 4). */
export function getCategoryName(
  categoryId: string,
  categories: CakeCategory[] = cakeCategories
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "";
}

export function getCakeTypeLabel(
  cakeTypeId: OrderDetails["cakeTypeId"]
): string {
  if (!cakeTypeId) return "";
  return cakeTypeOptions.find((t) => t.id === cakeTypeId)?.label ?? "";
}
