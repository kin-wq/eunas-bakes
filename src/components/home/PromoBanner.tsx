"use client";

import { useState } from "react";
import Link from "next/link";
import type { Promotion } from "@/lib/content";

/**
 * Dismissible promotion banner (Phase 7 admin surface).
 * Renders nothing when no promotion is active.
 */
export function PromoBanner({ promotions }: { promotions: Promotion[] }) {
  const [dismissed, setDismissed] = useState(false);
  const active = promotions.filter((p) => p.active);
  if (dismissed || active.length === 0) return null;
  const promo = active[0];

  return (
    <div
      role="region"
      aria-label="Current promotion"
      className="bg-plum-800 text-white"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-5 py-2.5 sm:px-8">
        <p className="truncate text-center text-[13px] font-medium">
          <strong className="font-bold text-blush-200">{promo.title}</strong>
          <span className="text-white/80"> — {promo.message}</span>{" "}
          <Link
            href="/order"
            className="font-bold whitespace-nowrap text-white underline underline-offset-2 hover:text-blush-200"
          >
            Order now →
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss promotion"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
