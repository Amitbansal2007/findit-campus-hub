import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PackageX } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CATEGORIES, filterItems, type Category, type ItemType } from "@/data/items";
import { itemsQueryOptions } from "@/data/items-queries";
import { ItemCard } from "@/components/items/ItemCard";
import { SearchBar } from "@/components/items/SearchBar";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BrowseSearch {
  q?: string;
  type?: ItemType;
  category?: Category;
}

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => {
    const out: BrowseSearch = {};
    if (typeof search["q"] === "string" && search["q"].trim()) out.q = search["q"];
    if (search["type"] === "lost" || search["type"] === "found") out.type = search["type"];
    const cat = search["category"];
    if (typeof cat === "string" && (CATEGORIES as readonly string[]).includes(cat)) out.category = cat as Category;
    return out;
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(itemsQueryOptions()),
  head: () => ({
    meta: [
      { title: "Browse Lost & Found Items – FindIt" },
      { name: "description", content: "Search and filter every lost and found item reported on campus by category and location." },
      { property: "og:title", content: "Browse Lost & Found Items – FindIt" },
      { property: "og:description", content: "Search ID cards, wallets, keys, books, bottles and earphones reported on campus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

const TYPE_TABS: { value: ItemType | undefined; label: string }[] = [
  { value: undefined, label: "All items" },
  { value: "lost", label: "Lost" },
  { value: "found", label: "Found" },
];

function BrowsePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const { data } = useSuspenseQuery(itemsQueryOptions());
  const results = useMemo(() => filterItems(data.items, search), [data.items, search]);

  const setSearch = (patch: Partial<Record<keyof BrowseSearch, string | undefined>>) =>
    navigate({
      search: (prev) => {
        const next: Record<string, string> = {};
        const merged = { ...prev, ...patch };
        for (const [k, v] of Object.entries(merged)) if (v) next[k] = v;
        return next as BrowseSearch;
      },
      replace: true,
    });

  return (
    <>
      <PageHeader
        eyebrow="Browse items"
        title="Every lost & found item, in one place"
        description="Search by name, colour or place. Filter by category to narrow it down."
      >
        <SearchBar
          defaultValue={search.q ?? ""}
          onSearch={(q) => setSearch({ q: q || undefined })}
          className="max-w-2xl"
        />
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit rounded-full border border-border bg-card p-1 shadow-soft">
            {TYPE_TABS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setSearch({ type: t.value })}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  search.type === t.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:px-0">
            <button
              type="button"
              onClick={() => setSearch({ category: undefined })}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                !search.category
                  ? "border-primary bg-accent text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              All categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSearch({ category: search.category === c ? undefined : c })}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  search.category === c
                    ? "border-primary bg-accent text-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{results.length}</span>{" "}
          {results.length === 1 ? "item" : "items"}
          {search.q && (
            <>
              {" "}for “<span className="text-foreground">{search.q}</span>”
            </>
          )}
        </p>
        {data.source === "sample" && (
          <p className="mt-1 text-xs text-muted-foreground">
            These are example items — real reports will appear here as soon as students post them.
          </p>
        )}

        {results.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((item, i) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-card text-navy shadow-soft">
              <PackageX className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-foreground">No items match your search</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try a different word or clear the filters. You can also report your item so others can help.
            </p>
            <Button variant="outline" className="mt-6 rounded-full" onClick={() => navigate({ search: {}, replace: true })}>
              Clear filters
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
