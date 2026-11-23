import { Link } from "@tanstack/react-router";
import { CheckCircle2, PackagePlus, PackageSearch, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-items.jpg";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/items/SearchBar";

const POPULAR = ["ID card", "Wallet", "Keys", "Earbuds", "Water bottle"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="lg:col-span-6">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-navy-soft shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-sky" />
            AI-powered campus lost & found
          </div>
          <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.05] text-foreground [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            Lost it on campus? <span className="text-gradient">Find it here.</span>
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:160ms]">
            FindIt brings every lost and found report on campus into one place — so your ID card, wallet or
            earphones find their way back to you, fast.
          </p>

          <div className="animate-fade-up mt-8 max-w-xl [animation-delay:240ms]">
            <SearchBar />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Popular:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p}
                  to="/browse"
                  search={{ q: p }}
                  className="rounded-full border border-border bg-card px-3 py-1 transition-colors hover:border-navy-soft hover:text-foreground"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 [animation-delay:320ms] sm:flex-row">
            <Button asChild variant="lost" size="xl">
              <Link to="/report-lost">
                <PackageSearch /> Report Lost Item
              </Link>
            </Button>
            <Button asChild variant="found" size="xl">
              <Link to="/report-found">
                <PackagePlus /> Report Found Item
              </Link>
            </Button>
          </div>

          <dl className="animate-fade-up mt-10 grid max-w-md grid-cols-3 gap-6 [animation-delay:400ms]">
            {[
              ["1,240+", "Items reported"],
              ["86%", "Returned to owners"],
              ["< 24h", "Avg. match time"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-bold text-foreground">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="animate-fade-up relative mx-auto max-w-lg [animation-delay:200ms]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-navy opacity-10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-elevated">
              <img
                src={heroImage}
                alt="Student belongings: ID card, wallet, keys, earbuds, water bottle and notebook"
                className="aspect-[1.1] w-full rounded-[1.6rem] object-cover"
                width={1100}
                height={1005}
              />
            </div>

            <div className="absolute -left-4 top-10 animate-float rounded-2xl border border-border bg-card/95 p-3 pr-4 shadow-elevated backdrop-blur sm:-left-10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-found-soft text-found">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Wallet returned</p>
                  <p className="text-xs text-muted-foreground">Central Library · 2h ago</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-2 animate-float rounded-2xl border border-border bg-card/95 p-4 shadow-elevated backdrop-blur [animation-delay:1.5s] sm:-right-8">
              <div className="flex items-center gap-2 text-xs font-medium text-navy-soft">
                <Sparkles className="h-3.5 w-3.5 text-sky" /> AI Smart Match
              </div>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">94% match</p>
              <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[94%] rounded-full bg-gradient-navy" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Student ID card · Admin Building</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
