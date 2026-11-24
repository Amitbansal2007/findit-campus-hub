import { Reveal } from "@/components/site/Reveal";
import { ReportActions } from "./ReportActions";

export function CtaBand() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-home px-6 py-14 text-center shadow-soft sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-70 [mask-image:radial-gradient(60%_70%_at_50%_50%,black,transparent)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Lost something? Found something?</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                It takes less than a minute to post. The sooner you report, the sooner it's back where it belongs.
              </p>
              <ReportActions className="mx-auto mt-8 max-w-xl" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
