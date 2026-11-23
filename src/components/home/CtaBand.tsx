import { Link } from "@tanstack/react-router";
import { PackagePlus, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";

export function CtaBand() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-hero px-6 py-14 text-center shadow-soft sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Lost something? Found something?</h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                It takes less than a minute to post. The sooner you report, the sooner it's back where it belongs.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
