"use client";

import { useState } from "react";
import { setReviewStatusAction } from "@/app/admin/actions";
import type { Review, ReviewStatus } from "@/lib/reviews";
import { cn } from "@/lib/utils";

const statusPill: Record<ReviewStatus, string> = {
  pending: "bg-gold-400/15 text-gold-400 ring-gold-400/30",
  approved: "bg-[#1fa855]/15 text-green-400 ring-green-400/30",
  rejected: "bg-red-400/15 text-red-400 ring-red-400/30",
};

const statusOrder: Record<ReviewStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

function Stars({ value }: { value: number }) {
  return (
    <span className="text-sm tracking-tight text-gold-400" aria-label={`${value} of 5 stars`}>
      {"★".repeat(value)}
      <span className="text-white/20">{"★".repeat(5 - value)}</span>
    </span>
  );
}

/** Admin moderation panel — approve/reject customer-submitted reviews. */
export function ReviewsModeration({ initial }: { initial: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function update(id: string, status: ReviewStatus) {
    setBusy(id);
    setError("");
    const res = await setReviewStatusAction(id, status);
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } else {
      setError(res.error ?? "Could not update the review.");
    }
    setBusy(null);
  }

  const sorted = [...reviews].sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      b.date.localeCompare(a.date)
  );
  const counts = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  if (reviews.length === 0) {
    return (
      <div className="rounded-[1.75rem] bg-white/5 p-8 text-center ring-1 ring-white/10">
        <p className="font-display text-xl font-bold text-white">
          No reviews yet
        </p>
        <p className="mt-2 text-sm text-white/55">
          Customer submissions from the website will appear here for approval.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs font-bold">
        <span className="rounded-full bg-gold-400/15 px-4 py-2 text-gold-400 ring-1 ring-gold-400/30">
          {counts.pending} pending
        </span>
        <span className="rounded-full bg-[#1fa855]/15 px-4 py-2 text-green-400 ring-1 ring-green-400/30">
          {counts.approved} approved
        </span>
        <span className="rounded-full bg-red-400/15 px-4 py-2 text-red-400 ring-1 ring-red-400/30">
          {counts.rejected} rejected
        </span>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-400">
          {error}
        </p>
      ) : null}

      <ul className="space-y-4">
        {sorted.map((r) => (
          <li
            key={r.id}
            className="rounded-[1.5rem] bg-white/5 p-5 ring-1 ring-white/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Stars value={r.rating} />
                <span className="text-sm font-bold text-white">{r.name}</span>
                <time className="text-xs text-white/45" dateTime={r.date}>
                  {new Date(r.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-bold uppercase ring-1",
                  statusPill[r.status]
                )}
              >
                {r.status}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {r.review}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {r.status !== "approved" ? (
                <button
                  type="button"
                  disabled={busy === r.id}
                  onClick={() => update(r.id, "approved")}
                  className="min-h-[40px] cursor-pointer rounded-full bg-[#1fa855] px-5 text-xs font-bold text-white transition-colors hover:bg-[#178a45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Approve
                </button>
              ) : null}
              {r.status !== "rejected" ? (
                <button
                  type="button"
                  disabled={busy === r.id}
                  onClick={() => update(r.id, "rejected")}
                  className="min-h-[40px] cursor-pointer rounded-full bg-red-500/80 px-5 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
              ) : null}
              {r.status !== "pending" ? (
                <button
                  type="button"
                  disabled={busy === r.id}
                  onClick={() => update(r.id, "pending")}
                  className="min-h-[40px] cursor-pointer rounded-full bg-white/10 px-5 text-xs font-bold text-white/80 ring-1 ring-white/15 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back to pending
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
