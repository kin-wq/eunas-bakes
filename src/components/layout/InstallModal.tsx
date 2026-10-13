"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard pattern for client-only hydration
    setMounted(true);
    const dismissed = sessionStorage.getItem("install-modal-dismissed");
    if (dismissed) return;

    const ua = navigator.userAgent;
    setIsAndroid(/Android/i.test(ua));
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const timer = setTimeout(() => {
      if (!dismissed) setIsOpen(true);
    }, 1500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleDownload = () => {
    if (isAndroid || !isIOS) {
      const link = document.createElement("a");
      link.href = "/downloads/eunas-bakes.apk";
      link.download = "eunas-bakes.apk";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (isAndroid) {
        setTimeout(() => {
          alert(
            "The APK has started downloading. Once complete, open the file to install. " +
              "You may need to allow installation from this browser in Android Settings > Apps > Special access > Install unknown apps."
          );
        }, 500);
      }
    }
    dismiss();
  };

  const handlePWAInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      dismiss();
    }
  };

  const dismiss = () => {
    sessionStorage.setItem("install-modal-dismissed", "true");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") dismiss();
  };

  if (!mounted || !isOpen) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-plum-900/50 backdrop-blur-sm animate-fade-in"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full max-w-sm rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(44,18,57,0.25)] ring-1 ring-plum-700/10 overflow-hidden animate-scale-in",
          isMobile && "mx-auto"
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 rounded-full p-1.5 text-plum-900/30 hover:text-plum-900/60 hover:bg-plum-700/5 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2 transition-colors"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="px-6 py-6 sm:px-8 sm:py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-plum-600 to-plum-400 text-xl">
            🍰
          </div>

          <h2 id="install-modal-title" className="font-display text-2xl font-bold text-plum-800">
            Meet Euna Bakes on your phone!
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-plum-900/70">
            Get quicker access to our cake menu and order your favourite cakes conveniently.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {isAndroid && promptEvent ? (
              <>
                <button
                  type="button"
                  onClick={handlePWAInstall}
                  className="w-full min-h-[48px] rounded-full bg-plum-700 px-6 text-sm font-bold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
                >
                  Install App
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full min-h-[48px] rounded-full bg-[#1fa855] px-6 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-[#178a45] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  Download Android App
                </button>
              </>
            ) : isAndroid ? (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full min-h-[48px] rounded-full bg-[#1fa855] px-6 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-[#178a45] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  Download Android App
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full min-h-[48px] rounded-full bg-white px-6 text-sm font-bold text-plum-800 ring-1 ring-plum-700/15 shadow-sm transition-colors hover:bg-cream-100 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
                >
                  Maybe Later
                </button>
              </>
            ) : isIOS ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "To add Euna Bakes to your iPhone/iPad:\n\n" +
                        "1. Tap the Share button (square with arrow up)\n" +
                        "2. Scroll down and tap \"Add to Home Screen\"\n" +
                        "3. Tap \"Add\" in the top right\n\n" +
                        "The app will appear on your home screen for quick access!"
                    );
                    dismiss();
                  }}
                  className="w-full min-h-[48px] rounded-full bg-plum-700 px-6 text-sm font-bold text-white shadow-lg shadow-plum-700/25 transition-colors hover:bg-plum-800 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
                >
                  Add to Home Screen
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full min-h-[48px] rounded-full bg-white px-6 text-sm font-bold text-plum-800 ring-1 ring-plum-700/15 shadow-sm transition-colors hover:bg-cream-100 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
                >
                  Maybe Later
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full min-h-[48px] rounded-full bg-[#1fa855] px-6 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-[#178a45] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  Download Android App
                </button>
                <p className="text-xs text-plum-900/50">
                  This is an Android application (APK). It cannot be installed on desktop.
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full min-h-[48px] rounded-full bg-white px-6 text-sm font-bold text-plum-800 ring-1 ring-plum-700/15 shadow-sm transition-colors hover:bg-cream-100 focus-visible:ring-2 focus-visible:ring-plum-500 focus-visible:ring-offset-2"
                >
                  Maybe Later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}