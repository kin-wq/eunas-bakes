import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Admin area shell. Deliberately unbranded (dark, utilitarian) so it is
 * visually distinct from the customer-facing bakery site.
 * Access is gated by src/proxy.ts + per-page session checks.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#171321] text-white antialiased">
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <p className="text-sm font-bold tracking-wide">
            <span className="mr-2 rounded-md bg-blush-500/20 px-2 py-1 text-[11px] font-bold tracking-[0.14em] text-blush-300 uppercase">
              Admin
            </span>
            Euna&apos;s Bakes · Content Manager
          </p>
          <Link
            href="/"
            className="text-xs font-semibold text-white/60 hover:text-white"
          >
            ← View website
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
