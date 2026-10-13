import Image from "next/image";

/**
 * Branded launch splash (final polish).
 *
 * Sequence on Android: system splash (Android 12+ theme, cream background +
 * app icon) → this Euna's Bakes splash (~3 seconds) → main application.
 *
 * This component is static markup — timing is pure CSS in globals.css, and
 * the standalone script in (site)/layout only opts-in installed apps, so:
 *   • the page beneath is fully rendering while the splash is up (no delay),
 *   • normal browser visits never see it (no flicker),
 *   • there is no JS/hydration dependency (no blank-screen risk).
 */
export function AppSplash() {
  return (
    <div
      aria-hidden="true"
      className="app-splash fixed inset-0 z-[100] items-center justify-center overflow-hidden bg-cream-100"
    >
      {/* brand-tinted atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blush-200/70 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-plum-500/10 blur-3xl" />
      </div>

      <div className="splash-content relative flex flex-col items-center px-6 text-center">
        <Image
          src="/icons/icon-512.png"
          alt=""
          width={176}
          height={176}
          priority
          unoptimized
          className="h-[min(40vw,176px)] w-[min(40vw,176px)] object-contain drop-shadow-[0_18px_40px_rgba(74,29,93,0.25)]"
        />
        <p className="font-display mt-6 text-4xl leading-tight font-bold text-plum-800 sm:text-5xl">
          Euna&apos;s Bakes
        </p>
        <p className="mt-3 text-[11px] font-semibold tracking-[0.3em] text-plum-600 uppercase sm:text-xs">
          Handcrafted Sweetness in Every Bite
        </p>
      </div>
    </div>
  );
}
