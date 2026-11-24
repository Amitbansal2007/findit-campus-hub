import { ClipboardEdit, HeartHandshake, Sparkles } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const STEPS = [
  {
    icon: ClipboardEdit,
    title: "Report the item",
    text: "Post what you lost or found in under a minute — add a photo, the place and the date.",
  },
  {
    icon: Sparkles,
    title: "Get smart matches",
    text: "Our AI compares descriptions, categories and locations to surface likely matches instantly.",
  },
  {
    icon: HeartHandshake,
    title: "Reunite & return",
    text: "Verify ownership, connect safely and hand the item back — on campus, the same day.",
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
            title="Three simple steps to get it back"
            description="No more notice boards or endless group chats. FindIt keeps it simple."
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
                  <span className="font-display text-5xl font-extrabold text-teal-soft transition-colors group-hover:text-teal/30">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
