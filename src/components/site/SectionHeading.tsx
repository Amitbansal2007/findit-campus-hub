import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  inverted = false,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  inverted?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
              inverted ? "text-sky" : "text-navy-soft",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-3xl font-bold leading-tight sm:text-4xl",
            inverted ? "text-navy-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-3 text-base leading-relaxed", inverted ? "text-navy-muted" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
