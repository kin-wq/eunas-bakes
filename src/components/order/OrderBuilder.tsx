"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  cakeCategories,
  cakeTypeOptions,
  type CakeCategory,
  type CakeTypeOption,
} from "@/data/products";
import { siteConfig } from "@/data/site";
import {
  emptyOrder,
  validateOrder,
  type OrderDetails,
  type OrderErrors,
} from "@/lib/order";
import { getOrderWhatsAppLink } from "@/lib/order-message";
import { OrderSummary } from "@/components/order/OrderSummary";
import { cn } from "@/lib/utils";

/* ---------- small field primitives (local to the order builder) ---------- */

function Field({
  label,
  hint,
  error,
  required,
  children,
  fieldId,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  fieldId: string;
}) {
  return (
    <div id={fieldId} className="scroll-mt-28">
      <label className="block text-sm font-bold text-plum-800">
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="text-blush-500">*</span>
        ) : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </label>
      {hint ? <p className="mt-1 text-xs text-plum-900/55">{hint}</p> : null}
      <div className="mt-2.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Pills<T extends string>({
  name,
  options,
  value,
  onChange,
  ariaLabel,
}: {
  name: string;
  options: { value: T; label: string; description?: string }[];
  value: T | "";
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            onClick={() => onChange(opt.value)}
            title={opt.description}
            className={cn(
              "min-h-[48px] rounded-2xl px-5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:outline-none",
              selected
                ? "bg-plum-700 text-white shadow-md shadow-plum-700/25"
                : "bg-white text-plum-800 ring-1 ring-plum-700/15 hover:bg-cream-100"
            )}
          >
            <span className="block text-sm font-bold">{opt.label}</span>
            {opt.description ? (
              <span
                className={cn(
                  "mt-0.5 block max-w-[220px] text-xs leading-snug",
                  selected ? "text-white/75" : "text-plum-900/55"
                )}
              >
                {opt.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

const inputCls =
  "min-h-[52px] w-full rounded-2xl bg-white px-4 text-[15px] font-medium text-plum-900 ring-1 ring-plum-700/15 placeholder:font-normal placeholder:text-plum-900/35 focus:ring-2 focus:ring-plum-500 focus:outline-none";

/* ------------------------------ builder ------------------------------ */

export function OrderBuilder({
  categories = cakeCategories,
  typeOptions = cakeTypeOptions,
  depositNotice = siteConfig.business.depositNotice,
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
}: {
  categories?: CakeCategory[];
  typeOptions?: CakeTypeOption[];
  depositNotice?: string;
  whatsappNumber?: string;
}) {
  const [order, setOrder] = useState<OrderDetails>(emptyOrder);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [reviewed, setReviewed] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  // Computed after mount so the static prerender never reads the current time.
  // Syncing the date input minimum with the browser clock is external
  // synchronization — the intended use of an effect.
  const [todayISO, setTodayISO] = useState("");
  useEffect(() => {
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayISO(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }, []);

  const set = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const activeCategory = categories.find((c) => c.id === order.categoryId);

  const handleCategory = (id: string) => {
    setOrder((prev) => ({
      ...prev,
      categoryId: id,
      cakeTypeId: "",
      sizeLabel: "",
      flavour: "",
    }));
    setErrors((prev) => ({
      ...prev,
      categoryId: undefined,
      cakeTypeId: undefined,
      sizeLabel: undefined,
      flavour: undefined,
    }));
  };

  const handleCakeType = (id: "standard" | "mixed-flavours" | "custom") => {
    setOrder((prev) => {
      const category = categories.find((c) => c.id === prev.categoryId);
      const mixedSize = category?.sizes.find((s) => s.label === "Mixed Flavours");
      return {
        ...prev,
        cakeTypeId: id,
        sizeLabel:
          id === "mixed-flavours" && mixedSize ? mixedSize.label : prev.sizeLabel,
      };
    });
    setErrors((prev) => ({ ...prev, cakeTypeId: undefined, sizeLabel: undefined }));
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  // Live validity for the WhatsApp CTA (independent of review attempts).
  const blockers = validateOrder(order);
  const readyToOrder = Object.keys(blockers).length === 0;
  const whatsappHref = getOrderWhatsAppLink(order, {
    categories,
    internationalNumber: whatsappNumber,
  });

  const scrollToFirstError = (found: OrderErrors) => {
    const firstKey = (Object.keys(found) as (keyof OrderDetails)[]).find(
      (k) => found[k]
    );
    if (firstKey) {
      document
        .getElementById(`field-${firstKey}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleReview = () => {
    const found = validateOrder(order);
    setErrors(found);
    setReviewed(true);
    const firstKey = (Object.keys(found) as (keyof OrderDetails)[]).find(
      (k) => found[k]
    );
    if (firstKey) {
      scrollToFirstError(found);
    } else {
      summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /** WhatsApp CTA tapped while details are incomplete: surface errors instead. */
  const handleBlockedOrder = () => {
    const found = validateOrder(order);
    setErrors(found);
    setReviewed(true);
    scrollToFirstError(found);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleReview();
        }}
        className="space-y-10"
      >
        {/* ---- Step 1: cake ---- */}
        <section aria-label="Step 1: your cake" className="rounded-[1.75rem] bg-white p-5 ring-1 ring-plum-700/10 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-plum-500 uppercase">
            Step 1 · Your cake
          </p>
          <div className="mt-5 space-y-7">
            <Field label="Cake category" required error={errors.categoryId} fieldId="field-categoryId">
              <Pills
                name="category"
                ariaLabel="Cake category"
                value={order.categoryId}
                onChange={handleCategory}
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                  description: c.shortDescription,
                }))}
              />
            </Field>

            {activeCategory ? (
              <>
                <Field
                  label="Cake type"
                  required
                  error={errors.cakeTypeId}
                  fieldId="field-cakeTypeId"
                  hint="Custom cakes are quoted individually — no automatic price is shown for these."
                >
                  <Pills
                    name="cake-type"
                    ariaLabel="Cake type"
                    value={order.cakeTypeId}
                    onChange={handleCakeType}
                    options={typeOptions.map((t) => ({
                      value: t.id,
                      label: t.label,
                      description: t.description,
                    }))}
                  />
                </Field>

                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Size" required error={errors.sizeLabel} fieldId="field-sizeLabel">
                    <select
                      aria-label="Cake size"
                      value={order.sizeLabel}
                      onChange={(e) => set("sizeLabel", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select a size…</option>
                      {activeCategory.sizes.map((s) => (
                        <option key={s.label} value={s.label}>
                          {s.label} — {s.from ? "from " : ""}${s.price}
                          {activeCategory.surchargePerOrder
                            ? ` (+$${activeCategory.surchargePerOrder} surcharge)`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Flavour" required error={errors.flavour} fieldId="field-flavour">
                    <select
                      aria-label="Cake flavour"
                      value={order.flavour}
                      onChange={(e) => set("flavour", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select a flavour…</option>
                      {activeCategory.flavours.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Quantity" required error={errors.quantity} fieldId="field-quantity">
                  <div className="inline-flex items-center gap-1 rounded-2xl bg-cream-50 p-1 ring-1 ring-plum-700/15">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => set("quantity", Math.max(1, order.quantity - 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-plum-700 hover:bg-white"
                    >
                      −
                    </button>
                    <span aria-live="polite" className="w-12 text-center text-lg font-bold text-plum-800">
                      {order.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => set("quantity", Math.min(20, order.quantity + 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold text-plum-700 hover:bg-white"
                    >
                      +
                    </button>
                  </div>
                </Field>
              </>
            ) : (
              <p className="rounded-2xl bg-cream-50 px-4 py-3 text-sm text-plum-900/60 ring-1 ring-plum-700/10">
                Choose a category above to unlock sizes, flavours and quantity.
              </p>
            )}
          </div>
        </section>

        {/* ---- Step 2: finishing touches ---- */}
        <section aria-label="Step 2: finishing touches" className="rounded-[1.75rem] bg-white p-5 ring-1 ring-plum-700/10 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-plum-500 uppercase">
            Step 2 · Finishing touches
          </p>
          <p className="mt-2 text-xs leading-relaxed text-plum-900/60">
            Fancy decorations, edible and non-edible prints attract an extra fee —
            confirmed with you on WhatsApp.
          </p>
          <div className="mt-5 grid gap-7 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Field label="Decoration" required error={errors.decoration} fieldId="field-decoration">
              <Pills
                name="decoration"
                ariaLabel="Decoration needed"
                value={order.decoration}
                onChange={(v) => set("decoration", v)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Field>
            <Field label="Edible print" required error={errors.ediblePrint} fieldId="field-ediblePrint">
              <Pills
                name="edible-print"
                ariaLabel="Edible print needed"
                value={order.ediblePrint}
                onChange={(v) => set("ediblePrint", v)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Field>
            <Field label="Non-edible print" required error={errors.nonEdiblePrint} fieldId="field-nonEdiblePrint">
              <Pills
                name="non-edible-print"
                ariaLabel="Non-edible print needed"
                value={order.nonEdiblePrint}
                onChange={(v) => set("nonEdiblePrint", v)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Field>
          </div>
          <div className="mt-7">
            <Field
              label="Additional notes"
              hint="Theme, colours, message on the cake, allergies — anything we should know."
              fieldId="field-notes"
            >
              <textarea
                aria-label="Additional notes"
                value={order.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="e.g. Birthday cake with elegant pink and gold decoration…"
                className={cn(inputCls, "py-3 leading-relaxed")}
              />
            </Field>
          </div>
        </section>

        {/* ---- Step 3: date & fulfilment ---- */}
        <section aria-label="Step 3: date and collection" className="rounded-[1.75rem] bg-white p-5 ring-1 ring-plum-700/10 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-plum-500 uppercase">
            Step 3 · Date &amp; collection
          </p>
          <div className="mt-5 grid gap-7 sm:grid-cols-2">
            <Field
              label="Preferred date"
              required
              error={errors.preferredDate}
              fieldId="field-preferredDate"
              hint="Availability is confirmed with you on WhatsApp."
            >
              <input
                type="date"
                aria-label="Preferred date"
                value={order.preferredDate}
                min={todayISO || undefined}
                onChange={(e) => set("preferredDate", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field
              label="Pickup or delivery"
              required
              error={errors.fulfilment}
              fieldId="field-fulfilment"
              hint="Delivery fees are confirmed on WhatsApp."
            >
              <Pills
                name="fulfilment"
                ariaLabel="Pickup or delivery"
                value={order.fulfilment}
                onChange={(v) => set("fulfilment", v)}
                options={[
                  { value: "pickup", label: "Pickup" },
                  { value: "delivery", label: "Delivery" },
                ]}
              />
            </Field>
          </div>
        </section>

        {/* ---- Step 4: details ---- */}
        <section aria-label="Step 4: your details" className="rounded-[1.75rem] bg-white p-5 ring-1 ring-plum-700/10 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-plum-500 uppercase">
            Step 4 · Your details
          </p>
          <div className="mt-5 grid gap-7 sm:grid-cols-2">
            <Field label="Your name" required error={errors.customerName} fieldId="field-customerName">
              <input
                type="text"
                aria-label="Your name"
                value={order.customerName}
                onChange={(e) => set("customerName", e.target.value)}
                autoComplete="name"
                placeholder="e.g. Tendai Moyo"
                className={inputCls}
              />
            </Field>
            <Field
              label="Phone number"
              required
              error={errors.customerPhone}
              fieldId="field-customerPhone"
              hint="We confirm your order on this number via WhatsApp."
            >
              <input
                type="tel"
                aria-label="Phone number"
                value={order.customerPhone}
                onChange={(e) => set("customerPhone", e.target.value)}
                autoComplete="tel"
                inputMode="tel"
                placeholder="e.g. 0771 234 567"
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {reviewed && errorCount > 0 ? (
          <p role="alert" className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 ring-1 ring-red-200">
            Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} above to
            complete your order summary.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-plum-700 px-8 text-sm font-semibold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Review my order summary →
          </button>
        </div>
        <p className="text-center text-xs text-plum-900/55 sm:text-left">
          {depositNotice} No payment is taken on this website.
        </p>
      </form>

      <div ref={summaryRef} className="scroll-mt-24 lg:sticky lg:top-24">
        <OrderSummary
          order={order}
          ready={readyToOrder}
          whatsappHref={whatsappHref}
          onBlocked={handleBlockedOrder}
          categories={categories}
          depositNotice={depositNotice}
        />
      </div>
    </div>
  );
}
