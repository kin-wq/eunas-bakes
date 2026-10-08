"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm3 5h8M7 12h8M7 16h5" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8 8 0 01-8 8H4l2-3a8 8 0 1115-5z" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

const moreLinks = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * App-like bottom tab bar for phones (Phase 6).
 * Mobile only (lg:hidden) — desktop keeps the header nav, so nothing is duplicated.
 */
export function MobileBottomNav({
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
}: {
  whatsappNumber?: string;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const closeMore = () => setMoreOpen(false);

  const tab = (active: boolean) =>
    cn(
      "flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-colors",
      active ? "text-plum-700" : "text-plum-900/50 hover:text-plum-700"
    );

  return (
    <>
      {/* spacer so footer content clears the fixed bar */}
      <div aria-hidden="true" className="h-[calc(4.75rem+env(safe-area-inset-bottom))] lg:hidden" />

      {moreOpen ? (
        <button
          type="button"
          aria-label="Close more menu"
          onClick={closeMore}
          className="fixed inset-0 z-40 bg-plum-900/30 lg:hidden"
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden print:hidden">
        {moreOpen ? (
          <div
            role="dialog"
            aria-label="More pages"
            className="mx-3 mb-2 rounded-3xl bg-cream-50 p-2 shadow-2xl ring-1 ring-plum-900/10"
          >
            {moreLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMore}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-semibold",
                  pathname === l.href
                    ? "bg-plum-700/10 text-plum-800"
                    : "text-plum-900/75"
                )}
              >
                {l.label}
                <span aria-hidden="true" className="opacity-40">→</span>
              </Link>
            ))}
          </div>
        ) : null}

        <nav
          aria-label="Mobile tabs"
          className="border-t border-plum-700/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-5 items-stretch px-2 pt-1">
            <Link href="/" aria-label="Home" aria-current={pathname === "/" ? "page" : undefined} className={tab(pathname === "/")}>
              <HomeIcon />
              Home
            </Link>
            <Link href="/menu" aria-label="Menu" aria-current={pathname === "/menu" ? "page" : undefined} className={tab(pathname === "/menu")}>
              <MenuIcon />
              Menu
            </Link>
            <Link
              href="/order"
              aria-label="Order"
              aria-current={pathname === "/order" ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-start gap-1 pt-0 text-[11px] font-semibold text-plum-800"
            >
              <span
                className={cn(
                  "-mt-5 flex h-13 w-13 items-center justify-center rounded-full text-white shadow-lg",
                  pathname === "/order"
                    ? "bg-plum-800 shadow-plum-800/40"
                    : "bg-plum-700 shadow-plum-700/30"
                )}
              >
                <OrderIcon />
              </span>
              Order
            </Link>
            <a
              href={getWhatsAppLink(undefined, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              className={tab(false)}
            >
              <ChatIcon />
              WhatsApp
            </a>
            <button
              type="button"
              aria-label={moreOpen ? "Close more pages" : "More pages"}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(!moreOpen)}
              className={tab(moreOpen || ["/about", "/gallery", "/contact"].includes(pathname))}
            >
              <MoreIcon />
              More
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
