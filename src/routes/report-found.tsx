import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { ReportForm } from "@/components/items/ReportForm";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/report-found")({
  head: () => ({
    meta: [
      { title: "Report a Found Item – FindIt" },
      { name: "description", content: "Picked something up? Post it here so the owner can find it — you'll be making someone's day." },
      { property: "og:title", content: "Report a Found Item – FindIt" },
      { property: "og:description", content: "Picked something up? Post it here so the owner can find it — you'll be making someone's day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportFoundPage,
});

const TIPS = [
  "Hand valuables like wallets and ID cards to the security desk.",
  "Don't post private details such as card numbers in the description.",
  "Ask the owner to describe the item before handing it over.",
];

function ReportFoundPage() {
  return (
    <>
      <PageHeader
        eyebrow="Report found item"
        title="Report a found item"
        description="Picked something up? Post it here so the owner can find it — you'll be making someone's day."
      />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-8">
          <ReportForm type="found" />
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
