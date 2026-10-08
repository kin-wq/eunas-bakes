"use client";

import { useState } from "react";
import { logoutAction } from "@/app/admin/actions";
import {
  BrandEditor,
  BusinessEditor,
  CategoriesEditor,
  FeaturedEditor,
  GalleryEditor,
  PromotionsEditor,
  TestimonialsEditor,
  WhatsAppEditor,
} from "@/app/admin/editors";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "products", label: "Products & Prices" },
  { id: "featured", label: "Featured" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "business", label: "Business Info" },
  { id: "brand", label: "Brand & WhatsApp" },
  { id: "promotions", label: "Promotions" },
] as const;

export function AdminDashboard({ initial }: { initial: SiteContent }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("products");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Content Manager</h1>
          <p className="mt-1 text-sm text-white/55">
            Changes save instantly and appear on the website right away.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center rounded-full bg-white/10 px-5 text-sm font-bold ring-1 ring-white/15 hover:bg-white/15"
          >
            Sign out
          </button>
        </form>
      </div>

      <div
        role="tablist"
        aria-label="Content sections"
        className="mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-[44px] shrink-0 rounded-full px-5 text-sm font-bold whitespace-nowrap",
              tab === t.id
                ? "bg-blush-400 text-plum-900"
                : "bg-white/10 text-white/75 ring-1 ring-white/15 hover:bg-white/15"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "products" && <CategoriesEditor initial={initial.categories} />}
        {tab === "featured" && (
          <FeaturedEditor initial={initial.featured} categories={initial.categories} />
        )}
        {tab === "gallery" && <GalleryEditor initial={initial.gallery} />}
        {tab === "testimonials" && (
          <TestimonialsEditor initial={initial.testimonials} />
        )}
        {tab === "business" && <BusinessEditor initial={initial.business} />}
        {tab === "brand" && (
          <div className="space-y-10">
            <BrandEditor initial={initial.brand} />
            <WhatsAppEditor initial={initial.whatsapp} />
          </div>
        )}
        {tab === "promotions" && <PromotionsEditor initial={initial.promotions} />}
      </div>
    </div>
  );
}
