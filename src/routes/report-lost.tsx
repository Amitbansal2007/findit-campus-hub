import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { ReportForm } from "@/components/items/ReportForm";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/report-lost")({
  head: () => ({
    meta: [
      { title: "Report a Lost Item – FindIt" },
      { name: "description", content: "Lost something on campus? Post it in a minute and let FindIt and fellow students help you get it back." },
      { property: "og:title", content: "Report a Lost Item – FindIt" },
      { property: "og:description", content: "Lost something on campus? Post it in a minute and let FindIt and fellow students help you get it back." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportLostPage,
});

const TIPS = [
  "Report as soon as possible — most items are found within 24 hours.",
  "Mention unique marks: stickers, scratches, names written inside.",
  "Check Browse Items regularly — someone may have already found it.",
];

function ReportLostPage() {
  return (
    <>
      <PageHeader
        eyebrow="Report lost item"
        title="Report a lost item"
        description="Lost something on campus? Post it in a minute and let FindIt and fellow students help you get it back."
      />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          <ReportForm type="lost" />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-gradient-navy p-7 text-navy-foreground shadow-elevated">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-foreground/10 text-sky">
              <Lightbulb className="h-5 w-5" />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Helpful tips</h2>
            <ul className="mt-4 space-y-4">
              {TIPS.map((tip, i) => (
                <li key={tip} className="flex gap-3 text-sm text-navy-muted">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-foreground/10 text-xs font-semibold text-navy-foreground">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
