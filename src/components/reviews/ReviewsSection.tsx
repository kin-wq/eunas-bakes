"use client";

import { useEffect, useState, useActionState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  submitReviewAction,
  type SubmitReviewState,
} from "@/app/reviews/actions";

type PublicReview = {
  id: string;
  name: string;
  rating: number;
  review: string;
  date: string;
};

const inputClass =
  "w-full rounded-2xl bg-cream-50 px-4 py-3.5 text-[15px] text-plum-900 ring-1 ring-plum-700/15 outline-none transition-shadow placeholder:text-plum-900/40 focus:ring-2 focus:ring-plum-500";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={
        filled
          ? "h-6 w-6 fill-gold-400 text-gold-400"
          : "h-6 w-6 fill-plum-700/15 text-plum-700/15"
      }
    >
      <path d="M12 2.6l2.86 6.05 6.44.7-4.8 4.36 1.3 6.36L12 16.9l-5.8 3.17 1.3-6.36-4.8-4.36 6.44-.7L12 2.6z" />
    </svg>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= value} />
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* --------------------------- interactive form -------------------------- */

function ReviewForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState<
    SubmitReviewState,
    FormData
  >(submitReviewAction, { ok: false });
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (state.ok && state.success) {
    return (
      <div
        className="rounded-[2rem] bg-white p-6 text-center shadow-[0_10px_40px_rgba(74,29,93,0.08)] ring-1 ring-plum-700/10 sm:p-8"
        role="status"
      >
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855]/12 text-2xl"
        >
          ✓
        </span>
        <h3 className="font-display mt-4 text-2xl font-bold text-plum-800">
          Thank you{state.name ? `, ${state.name}` : ""}!
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-plum-900/70">
          {state.success}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex min-h-[48px] cursor-pointer items-center rounded-full bg-plum-700 px-7 text-sm font-semibold text-white transition-colors hover:bg-plum-800"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-[2rem] bg-white p-6 shadow-[0_10px_40px_rgba(74,29,93,0.08)] ring-1 ring-plum-700/10 sm:p-8"
    >
      <h3 className="font-display text-2xl font-bold text-plum-800">
        Leave a review
      </h3>
      <p className="mt-1.5 text-sm text-plum-900/60">
        Share your experience — reviews appear publicly after a quick approval.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="review-name"
            className="mb-1.5 block text-sm font-bold text-plum-800"
          >
            Your name
          </label>
          <input
            id="review-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={60}
            placeholder="e.g. Tendai M."
            className={inputClass}
            required
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-bold text-plum-800">
            Your rating
          </legend>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(0)}
                aria-pressed={rating === i}
                aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-cream-100 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:outline-none"
              >
                <span
                  className={
                    i <= (hovered || rating)
                      ? "text-2xl leading-none text-gold-400"
                      : "text-2xl leading-none text-plum-700/25"
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-plum-900/60">
              {rating > 0 ? `${rating} of 5` : "Tap to rate"}
            </span>
          </div>
          <input type="hidden" name="rating" value={rating} />
        </fieldset>

        <div>
          <label
            htmlFor="review-text"
            className="mb-1.5 block text-sm font-bold text-plum-800"
          >
            Your review
          </label>
          <textarea
            id="review-text"
            name="review"
            rows={4}
            maxLength={1000}
            placeholder="Tell us about your cake — taste, service, delivery…"
            className={`${inputClass} min-h-[120px] resize-y`}
            required
          />
        </div>

        {state.error ? (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
          >
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-full bg-plum-700 px-7 text-sm font-bold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------- section ------------------------------- */

export function ReviewsSection() {
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: PublicReview[]) => {
        if (!cancelled && Array.isArray(data)) setReviews(data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = (reviews ?? []).slice(0, 8);

  return (
    <section className="bg-cream-50 py-16 sm:py-20" aria-label="Customer reviews">
      <SectionHeading
        eyebrow="Reviews"
        title="What our customers say"
        description="Real words from real customers. Be one of the first to review Euna Bakes."
      />
      <Container>
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-4">
            {reviews === null ? (
              <div
                className="h-28 animate-pulse rounded-[1.75rem] bg-plum-700/8"
                aria-label="Loading reviews"
              />
            ) : visible.length === 0 ? (
              <div className="rounded-[1.75rem] border-2 border-dashed border-plum-700/20 bg-white p-8 text-center">
                <div className="flex justify-center gap-1" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} filled={false} />
                  ))}
                </div>
                <p className="font-display mt-4 text-xl font-bold text-plum-800">
                  Be one of the first to review Euna Bakes.
                </p>
                <p className="mt-2 text-sm text-plum-900/60">
                  Your review helps other customers choose with confidence.
                </p>
              </div>
            ) : (
              <>
                {visible.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-[1.75rem] bg-white p-5 ring-1 ring-plum-700/10 sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <StarRow value={r.rating} />
                      <time
                        className="text-xs font-semibold text-plum-900/45"
                        dateTime={r.date}
                      >
                        {formatDate(r.date)}
                      </time>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-plum-900/80">
                      {r.review}
                    </p>
                    <p className="mt-3 text-sm font-bold text-plum-700">
                      {r.name}
                    </p>
                  </article>
                ))}
                {(reviews ?? []).length > visible.length ? (
                  <p className="text-center text-xs text-plum-900/50">
                    Showing the latest {visible.length} of {reviews?.length} reviews.
                  </p>
                ) : null}
              </>
            )}
          </div>

          <ReviewForm
            key={formKey}
            onReset={() => setFormKey((k) => k + 1)}
          />
        </div>
      </Container>
    </section>
  );
}
