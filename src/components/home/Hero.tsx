import { Link } from "@tanstack/react-router";
import { Camera, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-campus-desk.jpg";
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
    <section className="relative overflow-hidden bg-gradient-home">
      <div className="pointer-events-none absolute inset-0 bg-grid-light [mask-image:radial-gradient(65%_55%_at_70%_20%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-teal/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-28 lg:pt-16">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1 pr-3.5 text-xs font-medium text-navy-soft shadow-soft backdrop-blur">
            <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[11px] font-semibold text-teal-deep">New</span>
            AI-assisted lost & found for your campus
          </div>

          <h1 className="animate-fade-up mt-6 text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground [animation-delay:80ms] sm:text-6xl lg:text-[4.25rem]">
            Lost on campus?
            <br />
            <span className="relative inline-block text-teal-deep">
              Found
              <svg
                aria-hidden="true"
                viewBox="0 0 200 14"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-3 w-full text-teal sm:-bottom-2"
              >
                <path
                  d="M2 9 C 50 2, 120 2, 198 7"
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="1"
                  className="animate-draw opacity-60"
                />
              </svg>
            </span>{" "}
            on FindIt.
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">
            One trusted place for every lost and found report on campus — so your ID card, wallet or earphones
            find their way back to you.
          </p>

          <div className="animate-fade-up mt-8 max-w-xl [animation-delay:240ms]">
            <SearchBar size="xl" />
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="mr-0.5 font-medium">Popular:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p}
                  to="/browse"
                  search={{ q: p }}
                  className="rounded-full border border-border bg-card/90 px-3 py-1 transition-all duration-200 hover:-translate-y-px hover:border-teal/40 hover:text-teal-deep"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          <ReportActions className="animate-fade-up mt-7 max-w-xl [animation-delay:320ms]" />

          <ul className="animate-fade-up mt-9 flex max-w-xl flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground [animation-delay:400ms] sm:flex-row sm:flex-wrap sm:gap-x-6">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-2">
                <f.icon className="h-4 w-4 shrink-0 text-teal-deep" />
                {f.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative lg:col-span-6">
          <div className="animate-fade-up relative mx-auto max-w-2xl [animation-delay:200ms] lg:max-w-none">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-teal opacity-[0.08] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-frame">
              <div className="relative overflow-hidden rounded-[1.6rem]">
                <img
                  src={heroImage}
                  alt="Tagged student belongings — ID card, wallet, keys, earbuds, water bottle and a book — on a campus lost and found desk"
                  className="aspect-[5/4] w-full object-cover object-[50%_70%] sm:aspect-[4/3] lg:aspect-[5/5.2]"
                  width={1536}
                  height={1024}
                  fetchPriority="high"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep/45 to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-soft backdrop-blur">
                  <MapPin className="h-3.5 w-3.5 text-teal-deep" /> Campus lost & found desk
                </span>
              </div>
            </div>

            <div className="absolute -left-3 top-8 hidden animate-float rounded-2xl border border-border bg-card/95 p-3 pr-4 shadow-elevated backdrop-blur sm:block lg:-left-8">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-soft text-teal-deep">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Private by default</p>
                  <p className="text-xs text-muted-foreground">Contact details stay hidden</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 -bottom-6 hidden animate-float rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur [animation-delay:1.5s] sm:block lg:-right-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-deep">
                <Sparkles className="h-3.5 w-3.5" /> AI Smart Matching
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">Compares every new report</p>
              <div className="mt-2.5 flex gap-1.5">
                {["Category", "Place", "Date"].map((t) => (
                  <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-navy-soft">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
