"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/Button";

export function Header({
  brandName = siteConfig.brand.name,
  whatsappDisplay = siteConfig.whatsapp.displayNumber,
  whatsappNumber = siteConfig.whatsapp.internationalNumber,
  depositNotice = siteConfig.business.depositNotice,
}: {
  brandName?: string;
  whatsappDisplay?: string;
  whatsappNumber?: string;
  depositNotice?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-plum-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all",
          scrolled
            ? "bg-cream-50/90 shadow-[0_8px_30px_rgba(44,18,57,0.08)] backdrop-blur-xl"
            : "bg-cream-50/60 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${brandName} home`}>
            <span className="font-display flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-700 to-plum-500 text-lg font-bold text-white shadow-md shadow-plum-700/30">
              E
            </span>
            <span className="leading-tight">
              <span className="font-display block text-[17px] font-bold text-plum-800">
                {brandName}
              </span>
              <span className="block text-[11px] font-medium tracking-[0.14em] text-plum-700/60 uppercase">
                Handcrafted Sweetness
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {siteConfig.navigation.map((item) =>
              item.highlight ? null : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-plum-700/10 text-plum-800"
                      : "text-plum-900/70 hover:bg-plum-700/5 hover:text-plum-800"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/order"
              className={cn(
                "ml-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                pathname === "/order"
                  ? "bg-plum-800 text-white"
                  : "bg-plum-700 text-white shadow-md shadow-plum-700/25 hover:bg-plum-800"
              )}
            >
              Order
            </Link>
            <a
              href={getWhatsAppLink(undefined, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#1fa855] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-900/20 transition-colors hover:bg-[#178a45]"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {whatsappDisplay}
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-plum-800 ring-1 ring-plum-700/15 bg-white/70 lg:hidden"
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-plum-900/40 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-label="Mobile navigation"
          className={cn(
            "absolute top-[68px] right-3 left-3 rounded-3xl bg-cream-50 p-3 shadow-2xl ring-1 ring-plum-900/10 transition-all",
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          )}
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                tabIndex={open ? 0 : -1}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-5 py-4 text-[15px] font-semibold",
                  pathname === item.href
                    ? "bg-plum-700/10 text-plum-800"
                    : "text-plum-900/80 hover:bg-plum-700/5",
                  item.highlight && "mt-1 bg-plum-700 text-white hover:bg-plum-800"
                )}
              >
                {item.label}
                <span aria-hidden="true" className="opacity-40">→</span>
              </Link>
            ))}
            <a
              href={getWhatsAppLink(undefined, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1fa855] px-5 py-4 text-[15px] font-semibold text-white"
            >
              <WhatsAppIcon />
              WhatsApp · {whatsappDisplay}
            </a>
            <p className="px-5 pt-3 pb-2 text-center text-xs text-plum-900/50">
              {depositNotice}
            </p>
          </nav>
        </div>
      </div>
    </>
  );
}
