import { Button, WhatsAppIcon } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  message,
  label = `WhatsApp ${siteConfig.businessName}`,
  variant = "whatsapp",
  className,
  internationalNumber,
}: {
  message?: string;
  label?: string;
  variant?: "whatsapp" | "primary" | "secondary" | "outline-light";
  className?: string;
  /** Live admin-edited number; defaults to the central static config. */
  internationalNumber?: string;
}) {
  return (
    <Button
      href={getWhatsAppLink(message, internationalNumber)}
      external
      variant={variant}
      className={cn(className)}
      ariaLabel={label}
    >
      <WhatsAppIcon />
      <span>{label}</span>
    </Button>
  );
}
