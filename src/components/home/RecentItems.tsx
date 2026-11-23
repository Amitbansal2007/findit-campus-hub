import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ITEMS, type ItemType } from "@/data/items";
import { ItemCard } from "@/components/items/ItemCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";

const COPY: Record<ItemType, { eyebrow: string; title: string; description: string }> = {
  lost: {
    eyebrow: "Recently lost",
    title: "Help a fellow student",
    description: "Seen any of these around campus? A quick message could make someone's day.",
  },
  found: {
    eyebrow: "Recently found",
    title: "Is one of these yours?",
    description: "Items picked up by students and staff, waiting to be claimed by their owners.",
  },
};

export function RecentItems({ type, muted = false }: { type: ItemType; muted?: boolean }) {
  const items = ITEMS.filter((i) => i.type === type).slice(0, 4);
  const copy = COPY[type];
  return (
    <section className={muted ? "bg-muted/50 py-20 lg:py-24" : "py-20 lg:py-24"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            action={
              <Button asChild variant="outline" className="self-start rounded-full md:self-auto">
                <Link to="/browse" search={{ type }}>
                  View all {type} items <ArrowRight />
                </Link>
              </Button>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 80}>
              <ItemCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
