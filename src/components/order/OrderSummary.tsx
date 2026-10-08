import { cakeCategories, type CakeCategory } from "@/data/products";
import { siteConfig } from "@/data/site";
import {
  FINAL_PRICE_NOTE,
  calculateEstimate,
  formatUSD,
  getCakeTypeLabel,
  getCategoryName,
  type OrderDetails,
} from "@/lib/order";
import { WhatsAppIcon } from "@/components/ui/Button";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-[13px] font-medium text-plum-900/60">{label}</dt>
      <dd className="text-right text-sm font-semibold text-plum-800">
        {value || <span className="font-normal text-plum-900/40">Not set</span>}
      </dd>
    </div>
  );
}

function yesNo(value: "" | "yes" | "no"): string {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "";
}

/**
 * Live order summary + estimate. Read-only; the builder owns all state.
 * When the order is complete, the CTA redirects straight to WhatsApp with the
 * auto-generated order message (Phase 4). Until then it guides the customer
 * back to the missing fields — never a dead-end or fake chat.
 */
export function OrderSummary({
  order,
  ready,
  whatsappHref,
  onBlocked,
  categories = cakeCategories,
  depositNotice = siteConfig.business.depositNotice,
}: {
  order: OrderDetails;
  ready: boolean;
  whatsappHref: string;
  onBlocked: () => void;
  categories?: CakeCategory[];
  depositNotice?: string;
}) {
  const estimate = calculateEstimate(order, categories);
  const hasExtras =
    order.decoration === "yes" ||
    order.ediblePrint === "yes" ||
    order.nonEdiblePrint === "yes";

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-plum-800 text-white shadow-xl shadow-plum-800/25">
      <div className="px-6 pt-6">
        <p className="text-xs font-semibold tracking-[0.22em] text-blush-200 uppercase">
          Order Summary
        </p>
        <dl className="mt-3 divide-y divide-white/10 border-y border-white/10">
          <Row label="Category" value={getCategoryName(order.categoryId, categories)} />
          <Row label="Cake type" value={getCakeTypeLabel(order.cakeTypeId)} />
          <Row label="Size" value={order.sizeLabel} />
          <Row label="Flavour" value={order.flavour} />
          <Row label="Quantity" value={order.quantity ? String(order.quantity) : ""} />
          <Row label="Decoration" value={yesNo(order.decoration)} />
          <Row label="Edible print" value={yesNo(order.ediblePrint)} />
          <Row label="Non-edible print" value={yesNo(order.nonEdiblePrint)} />
          <Row label="Preferred date" value={order.preferredDate} />
          <Row
            label="Pickup / Delivery"
            value={
              order.fulfilment === "pickup"
                ? "Pickup"
                : order.fulfilment === "delivery"
                  ? "Delivery"
                  : ""
            }
          />
          <Row label="Name" value={order.customerName.trim()} />
          <Row label="Phone" value={order.customerPhone.trim()} />
          {order.notes.trim() ? (
            <div className="py-2">
              <dt className="text-[13px] font-medium text-white/60">
                Additional notes
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-white/90">
                {order.notes.trim()}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="px-6 py-6">
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur" aria-live="polite">
          <p className="text-xs font-semibold tracking-[0.2em] text-blush-200 uppercase">
            Estimated Subtotal
          </p>
          {estimate.calculable ? (
            <>
              <p className="font-display mt-2 text-3xl font-bold">
                {formatUSD(estimate.subtotal)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/70">
                {formatUSD(estimate.unitPrice)} × {estimate.quantity}
                {estimate.surcharge > 0
                  ? ` (incl. ${formatUSD(estimate.surcharge)} premium surcharge)`
                  : ""}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Estimated 50% deposit to secure your order:{" "}
                <strong className="text-white">
                  {formatUSD(estimate.deposit)}
                </strong>
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-white/90">
              {order.cakeTypeId === "custom"
                ? "Custom cake — no automatic estimate. "
                : "Complete the cake options to see an estimate. "}
              {FINAL_PRICE_NOTE}
            </p>
          )}
          {hasExtras ? (
            <p className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-xs leading-relaxed text-white/85">
              Decoration / prints selected — these attract an extra fee.{" "}
              {FINAL_PRICE_NOTE}
            </p>
          ) : estimate.calculable ? (
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              {FINAL_PRICE_NOTE}
            </p>
          ) : null}
        </div>

        <p className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-xs leading-relaxed text-white/85">
          {depositNotice}
        </p>

        {ready ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send your order to Euna's Bakes on WhatsApp"
            className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#1fa855] px-7 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#178a45]"
          >
            <WhatsAppIcon />
            Order via WhatsApp
          </a>
        ) : (
          <button
            type="button"
            onClick={onBlocked}
            aria-label="Complete your order details to order via WhatsApp"
            className="mt-4 inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1fa855] px-7 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#178a45]"
          >
            <WhatsAppIcon />
            Order via WhatsApp
          </button>
        )}
        <p className="mt-3 text-center text-xs leading-relaxed text-white/60">
          {ready
            ? "Tap to open WhatsApp with your order message ready to send."
            : "Complete the highlighted fields above, then tap to send your order on WhatsApp."}
        </p>
      </div>
    </div>
  );
}
