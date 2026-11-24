import { Link } from "@tanstack/react-router";
import { ArrowRight, PackagePlus, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    to: "/report-lost",
    label: "Report Lost Item",
    hint: "Tell campus what's missing",
    icon: PackageSearch,
    primary: true,
    chip: "bg-lost-soft text-lost",
  },
  {
    to: "/report-found",
    label: "Report Found Item",
    hint: "Help it get back to its owner",
    icon: PackagePlus,
    primary: false,
    chip: "bg-found-soft text-found",
  },
] as const;

/** Matching pair of report buttons: same shape and size, navy primary + white secondary. */
export function ReportActions({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {ACTIONS.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className={cn(
            "group flex items-center gap-3 rounded-2xl border p-2.5 pr-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
            a.primary
              ? "border-transparent bg-gradient-navy text-primary-foreground shadow-glow hover:shadow-elevated"
              : "border-border bg-card text-foreground shadow-soft hover:border-teal/40 hover:shadow-elevated",
          )}
        >
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", a.chip)}>
            <a.icon className="h-5 w-5" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-[0.95rem] font-semibold leading-tight">{a.label}</span>
            <span className={cn("mt-0.5 truncate text-xs", a.primary ? "text-navy-muted" : "text-muted-foreground")}>
              {a.hint}
            </span>
          </span>
          <ArrowRight
            className={cn(
              "ml-auto h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1",
              a.primary ? "text-teal-bright" : "text-teal-deep",
            )}
          />
        </Link>
      ))}
    </div>
  );
}
