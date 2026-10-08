"use client";

import { useState } from "react";
import { cakeCategories, type CakeCategory } from "@/data/products";
import { siteConfig } from "@/data/site";
import { MenuCategoryCard } from "@/components/menu/MenuCategoryCard";
import { cn } from "@/lib/utils";

/**
 * Client-side category filtering for the menu.
 * Pure local state over statically-rendered data — instant, no server roundtrip.
 */
export function MenuExplorer({
  categories = cakeCategories,
  brandName = "Euna's Bakes",
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
}: {
  categories?: CakeCategory[];
  brandName?: string;
  whatsappNumber?: string;
}) {
  const filters = [
    { id: "all", label: "All Cakes" },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];
  const [active, setActive] = useState("all");
  const visible =
    active === "all" ? categories : categories.filter((c) => c.id === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter cakes by category"
        className="sticky top-[68px] z-30 -mx-5 bg-cream-50/95 px-5 py-3 backdrop-blur-md sm:mx-0 sm:rounded-full sm:px-3 sm:ring-1 sm:ring-plum-700/10"
      >
        <div className="flex gap-2 overflow-x-auto sm:flex-wrap sm:justify-center">
          {filters.map((f) => {
            const selected = f.id === active;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(f.id)}
                className={cn(
                  "min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:outline-none",
                  selected
                    ? "bg-plum-700 text-white shadow-md shadow-plum-700/25"
                    : "bg-white text-plum-800 ring-1 ring-plum-700/15 hover:bg-cream-100"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-plum-900/60" aria-live="polite">
        Showing{" "}
        <strong className="text-plum-800">
          {visible.length} {visible.length === 1 ? "collection" : "collections"}
        </strong>
        {active !== "all" && (
          <>
            {" — "}
            {visible[0]?.name}
          </>
        )}
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        {visible.map((category) => (
          <MenuCategoryCard
            key={category.id}
            category={category}
            brandName={brandName}
            whatsappNumber={whatsappNumber}
          />
        ))}
      </div>
    </div>
  );
}
