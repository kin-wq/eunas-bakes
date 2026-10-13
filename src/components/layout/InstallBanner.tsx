"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Smart install banner (final polish).
 *
 * • On Chrome Android (and other supporting browsers) the native
 *   `beforeinstallprompt` event fires when the PWA meets install criteria.
 *   We capture it and show a non-intrusive banner with the **browser's own
 *   "Install" button** — this creates a WebAPK (same as our TWA).
 *
 * • If the event never fires (already installed, unsupported browser, or
 *   user dismissed), we fall back to a manual "Get the Android app" link
 *   pointing to the standalone APK we host.
 *
 * • Banner auto-hides after install or dismissal; persists dismissal in
 *   sessionStorage so it doesn't reappear on every page view.
 */
export function InstallBanner() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [mounted, setMounted] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard pattern for client-only mounted flag
    setMounted(true);
    const dismissed = sessionStorage.getItem("install-banner-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as BeforeInstallPromptEvent;
      promptRef.current = ev;
      setPromptEvent(ev);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Fallback timer — runs once after mount
  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      if (!promptRef.current && !showFallback) {
        setShowFallback(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [mounted, showFallback]);

  const handleInstall = async () => {
    const ev = promptRef.current;
    if (!ev) return;
    await ev.prompt();
    const { outcome } = await ev.userChoice;
    if (outcome === "accepted") {
      sessionStorage.setItem("install-banner-dismissed", "true");
      setPromptEvent(null);
      promptRef.current = null;
    }
  };

  const dismiss = () => {
    sessionStorage.setItem("install-banner-dismissed", "true");
    setPromptEvent(null);
    setShowFallback(false);
    promptRef.current = null;
  };

  if (!mounted) return null;
  if (!promptEvent && !showFallback) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6",
        "animate-slide-up"
      )}
      role="region"
      aria-label="App installation"
    >
      <div className="mx-auto max-w-md rounded-[1.5rem] bg-white shadow-[0_-10px_40px_rgba(74,29,93,0.12)] ring-1 ring-plum-700/10 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span aria-hidden="true" className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-plum-700/10 text-plum-700 text-xl">
              ✦
            </span>
            <div>
              <p className="font-display text-base font-bold text-plum-800">
                Install Euna&apos;s Bakes
              </p>
              <p className="text-[13px] text-plum-900/60">
                {promptEvent
                  ? "Tap “Install” to add the app to your home screen — fast, offline-ready, no app store needed."
                  : "Get the full app experience with offline access and home-screen launch."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-full p-1.5 text-plum-900/30 hover:text-plum-900/60 focus-visible:ring-2 focus-visible:ring-plum-500"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {promptEvent ? (
            <button
              type="button"
              onClick={handleInstall}
              className="flex-1 min-h-[48px] rounded-full bg-plum-700 px-5 text-sm font-bold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
            >
              Install
            </button>
          ) : (
            <a
              href="/downloads/eunas-bakes.apk"
              download
              className="flex-1 min-h-[48px] inline-flex items-center justify-center rounded-full bg-[#1fa855] px-5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-[#178a45] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              Download Android App
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}