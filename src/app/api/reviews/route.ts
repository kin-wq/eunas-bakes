import { NextResponse } from "next/server";
import { approvedReviews, readReviews } from "@/lib/reviews";

/**
 * Public reviews API (final polish).
 * Returns ONLY admin-approved reviews — pending/rejected are never exposed.
 * Always fresh (no-store) so newly approved reviews appear immediately.
 */
export async function GET() {
  const reviews = approvedReviews(await readReviews());
  return NextResponse.json(reviews, {
    headers: { "Cache-Control": "no-store" },
  });
}
