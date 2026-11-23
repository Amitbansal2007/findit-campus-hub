import { MessageSquareText, Search, Zap } from "lucide-react";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

const POINTS = [
  { icon: Search, text: "Search found items just by describing what you lost" },
  { icon: MessageSquareText, text: "Get step-by-step help to report lost or found items" },
  { icon: Zap, text: "Available 24/7 — even during late-night hostel panics" },
];

export function AssistantSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="AI Assistant"
            title="Just ask. FindIt Assistant will help."
            description="Chat naturally with our assistant to search items, get reporting help and answers to common questions."
          />
          <ul className="mt-8 space-y-4">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-foreground">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-navy">
                  <p.icon className="h-4 w-4" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-muted-foreground">
            Preview mode — replies use sample data until the Gemini assistant is connected.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <ChatPanel />
        </Reveal>
      </div>
    </section>
  );
}
