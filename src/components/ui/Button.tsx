import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "whatsapp" | "outline-light";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-plum-700 text-white shadow-lg shadow-plum-700/25 hover:bg-plum-800 focus-visible:ring-plum-500",
  secondary:
    "bg-white text-plum-800 ring-1 ring-plum-700/15 shadow-sm hover:bg-cream-100 focus-visible:ring-plum-500",
  whatsapp:
    "bg-[#1fa855] text-white shadow-lg shadow-green-900/20 hover:bg-[#178a45] focus-visible:ring-green-500",
  "outline-light":
    "text-white ring-1 ring-white/40 bg-white/10 backdrop-blur hover:bg-white/20 focus-visible:ring-white",
};

export function Button({
  children,
  href,
  variant = "primary",
  className,
  external = false,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold tracking-wide transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    styles[variant],
    className
  );
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <path d="M12.04 2a9.87 9.87 0 0 0-8.5 14.74L2 22l5.4-1.5A9.87 9.87 0 1 0 12.04 2Zm0 1.8a8.07 8.07 0 1 1-4.12 15.02l-.3-.18-3.12.86.87-3.04-.2-.31a8.07 8.07 0 0 1 6.87-12.35Zm-3.27 4.1c-.17 0-.45.06-.68.32-.23.26-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.8 2.9 4.44 3.93 2.2.86 2.65.69 3.13.65.48-.05 1.55-.64 1.77-1.25.22-.61.22-1.14.15-1.25-.06-.11-.23-.17-.48-.3-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.56.13-.17.26-.65.81-.79.97-.15.17-.3.19-.55.06a6.7 6.7 0 0 1-1.98-1.22 7.42 7.42 0 0 1-1.37-1.7c-.14-.23-.01-.36.1-.48.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.07-.15.04-.28-.02-.39-.06-.11-.55-1.33-.75-1.81-.2-.47-.4-.4-.56-.41l-.48-.01Z" />
    </svg>
  );
}
