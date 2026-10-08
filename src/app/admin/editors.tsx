"use client";

import { useState } from "react";
import { useSectionSaver } from "@/app/admin/save-hook";
import {
  AddButton,
  Card,
  Field,
  RemoveButton,
  SaveBar,
  inputCls,
  newId,
} from "@/app/admin/field-ui";
import type {
  CakeCategory,
  FeaturedProduct,
  GalleryPlaceholder,
  TestimonialPlaceholder,
} from "@/data/products";
import type { Promotion, SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ------------------------- generic text section ------------------------ */

function TextSection({
  section,
  title,
  intro,
  initial,
  fields,
}: {
  section: string;
  title: string;
  intro: string;
  initial: Record<string, string>;
  fields: { key: string; label: string; hint?: string; textarea?: boolean }[];
}) {
  const [values, setValues] = useState(initial);
  const { status, save } = useSectionSaver(section);

  return (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-white/55">{intro}</p>
      <div className="mt-5 grid gap-4">
        {fields.map((f) => (
          <Field key={f.key} label={f.label} hint={f.hint}>
            {f.textarea ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((p) => ({ ...p, [f.key]: e.target.value }))
                }
                rows={3}
                className={`${inputCls} py-2.5 leading-relaxed`}
              />
            ) : (
              <input
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues((p) => ({ ...p, [f.key]: e.target.value }))
                }
                className={inputCls}
              />
            )}
          </Field>
        ))}
      </div>
      <SaveBar status={status} onSave={() => save(values)} />
    </div>
  );
}

export function WhatsAppEditor({ initial }: { initial: SiteContent["whatsapp"] }) {
  return (
    <TextSection
      section="whatsapp"
      title="WhatsApp number"
      intro="The single number used for every WhatsApp button and order message across the website."
      initial={{ ...initial }}
      fields={[
        {
          key: "displayNumber",
          label: "Display number",
          hint: "Shown on buttons, e.g. 0776 594 276",
        },
        {
          key: "internationalNumber",
          label: "Link number (digits only)",
          hint: "Country code + number, no + or spaces, e.g. 263776594276",
        },
        {
          key: "defaultMessage",
          label: "Default enquiry message",
          hint: "Used by generic chat buttons",
          textarea: true,
        },
      ]}
    />
  );
}

export function BrandEditor({ initial }: { initial: SiteContent["brand"] }) {
  return (
    <TextSection
      section="brand"
      title="Brand"
      intro="Name, tagline and description shown in the header, footer, hero and page titles."
      initial={{ ...initial }}
      fields={[
        { key: "name", label: "Brand name" },
        { key: "tagline", label: "Tagline" },
        { key: "description", label: "Short description", textarea: true },
        { key: "developer", label: "Developer credit (footer)" },
      ]}
    />
  );
}

export function BusinessEditor({ initial }: { initial: SiteContent["business"] }) {
  return (
    <TextSection
      section="business"
      title="Business information"
      intro="Deposit, decoration and contact notes shown across the website, menu, order and contact pages."
      initial={{ ...initial }}
      fields={[
        { key: "depositNotice", label: "Deposit notice", textarea: true },
        { key: "decorationNotice", label: "Decoration notice", textarea: true },
        { key: "locationPlaceholder", label: "Location note", textarea: true },
        { key: "hoursPlaceholder", label: "Hours note", textarea: true },
      ]}
    />
  );
}

/* ------------------------------ categories ----------------------------- */

type CategoryDraft = Omit<CakeCategory, "surchargePerOrder" | "slug"> & {
  surchargePerOrder: number | string;
};

