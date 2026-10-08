import { Button, WhatsAppIcon } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  message,
  label = "Order via WhatsApp",
  variant = "whatsapp",
  className,
  showNumber = false,
  number,
  internationalNumber,
}: {
  message?: string;
  label?: string;
  variant?: "whatsapp" | "primary" | "secondary" | "outline-light";
  className?: string;
  showNumber?: boolean;
  number?: string;
  /** Live admin-edited number; defaults to the central static config. */
  internationalNumber?: string;
}) {
  return (
    <Button
      href={getWhatsAppLink(message, internationalNumber)}
      external
      variant={variant}
      className={cn(className)}
      ariaLabel={`${label} on WhatsApp`}
    >
      <WhatsAppIcon />
      <span>
        {label}
        {showNumber && number ? ` · ${number}` : null}
      </span>
    </Button>
  );
}
