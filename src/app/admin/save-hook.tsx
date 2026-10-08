"use client";

import { useState } from "react";
import { saveSectionAction } from "@/app/admin/actions";

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

/** Per-section save wiring for admin editors. */
export function useSectionSaver(section: string) {
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  async function save(data: unknown): Promise<boolean> {
    setStatus({ kind: "saving" });
    try {
      const result = await saveSectionAction(section, JSON.stringify(data));
      if (result.ok) {
        setStatus({ kind: "saved" });
        return true;
      }
      setStatus({ kind: "error", message: result.error ?? "Save failed." });
      return false;
    } catch {
      setStatus({ kind: "error", message: "Network error. Try again." });
      return false;
    }
  }

  return { status, save };
}

export function StatusLine({ status }: { status: SaveStatus }) {
  if (status.kind === "idle") return null;
  if (status.kind === "saving")
    return <p className="text-xs font-semibold text-white/60">Saving…</p>;
  if (status.kind === "saved")
    return (
      <p role="status" className="text-xs font-semibold text-emerald-300">
        Saved — live on the website now.
      </p>
    );
  return (
    <p role="alert" className="text-xs font-semibold text-red-300">
      {status.message}
    </p>
  );
}
