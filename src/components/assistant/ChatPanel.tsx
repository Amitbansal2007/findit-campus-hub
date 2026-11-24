import { Bot, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { SUGGESTIONS, type ChatMessage } from "./replies";
import { askFindItAssistant } from "@/data/items.functions";

let counter = 0;
const nextId = () => `m${++counter}`;

export function ChatPanel({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm FindIt Assistant 👋 Tell me what you lost or found and I'll help you track it down.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  


const send = async (text: string) => {
  const value = text.trim();
  if (!value || typing) return;

  setMessages((m) => [
    ...m,
    { id: nextId(), role: "user", text: value },
  ]);

  setInput("");

  // Handle greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)[!.?\s]*$/i.test(value)) {
    setMessages((m) => [
      ...m,
      {
        id: nextId(),
        role: "assistant",
        text: "Hello! 👋 Welcome to FindIt Assistant. Are you looking for a lost item or trying to find the owner of something you found?",
      },
    ]);
    return;
  }

  setTyping(true);

  try {
    const reply = await askFindItAssistant({
      data: { query: value },
    });

    setMessages((m) => [
      ...m,
      {
        id: nextId(),
        role: "assistant",
        text: reply,
      },
    ]);
  } catch (error) {
    console.error("FindIt Assistant error:", error);

    setMessages((m) => [
      ...m,
      {
        id: nextId(),
        role: "assistant",
        text: "Sorry, something went wrong. Please try again.",
      },
    ]);
  } finally {
    setTyping(false);
  }
};




  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-elevated", className)}>
      <div className="flex items-center gap-3 bg-gradient-navy px-5 py-4 text-navy-foreground">
        <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-navy-foreground/15">
          <Bot className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-navy bg-found animate-pulse-ring" />
        </span>
        <div className="flex-1">
          <p className="font-display text-sm font-semibold">FindIt Assistant</p>
          <p className="text-xs text-navy-muted">AI helper · usually replies instantly</p>
        </div>
        <span className="hidden items-center gap-1 rounded-full bg-navy-foreground/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline-flex">
          <Sparkles className="h-3 w-3 text-sky" /> Beta
        </span>
      </div>

      <div
        ref={scrollRef}
        className={cn("space-y-3 overflow-y-auto bg-muted/40 px-4 py-5", compact ? "h-80" : "h-96")}
        aria-live="polite"
      >
        {messages.map((m) => (
          <div key={m.id} className={cn("flex animate-fade-up", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card text-foreground shadow-soft",
              )}
            >
              {m.text.split(/(\[\[ITEM:[^\]]+\]\])/g).map((part, index) => {
  const match = part.match(/^\[\[ITEM:([0-9a-f-]{36})\]\]$/i);

  return match ? (
    <a
      key={index}
      href={`/items/${match[1]}`}
      className="text-primary underline font-semibold"
    >
      View item
    </a>
  ) : (
    <span key={index}>{part}</span>
  );
})}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-soft">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-border px-4 pt-3 [scrollbar-width:none]">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-navy-soft hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a lost or found item…"
          aria-label="Message FindIt Assistant"
          className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/25"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-navy text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
