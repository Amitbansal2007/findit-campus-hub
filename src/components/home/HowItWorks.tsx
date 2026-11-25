
import { ClipboardEdit, Search, Eye } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const STEPS = [
  {
    icon: ClipboardEdit,
    title: "Report the item",
    text: "Submit a lost or found item report with its name, category, location, date and an optional photo.",
  },
  {
    icon: Search,
    title: "Browse and search",
    text: "Explore campus lost and found reports. Search by item name, colour or location and filter by category.",
  },
  {
    icon: Eye,
    title: "Check item details",
    text: "Open an item report to view its photo, description, category, location and date. Share the report when needed.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="Three simple steps to find an item"
            description="Report, browse and discover lost and found belongings in one campus platform."
          />
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <div className="group relative h-full rounded-3xl border border-border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-elevated">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-navy text-primary-foreground shadow-glow transition-transform group-hover:scale-105">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-accent">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
