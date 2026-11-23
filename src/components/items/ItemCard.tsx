import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import type { Item } from "@/data/items";
import { StatusBadge } from "./StatusBadge";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      to="/items/$itemId"
      params={{ itemId: item.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <StatusBadge type={item.type} className="absolute left-3 top-3 bg-card/95 backdrop-blur" />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card/95 text-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-navy-soft">{item.category}</span>
          <span className="text-xs text-muted-foreground">{item.postedLabel}</span>
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">{item.title}</h3>
        <div className="mt-auto flex flex-col gap-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {item.date}
          </span>
        </div>
      </div>
    </Link>
  );
}
