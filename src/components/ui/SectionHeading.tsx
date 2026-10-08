import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Container
      className={cn(
        "mb-10 sm:mb-12",
        align === "center" ? "text-center" : "text-left"
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.22em]",
          dark ? "text-blush-200" : "text-plum-500"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display mt-3 text-3xl leading-tight font-semibold text-balance sm:text-4xl",
          dark ? "text-white" : "text-plum-800"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-base leading-relaxed",
            align === "left" && "mx-0",
            dark ? "text-white/80" : "text-plum-900/70"
          )}
        >
          {description}
        </p>
      ) : null}
    </Container>
  );
}
