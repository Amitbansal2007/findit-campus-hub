
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  PackagePlus,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-items.jpg";
import { SearchBar } from "@/components/items/SearchBar";
import { ReportActions } from "./ReportActions";

const POPULAR = ["ID card", "Wallet", "Keys", "Earbuds", "Water bottle"];

const FEATURES = [
  { icon: Camera, text: "Photo, place & date on every report" },
  { icon: Sparkles, text: "Smart matching of lost & found" },
  { icon: ShieldCheck, text: "Contact details kept private" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f8fc]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-100/60 blur-[110px]" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-100/70 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#10254b_1px,transparent_1px),linear-gradient(90deg,#10254b_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-28 lg:pt-24">

        {/* LEFT CONTENT */}
        <div className="relative z-10 lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-[#087e83] shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            YOUR CAMPUS. YOUR COMMUNITY. YOUR FINDIT.
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.055em] text-[#101c35] sm:text-6xl lg:text-[4.65rem]">
            Lost something?
            <span className="mt-2 block text-[#087e83]">
              Bring it back.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            From misplaced keys to lost ID cards, FindIt makes it easier
            for your campus community to report, discover and return
            belongings.
          </p>

          {/* SEARCH */}
          <div className="mt-9 max-w-xl rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_55px_-25px_rgba(15,35,70,0.28)]">
            <SearchBar />
          </div>

          {/* POPULAR SEARCHES */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Popular
            </span>
            {POPULAR.map((item) => (
              <Link
                key={item}
                to="/browse"
                search={{ q: item }}
                className="rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* ACTION CARDS */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              to="/report-lost"
              className="group flex min-h-[108px] items-center gap-4 rounded-2xl bg-[#142544] p-5 text-white shadow-lg shadow-blue-950/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1c355e] hover:shadow-xl"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-orange-300">
                <PackageSearch className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">I lost something</span>
                <span className="mt-1 block text-xs text-slate-300">
                  Report a missing item
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-teal-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>

            <Link
              to="/report-found"
              className="group flex min-h-[108px] items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-[#142544] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <PackagePlus className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">I found something</span>
                <span className="mt-1 block text-xs text-slate-500">
                  Help return it to its owner
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-teal-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* FEATURE STRIP */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-teal-700" />
              Easy item discovery
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-700" />
              Campus locations
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              Community reporting
            </span>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative lg:col-span-6">
          <div className="absolute -inset-8 rounded-full bg-teal-200/30 blur-[75px]" />

          <div className="relative mx-auto max-w-[570px]">
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2.5rem] border border-teal-200/70 sm:-right-6 sm:-top-6" />

            <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-white bg-white shadow-[0_35px_90px_-30px_rgba(15,35,70,0.35)]">
              <img
                src={heroImage}
                alt="Personal belongings such as an ID card, wallet, keys, earbuds and water bottle"
                className="aspect-[1.08] w-full object-cover"
                width={1100}
                height={1005}
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101c35]/90 via-[#101c35]/35 to-transparent p-7 pt-28 text-white sm:p-9 sm:pt-36">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                  FindIt Campus Hub
                </span>
                <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                  Every lost item deserves a way home.
                </h2>
                <p className="mt-2 text-sm text-white/75">
                  One place to report, search and reconnect.
                </p>
              </div>
            </div>

            {/* Floating information card */}
            <div className="absolute -left-3 top-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:-left-9 sm:top-14">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#142544]">
                  Lost & Found
                </span>
                <span className="block text-xs text-slate-500">
                  All in one campus hub
                </span>
              </span>
            </div>

            {/* Bottom floating card */}
            <div className="absolute -bottom-6 -right-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-right-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-800">
                <PackagePlus className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#142544]">
                  Be part of the solution
                </span>
                <span className="block text-xs text-slate-500">
                  Report. Discover. Return.
                </span>
              </span>
              <ArrowRight className="ml-1 h-4 w-4 text-teal-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
