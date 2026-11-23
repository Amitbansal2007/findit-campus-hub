import { ITEMS, filterItems } from "@/data/items";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export const SUGGESTIONS = [
  "I lost my wallet in the library",
  "How do I report a found item?",
  "Has anyone found an ID card?",
  "How does smart matching work?",
];

/** Placeholder replies until the Gemini assistant is connected. */
export function getAssistantReply(input: string): string {
  const text = input.toLowerCase();

  if (/(report).*(found)|found something|picked up/.test(text)) {
    return "Thanks for helping! Tap “Report Found”, add a photo, where you found it and where you've kept it (e.g. Security Desk). I'll notify students whose lost reports look similar.";
  }
  if (/match|ai|how does/.test(text)) {
    return "Smart Matching compares the category, description, colour, location and date of every lost report with every found report. Strong matches are shown to both students so you can connect quickly.";
  }

  const keywords = ["wallet", "id", "card", "key", "bottle", "earphone", "earbud", "airpod", "book", "textbook"];
  const hit = keywords.find((k) => text.includes(k));
  if (hit) {
    const q = hit === "airpod" || hit === "earphone" ? "earbuds" : hit === "id" ? "id card" : hit;
    const found = filterItems(ITEMS, { q, type: "found" });
    if (found.length > 0) {
      const list = found
        .slice(0, 2)
        .map((i) => `• ${i.title} — ${i.location}, ${i.postedLabel.toLowerCase()}`)
        .join("\n");
      return `Good news — I found ${found.length} recently found item${found.length > 1 ? "s" : ""} that might be yours:\n${list}\n\nOpen Browse Items to check the details, or report it as lost so you get notified of new matches.`;
    }
    return "I couldn't find a matching found item yet. Report it as lost and I'll alert you the moment someone posts a match.";
  }

  if (/lost|missing|can't find|cannot find/.test(text)) {
    return "Sorry to hear that! Tell me what the item is (e.g. wallet, ID card, keys) and where you last had it, and I'll check recent found items.";
  }
  if (/hi|hello|hey/.test(text)) {
    return "Hi! I'm the FindIt assistant. I can help you search found items, report something lost or explain how matching works.";
  }
  return "I can help you search for items, report lost or found belongings, or explain smart matching. Try asking “Has anyone found a wallet?”";
}
