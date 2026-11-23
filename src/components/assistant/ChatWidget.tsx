import { useLocation } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./ChatPanel";

/** Floating assistant launcher available on every page except sign-in. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname.startsWith("/auth")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <ChatPanel compact className="w-[calc(100vw-2.5rem)] max-w-sm animate-fade-up" />
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open FindIt Assistant"}
        className={cn(
          "grid h-14 w-14 place-items-center rounded-full bg-gradient-navy text-primary-foreground shadow-glow transition-transform hover:scale-105",
          !open && "animate-pulse-ring",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
