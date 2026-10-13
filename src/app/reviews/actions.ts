"use server";

import { headers } from "next/headers";
import { addReview, validateReviewInput } from "@/lib/reviews";
import { loginAllowed, recordLoginAttempt } from "@/lib/rate-limit";

/**
 * Public review submission (final polish).
 * Every new review enters with status "pending" — only admin-approved
 * reviews are ever returned by the public /api/reviews endpoint.
 */

export type SubmitReviewState = {
  ok: boolean;
  error?: string;
  success?: string;
  name?: string;
};

export async function submitReviewAction(
  _prev: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `review:${ip}`;
  if (!loginAllowed(key)) {
    return {
      ok: false,
      error: "Too many submissions. Please wait a few minutes and try again.",
    };
  }

  const v = validateReviewInput(
    formData.get("name"),
    formData.get("rating"),
    formData.get("review")
  );
  if (!v.ok) return { ok: false, error: v.error };

  const result = await addReview(v.value);
  if (!result.ok) return { ok: false, error: result.error };

  recordLoginAttempt(key);
  return {
    ok: true,
    name: v.value.name,
    success:
      "Thank you! Your review has been submitted and will appear publicly once it's approved.",
  };
}
