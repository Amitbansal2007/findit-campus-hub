import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { RecentItems } from "@/components/home/RecentItems";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SmartMatching } from "@/components/home/SmartMatching";
import { AssistantSection } from "@/components/home/AssistantSection";
import { CtaBand } from "@/components/home/CtaBand";
import { itemsQueryOptions } from "@/data/items-queries";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(itemsQueryOptions()),
  head: () => ({
    meta: [
      { title: "FindIt – Campus Lost & Found" },
      {
        name: "description",
        content: "Lost something on campus? Search found items, report lost belongings and get AI-matched with what you're looking for.",
      },
      { property: "og:title", content: "FindIt – Campus Lost & Found" },
      {
        property: "og:description",
        content: "One place for every lost and found item on campus, with AI smart matching and a helpful assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <RecentItems type="lost" />
      <RecentItems type="found" muted />
      <HowItWorks />
      <SmartMatching />
      <AssistantSection />
      <CtaBand />
    </>
  );
}
