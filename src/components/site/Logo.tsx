import { Link } from "@tanstack/react-router";
import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:-rotate-6",
          inverted ? "bg-navy-foreground text-navy" : "bg-gradient-navy text-primary-foreground shadow-glow",
        )}
      >
        <ScanSearch className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            inverted ? "text-navy-foreground" : "text-foreground",
          )}
        >
          FindIt
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em]",
            inverted ? "text-navy-muted" : "text-muted-foreground",
          )}
        >
          Campus Lost & Found
        </span>
      </span>
    </Link>
  );
}