export function CategoriesEditor({
  initial,
}: {
  initial: CakeCategory[];
}) {
  const [cats, setCats] = useState<CategoryDraft[]>(
    initial.map((c) => ({
      ...c,
      sizes: c.sizes.map((s) => ({ ...s })),
      surchargePerOrder: c.surchargePerOrder ?? "",
    }))
  );
  const { status, save } = useSectionSaver("categories");

  const patch = (i: number, p: Partial<CategoryDraft>) =>
    setCats((prev) => prev.map((c, j) => (j === i ? { ...c, ...p } : c)));

  const handleSave = () => {
    save(
      cats.map((c) => ({
        ...c,
        surchargePerOrder:
          c.surchargePerOrder === "" || c.surchargePerOrder === null
            ? undefined
            : Number(c.surchargePerOrder),
        surchargeNote: c.surchargeNote || undefined,
      }))
    );
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Products, prices &amp; flavours</h2>
      <p className="mt-1 text-sm text-white/55">
        Categories, sizes, prices and flavours. Changes update the menu, homepage
        and order builder instantly. Category ids are permanent — do not reuse
        them for different cakes.
      </p>
      <div className="mt-5 space-y-5">
        {cats.map((c, i) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wider text-white/40 uppercase">
                ID: {c.id} (permanent)
              </p>
              <RemoveButton
                label={`Remove ${c.name}`}
                onClick={() => setCats((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Category name">
                <input
                  value={c.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Photo URL" hint="https://… or /local-path">
                <input
                  value={c.image}
                  onChange={(e) => patch(i, { image: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Short description">
                <textarea
                  value={c.shortDescription}
                  onChange={(e) => patch(i, { shortDescription: e.target.value })}
                  rows={2}
                  className={`${inputCls} py-2.5 leading-relaxed`}
                />
              </Field>
            </div>

            <p className="mt-4 text-[13px] font-bold text-white/85">Sizes &amp; prices</p>
            <div className="mt-2 space-y-2">
              {c.sizes.map((s, j) => (
                <div key={j} className="grid grid-cols-[1fr_110px_auto_auto] items-center gap-2">
                  <input
                    aria-label="Size label"
                    value={s.label}
                    onChange={(e) =>
                      patch(i, {
                        sizes: c.sizes.map((x, k) =>
                          k === j ? { ...x, label: e.target.value } : x
                        ),
                      })
                    }
                    className={inputCls}
                  />
                  <input
                    aria-label="Size price in USD"
                    type="number"
                    min={0}
                    value={s.price}
                    onChange={(e) =>
                      patch(i, {
                        sizes: c.sizes.map((x, k) =>
                          k === j ? { ...x, price: Number(e.target.value) } : x
                        ),
                      })
                    }
                    className={inputCls}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-white/70">
                    <input
                      type="checkbox"
                      checked={!!s.from}
                      onChange={(e) =>
                        patch(i, {
                          sizes: c.sizes.map((x, k) =>
                            k === j ? { ...x, from: e.target.checked || undefined } : x
                          ),
                        })
                      }
                      className="h-5 w-5 accent-pink-400"
                    />
                    from
                  </label>
                  <button
                    type="button"
                    aria-label={`Remove size ${s.label}`}
                    onClick={() =>
                      patch(i, { sizes: c.sizes.filter((_, k) => k !== j) })
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-200 hover:bg-red-500/25"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  patch(i, { sizes: [...c.sizes, { label: "New size", price: 0 }] })
                }
                className="text-xs font-bold text-blush-300 hover:text-blush-200"
              >
                + Add size
              </button>
            </div>

            <div className="mt-4">
              <Field label="Flavours" hint="One flavour per line">
                <textarea
                  value={c.flavours.join("\n")}
                  onChange={(e) =>
                    patch(i, {
                      flavours: e.target.value.split("\n").map((f) => f.trim()).filter(Boolean),
                    })
                  }
                  rows={Math.max(2, c.flavours.length)}
                  className={`${inputCls} py-2.5 leading-relaxed`}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Surcharge (USD)" hint="Empty = none. Premium uses 5.">
                <input
                  type="number"
                  min={0}
                  value={c.surchargePerOrder ?? ""}
                  onChange={(e) =>
                    patch(i, {
                      surchargePerOrder:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Surcharge note" hint="Shown on the menu, e.g. +$5 extra on every order">
                <input
                  value={c.surchargeNote ?? ""}
                  onChange={(e) => patch(i, { surchargeNote: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add category"
          onClick={() =>
            setCats((prev) => [
              ...prev,
              {
                id: newId("cat"),
                name: "New Category",
                shortDescription: "",
                image: "",
                sizes: [{ label: "Small", price: 0 }],
                flavours: [],
                surchargePerOrder: "",
                featured: true,
              },
            ])
          }
        />
      </div>
      <SaveBar status={status} onSave={handleSave} />
    </div>
  );
}

/* ------------------------------- featured ------------------------------ */

export function FeaturedEditor({
  initial,
  categories,
}: {
  initial: FeaturedProduct[];
  categories: CakeCategory[];
}) {
  const [items, setItems] = useState(initial.map((f) => ({ ...f })));
  const { status, save } = useSectionSaver("featured");

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Featured products</h2>
      <p className="mt-1 text-sm text-white/55">
        The three cards on the homepage. Each must link to an existing category id.
      </p>
      <div className="mt-5 space-y-4">
        {items.map((f, i) => (
          <Card key={f.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wider text-white/40 uppercase">
                {f.id}
              </p>
              <RemoveButton
                label={`Remove ${f.name}`}
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  value={f.name}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Category">
                <select
                  value={f.categoryId}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, categoryId: e.target.value } : x)))
                  }
                  className={cn(inputCls, "[&>option]:text-black")}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <textarea
                  value={f.description}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))
                  }
                  rows={2}
                  className={`${inputCls} py-2.5`}
                />
              </Field>
              <Field label="Photo URL">
                <input
                  value={f.image}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Starting price (USD)">
                <input
                  type="number"
                  min={0}
                  value={f.startingPrice}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, startingPrice: Number(e.target.value) } : x)))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Price label" hint='e.g. "Small · from $35"'>
                <input
                  value={f.priceSuffix}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, priceSuffix: e.target.value } : x)))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Badge (optional)" hint='e.g. "Bestseller" — empty for none'>
                <input
                  value={f.tag ?? ""}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, tag: e.target.value || undefined } : x)))
                  }
                  className={inputCls}
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add featured product"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              {
                id: newId("feat"),
                categoryId: categories[0]?.id ?? "chiffon",
                name: "New Feature",
                description: "",
                startingPrice: 0,
                priceSuffix: "",
                image: "",
              },
            ])
          }
        />
      </div>
      <SaveBar status={status} onSave={() => save(items)} />
    </div>
  );
}

