import { Brain, Check, MapPin, ScanText, ShieldCheck, Sparkles } from "lucide-react";
import idCard from "@/assets/item-id-card.jpg";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const FEATURES = [
  { icon: ScanText, title: "Understands descriptions", text: "Reads free-text details like colour, brand and markings." },
  { icon: MapPin, title: "Location & time aware", text: "Weighs where and when items were lost and found." },
  { icon: ShieldCheck, title: "Private by default", text: "Contact details stay hidden until both sides agree." },
];

const SIGNALS = [
  ["Category", "Both are ID cards"],
  ["Description", "Navy lanyard mentioned in both"],
  ["Location", "Central Library → Admin Building"],
  ["Date", "Reported close together"],
] as const;

export function SmartMatching() {
  return (
    <section className="relative overflow-hidden bg-gradient-navy py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(60%_70%_at_70%_40%,black,transparent)]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionHeading
            inverted
            eyebrow="AI Smart Matching"
            title={
              <>
                Let AI do the searching <br className="hidden sm:block" />
                for you.
              </>
            }
            description="Every new report is compared against all existing ones. When a found item looks like your lost one, you're notified right away."
          />
          <ul className="mt-10 space-y-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-navy-foreground/15 bg-navy-foreground/10 text-teal-bright">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-navy-foreground">{f.title}</p>
                  <p className="mt-0.5 text-sm text-navy-muted">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative rounded-3xl border border-navy-foreground/15 bg-navy-foreground/[0.06] p-5 backdrop-blur-md sm:p-7">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-navy-foreground">
                <Brain className="h-4 w-4 text-teal-bright" /> How a match is spotted
              </span>
              <span className="rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold text-teal-bright">
                Example
              </span>
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <div className="rounded-2xl bg-card p-3 shadow-elevated">
                <img src={idCard} alt="Lost student ID card" className="aspect-square w-full rounded-xl object-cover" loading="lazy" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-lost">Lost</p>
                <p className="text-sm font-medium text-foreground">ID card</p>
                <p className="text-xs text-muted-foreground">Central Library</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-foreground text-navy shadow-glow animate-pulse-ring">
                  <Sparkles className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-foreground">Possible match</span>
              </div>
              <div className="rounded-2xl bg-card p-3 shadow-elevated">
                <img src={idCard} alt="Found student ID card" className="aspect-square w-full rounded-xl object-cover object-right" loading="lazy" />
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-found">Found</p>
                <p className="text-sm font-medium text-foreground">ID card</p>
                <p className="text-xs text-muted-foreground">Admin Building</p>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5">
              {SIGNALS.map(([label, value]) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-navy-foreground/10 bg-navy-foreground/[0.04] px-3 py-2.5 text-xs"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/25 text-teal-bright">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="w-20 shrink-0 font-semibold text-navy-foreground">{label}</span>
                  <span className="min-w-0 text-navy-muted">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
