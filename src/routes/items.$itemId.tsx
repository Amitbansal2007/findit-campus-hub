import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Hand, MapPin, MessageCircle, Share2, Sparkles, Tag, User } from "lucide-react";
import { toast } from "sonner";
import { itemDetailQueryOptions } from "@/data/items-queries";
import { ItemCard } from "@/components/items/ItemCard";
import { StatusBadge } from "@/components/items/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/items/$itemId")({
  loader: async ({ params, context }) => {
    const detail = await context.queryClient.ensureQueryData(itemDetailQueryOptions(params.itemId));
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Item unavailable – FindIt" }, { name: "robots", content: "noindex" }] };
    const { item } = loaderData;
    const title = `${item.type === "lost" ? "Lost" : "Found"}: ${item.title} – FindIt`;
    return {
      meta: [
        { title },
        { name: "description", content: item.description },
        { property: "og:title", content: title },
        { property: "og:description", content: item.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground">Item not found</h1>
      <p className="mt-2 text-muted-foreground">This item may have been returned or removed.</p>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/browse">Browse items</Link>
      </Button>
    </div>
  ),
  component: ItemPage,
});

function ItemPage() {
  const { item, matches } = Route.useLoaderData();
  const isLost = item.type === "lost";

  const details = [
    { icon: Tag, label: "Category", value: item.category },
    { icon: MapPin, label: isLost ? "Last seen" : "Found at", value: item.location },
    { icon: Calendar, label: "Date", value: item.date },
    { icon: User, label: "Reported by", value: item.reporter },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all items
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="animate-fade-up overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-elevated">
          <img src={item.image} alt={item.title} className="aspect-square w-full rounded-[1.6rem] object-cover" />
        </div>

        <div className="animate-fade-up [animation-delay:100ms]">
          <div className="flex items-center gap-3">
            <StatusBadge type={item.type} />
            <span className="text-sm text-muted-foreground">Posted {item.postedLabel.toLowerCase()}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{item.title}</h1>
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{item.description}</p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-navy">
                  <d.icon className="h-4 w-4" />
                </span>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.label}</dt>
                  <dd className="text-sm font-semibold text-foreground">{d.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant={isLost ? "found" : "hero"}
              size="xl"
              className="flex-1"
              onClick={() =>
                toast.success(isLost ? "Thanks! The owner will be notified." : "Claim request sent", {
                  description: "Messaging goes live once accounts are connected.",
                })
              }
            >
              {isLost ? <Hand /> : <MessageCircle />}
              {isLost ? "I found this item" : "This is mine — claim it"}
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied — share it with friends");
              }}
            >
              <Share2 /> Share
            </Button>
          </div>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy-soft">
            <Sparkles className="h-4 w-4 text-sky" /> Possible matches
          </div>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            {isLost ? "Found items that look similar" : "Lost reports that look similar"}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matches.map((m) => (
              <ItemCard key={m.id} item={m} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
