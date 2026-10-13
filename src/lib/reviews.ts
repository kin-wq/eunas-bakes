import fs from "node:fs/promises";
import path from "node:path";

/**
 * Customer reviews with moderation (final polish).
 * File-backed store next to the admin overrides (content/reviews.json).
 *
 * Flow: customer submits → status "pending" → admin approves → publicly shown.
 * The public API only ever returns approved reviews.
 *
 * Storage note: on Vercel's serverless filesystem this store is ephemeral.
 * For permanent storage swap readReviews/writeReviews for a database
 * (e.g. Vercel Postgres/Upstash) — the rest of the app needs no changes.
 */

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  name: string;
  rating: number; // integer 1–5
  review: string;
  date: string; // ISO timestamp
  status: ReviewStatus;
};

const MAX_STORED_REVIEWS = 500;

function storePath(): string {
  return path.join(process.cwd(), "content", "reviews.json");
}

function isReview(v: unknown): v is Review {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.review === "string" &&
    typeof r.date === "string" &&
    Number.isInteger(r.rating) &&
    (r.rating as number) >= 1 &&
    (r.rating as number) <= 5 &&
    (r.status === "pending" || r.status === "approved" || r.status === "rejected")
  );
}

export async function readReviews(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(storePath(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isReview);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    console.error("Failed to read reviews:", err);
    return [];
  }
}

async function writeReviews(reviews: Review[]): Promise<void> {
  const dir = path.dirname(storePath());
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(storePath(), JSON.stringify(reviews, null, 2), "utf8");
}

export function approvedReviews(reviews: Review[]): Review[] {
  return reviews
    .filter((r) => r.status === "approved")
    .sort((a, b) => b.date.localeCompare(a.date));
}

/* ----------------------------- validation ----------------------------- */

export type ReviewInput = { name: string; rating: number; review: string };
export type ValidationResult =
  | { ok: true; value: ReviewInput }
  | { ok: false; error: string };

export function validateReviewInput(
  name: unknown,
  rating: unknown,
  review: unknown
): ValidationResult {
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 60)
    return { ok: false, error: "Please enter your name (2–60 characters)." };

  const r = typeof rating === "number" ? rating : Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5)
    return { ok: false, error: "Please choose a star rating from 1 to 5." };

  if (typeof review !== "string" || review.trim().length < 5 || review.trim().length > 1000)
    return { ok: false, error: "Please write a short review (5–1000 characters)." };

  return { ok: true, value: { name: name.trim(), rating: r, review: review.trim() } };
}

/* ------------------------------ mutations ----------------------------- */

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function addReview(input: ReviewInput): Promise<SubmitResult> {
  const reviews = await readReviews();
  if (reviews.length >= MAX_STORED_REVIEWS)
    return { ok: false, error: "Review limit reached. Please contact us directly." };

  reviews.push({
    id: crypto.randomUUID(),
    name: input.name,
    rating: input.rating,
    review: input.review,
    date: new Date().toISOString(),
    status: "pending",
  });

  try {
    await writeReviews(reviews);
    return { ok: true };
  } catch (err) {
    console.error("Failed to save review:", err);
    return { ok: false, error: "Could not save your review. Please try again." };
  }
}

export async function setReviewStatus(
  id: string,
  status: ReviewStatus
): Promise<SubmitResult> {
  const reviews = await readReviews();
  const target = reviews.find((r) => r.id === id);
  if (!target) return { ok: false, error: "Review not found." };

  target.status = status;
  try {
    await writeReviews(reviews);
    return { ok: true };
  } catch (err) {
    console.error("Failed to update review:", err);
    return { ok: false, error: "Could not update the review." };
  }
}
