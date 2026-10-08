"use client";

import type { ReactNode } from "react";
import { StatusLine, type SaveStatus } from "@/app/admin/save-hook";
import { cn } from "@/lib/utils";

export const inputCls =
  "min-h-[48px] w-full rounded-xl bg-white/10 px-3.5 text-sm text-white ring-1 ring-white/15 placeholder:text-white/30 focus:ring-2 focus:ring-blush-300 focus:outline-none";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-[13px] font-bold text-white/85">
      {label}
      {hint ? (
        <span className="mt-0.5 block text-xs font-normal text-white/45">{hint}</span>
      ) : null}
      <span className="mt-1.5 block font-normal">{children}</span>
    </label>
  );
}

export function SaveBar({
  status,
  onSave,
  label = "Save changes",
}: {
  status: SaveStatus;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={onSave}
        disabled={status.kind === "saving"}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-blush-400 px-7 text-sm font-bold text-plum-900 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status.kind === "saving" ? "Saving…" : label}
      </button>
      <StatusLine status={status} />
    </div>
  );
}

export function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex min-h-[40px] items-center rounded-xl bg-red-500/15 px-4 text-xs font-bold text-red-200 hover:bg-red-500/25"
    >
      Remove
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 text-sm font-bold",
        "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
      )}
    >
      + {label}
    </button>
  );
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
