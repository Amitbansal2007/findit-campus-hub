
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Tag,
} from "lucide-react";
import type { Item } from "@/data/items";
import { StatusBadge } from "./StatusBadge";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      to="/items/$itemId"
      params={{ itemId: item.id }}
      className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_-18px_rgba(15,35,70,0.22)] transition-all duration-300 hover:-translate-y-2 hover:border-teal-200 hover:shadow-[0_24px_55px_-20px_rgba(15,35,70,0.28)]"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-60" />

        {/* Status badge */}
        <div className="absolute left-4 top-4">
          <StatusBadge
            type={item.type}
            className="rounded-full border border-white/70 bg-white/95 px-3 py-1.5 font-semibold shadow-md backdrop-blur-md"
          />
        </div>

        {/* View icon */}
        <span className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-[#142544] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>

        {/* Category */}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-slate-950/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <Tag className="h-3.5 w-3.5" />
          {item.category}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-[#142544] transition-colors group-hover:text-teal-700">
            {item.title}
          </h3>

          <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal-700" />
        </div>

        {/* Details */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="min-w-0 truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate">{item.date}</span>
            </span>

            <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
              {item.postedLabel}
            </span>
          </div>
        </div>

        {/* Bottom action */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold text-slate-500">
            Item details
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 transition-all group-hover:gap-2.5">
            View details
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
