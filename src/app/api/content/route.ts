import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content";

/**
 * Public content API (Phase 7).
 * Serves the same live bakery data (base + admin overrides) that the website
 * renders, so a future native mobile app can consume one shared backend.
 * No admin secrets are ever included — content only.
 */
export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
