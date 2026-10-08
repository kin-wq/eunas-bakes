/**
 * Canonical URL helper for SEO metadata.
 * Canonicals are emitted only when SITE_URL is configured (production domain).
 * Until the owner sets it, no canonical tags render — no fake domains.
 */
export function canonicalMeta(path: string): {
  alternates?: { canonical: string };
} {
  const base = (process.env.SITE_URL ?? "").trim().replace(/\/+$/, "");
  if (!base) return {};
  return { alternates: { canonical: `${base}${path}` } };
}
