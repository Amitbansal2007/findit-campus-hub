import type { ItemType } from "@/data/items";
import { cn } from "@/lib/utils";

export function StatusBadge({ type, className }: { type: ItemType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        type === "lost" ? "bg-lost-soft text-lost" : "bg-found-soft text-found",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", type === "lost" ? "bg-lost" : "bg-found")} />
      {type === "lost" ? "Lost" : "Found"}
    </span>
  );
}
