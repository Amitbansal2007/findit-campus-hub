
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Hand,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { itemDetailQueryOptions } from "@/data/items-queries";
import { ItemCard } from "@/components/items/ItemCard";
import { StatusBadge } from "@/components/items/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/items/$itemId")({
  loader: async ({ params, context }) => {
    const detail = await context.queryClient.ensureQueryData(
      itemDetailQueryOptions(params.itemId)
    );
    if (!detail) throw notFound();
    return detail;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "Item unavailable – FindIt" },
          { name: "robots", content: "noindex" },
        ],
      };

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
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500">
        <Package className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-[#142544]">
        Item not found
      </h1>
      <p className="mt-2 text-slate-500">
        This item may have been returned or removed.
      </p>
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
    {
      icon: MapPin,
      label: isLost ? "Last seen at" : "Found at",
      value: item.location,
    },
    { icon: CalendarDays, label: "Date", value: item.date },
    { icon: User, label: "Reported by", value: item.reporter },
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fc]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-teal-100/40 blur-[100px]" />
        <div className="absolute -left-40 top-[500px] h-96 w-96 rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* BACK NAVIGATION */}
        <Link
          to="/browse"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-x-1 hover:border-teal-200 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all items
        </Link>

        {/* MAIN CONTENT */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">

          {/* IMAGE PANEL */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-white bg-white shadow-[0_25px_70px_-25px_rgba(15,35,70,0.3)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />

                <div className="absolute left-5 top-5">
                  <StatusBadge
                    type={item.type}
                    className="rounded-full border border-white/70 bg-white/95 px-4 py-2 font-bold shadow-lg backdrop-blur"
                  />
                </div>

                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-teal-300" />
                  {item.location}
                </div>
              </div>
            </div>

            {/* IMAGE FOOTER */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-[#142544]">
                    Campus community report
                  </p>
                  <p className="text-xs text-slate-500">
                    Shared through FindIt Campus Hub
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {item.postedLabel}
              </span>
            </div>
          </div>

          {/* DETAILS PANEL */}
          <div className="lg:col-span-5">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,35,70,0.25)] sm:p-8">

              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                  <Sparkles className="h-4 w-4" />
                  Item information
                </span>
                <StatusBadge type={item.type} />
              </div>

              <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight text-[#142544] sm:text-4xl">
                {item.title}
              </h1>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {item.description}
              </p>

              {/* INFORMATION GRID */}
              <div className="mt-8">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Report details
                </h2>

                <dl className="grid gap-3 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="min-w-0 rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/40"
                    >
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <detail.icon className="h-4 w-4 text-teal-700" />
                        {detail.label}
                      </div>
                      <dd className="mt-2 break-words text-sm font-bold text-[#142544]">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 border-t border-slate-100 pt-7">
                <p className="mb-4 text-sm font-bold text-[#142544]">
                  {isLost
                    ? "Can you help return this item?"
                    : "Do you recognise this item?"}
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    variant={isLost ? "found" : "hero"}
                    size="xl"
                    className="w-full justify-center"
                    onClick={() =>
                      toast.success(
                        isLost
                          ? "Thanks! The owner will be notified."
                          : "Claim request sent",
                        {
                          description:
                            "Messaging goes live once accounts are connected.",
                        }
                      )
                    }
                  >
                    {isLost ? <Hand /> : <MessageCircle />}
                    {isLost
                      ? "I found this item"
                      : "This is mine — claim it"}
                  </Button>

                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full justify-center border-slate-200"
                    onClick={() => {
                      void navigator.clipboard?.writeText(window.location.href);
                      toast.success("Link copied — share it with friends");
                    }}
                  >
                    <Share2 />
                    Share this item
                  </Button>
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Help your campus community reconnect with its belongings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* POSSIBLE MATCHES */}
        {matches.length > 0 && (
          <section className="mt-20 border-t border-slate-200 pt-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                  <Sparkles className="h-4 w-4" />
                  Discover similar reports
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-[#142544] sm:text-3xl">
                  {isLost
                    ? "Found items that look similar"
                    : "Lost reports that look similar"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Other reports available on your campus.
                </p>
              </div>

              <Link
                to="/browse"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 transition-colors hover:text-teal-900"
              >
                Browse all items
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {matches.map((match) => (
                <ItemCard key={match.id} item={match} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
