/**
 * App-like loading splash (Phase 6).
 * Shown during route transitions — brand mark on cream, no layout shift.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-cream-50"
      aria-label="Loading"
      role="status"
    >
      <span className="font-display flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-plum-700 to-plum-500 text-3xl font-bold text-white shadow-lg shadow-plum-700/30">
        E
      </span>
      <p className="font-display text-lg font-semibold text-plum-800">
        Euna&apos;s Bakes
      </p>
      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-plum-700/10" aria-hidden="true">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-plum-500" />
      </div>
      <p className="text-xs tracking-[0.2em] text-plum-900/50 uppercase">
        Handcrafted Sweetness
      </p>
    </div>
  );
}