/* -------------------------------- gallery ------------------------------ */

export function GalleryEditor({ initial }: { initial: GalleryPlaceholder[] }) {
  const [photos, setPhotos] = useState(initial.map((g) => ({ ...g })));
  const { status, save } = useSectionSaver("gallery");

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Gallery</h2>
      <p className="mt-1 text-sm text-white/55">
        Photos on the gallery page and homepage preview. Replace placeholders
        with real Euna&apos;s Bakes photos when available.
      </p>
      <div className="mt-5 space-y-4">
        {photos.map((g, i) => (
          <Card key={g.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wider text-white/40 uppercase">{g.id}</p>
              <RemoveButton
                label="Remove photo"
                onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <div className="mt-3 grid items-start gap-4 sm:grid-cols-[96px_1fr]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.image}
                alt=""
                aria-hidden="true"
                className="h-24 w-24 rounded-xl object-cover ring-1 ring-white/15"
              />
              <div className="grid gap-4">
                <Field label="Photo URL">
                  <input
                    value={g.image}
                    onChange={(e) =>
                      setPhotos((prev) => prev.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Description (alt text)">
                  <input
                    value={g.alt}
                    onChange={(e) =>
                      setPhotos((prev) => prev.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add photo"
          onClick={() => setPhotos((prev) => [...prev, { id: newId("photo"), image: "", alt: "" }])}
        />
      </div>
      <SaveBar status={status} onSave={() => save(photos)} />
    </div>
  );
}

/* ----------------------------- testimonials ---------------------------- */

export function TestimonialsEditor({ initial }: { initial: TestimonialPlaceholder[] }) {
  const [items, setItems] = useState(initial.map((t) => ({ ...t })));
  const { status, save } = useSectionSaver("testimonials");

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Testimonials</h2>
      <p className="mt-1 text-sm text-white/55">
        Only publish genuine customer reviews. Keep “show as placeholder”
        switched on until a review is real — placeholders are labelled on the
        website. Never present invented reviews as real.
      </p>
      <div className="mt-5 space-y-4">
        {items.map((t, i) => (
          <Card key={t.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wider text-white/40 uppercase">{t.id}</p>
              <RemoveButton
                label="Remove testimonial"
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <div className="mt-3 grid gap-4">
              <Field label="Quote">
                <textarea
                  value={t.quote}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, quote: e.target.value } : x)))
                  }
                  rows={3}
                  className={`${inputCls} py-2.5 leading-relaxed`}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Customer name">
                  <input
                    value={t.name}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                    }
                    className={inputCls}
                  />
                </Field>
                <Field label="Occasion">
                  <input
                    value={t.occasion}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x, j) => (j === i ? { ...x, occasion: e.target.value } : x)))
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2.5 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={t.isPlaceholder}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, isPlaceholder: e.target.checked } : x)))
                  }
                  className="h-5 w-5 accent-pink-400"
                />
                Show as placeholder (labelled on the website until replaced)
              </label>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add testimonial"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              { id: newId("t"), quote: "", name: "", occasion: "", isPlaceholder: true },
            ])
          }
        />
      </div>
      <SaveBar status={status} onSave={() => save(items)} />
    </div>
  );
}

/* ------------------------------ promotions ----------------------------- */

export function PromotionsEditor({ initial }: { initial: Promotion[] }) {
  const [items, setItems] = useState(initial.map((p) => ({ ...p })));
  const { status, save } = useSectionSaver("promotions");

  return (
    <div>
      <h2 className="font-display text-xl font-bold">Promotions</h2>
      <p className="mt-1 text-sm text-white/55">
        Active promotions appear in the banner at the top of the homepage. Only
        the first active one is shown.
      </p>
      <div className="mt-5 space-y-4">
        {items.map((p, i) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold tracking-wider text-white/40 uppercase">{p.id}</p>
              <RemoveButton
                label="Remove promotion"
                onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <div className="mt-3 grid gap-4">
              <Field label="Title" hint='e.g. "Festive Season Offer"'>
                <input
                  value={p.title}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="Message" hint='e.g. "10% off all premium cakes this month"'>
                <textarea
                  value={p.message}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, message: e.target.value } : x)))
                  }
                  rows={2}
                  className={`${inputCls} py-2.5`}
                />
              </Field>
              <label className="flex items-center gap-2.5 text-sm text-white/75">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={(e) =>
                    setItems((prev) => prev.map((x, j) => (j === i ? { ...x, active: e.target.checked } : x)))
                  }
                  className="h-5 w-5 accent-pink-400"
                />
                Active (show on homepage)
              </label>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <AddButton
          label="Add promotion"
          onClick={() =>
            setItems((prev) => [...prev, { id: newId("promo"), title: "", message: "", active: false }])
          }
        />
      </div>
      <SaveBar status={status} onSave={() => save(items)} />
    </div>
  );
}
