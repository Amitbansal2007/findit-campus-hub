import { createServerFn } from "@tanstack/react-start";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  chooseItems,
  getItem,
  getPossibleMatches,
  mapItemRow,
  filterItems,
  type Item,
  type ItemRow,
  type ItemSource,
  type ItemType,
} from "./items";

const ITEM_COLUMNS =
  "id, user_id, item_name, category, item_type, description, campus_location, item_date, image_url, status, created_at";

/** Read-only client using the public key; row access is decided by the database rules. Call inside handlers only. */
function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Item listings are temporarily unavailable.");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

async function fetchActiveItems(): Promise<Item[]> {
  const { data, error } = await publicClient()
    .from("items")
    .select(ITEM_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[items] list failed", error.message);
    throw new Error("We couldn't load items right now. Please try again.");
  }
  const now = new Date();
  return (data as ItemRow[]).map((row) => mapItemRow(row, now));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const listItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: Item[]; source: ItemSource }> => chooseItems(await fetchActiveItems()),
);

/** Search real active Supabase reports for FindIt Assistant. */
export const searchItems = createServerFn({ method: "GET" })
  .inputValidator((input: { query: string }) => ({
    query: String(input?.query ?? "").trim().slice(0, 200),
  }))
  .handler(async ({ data }): Promise<Item[]> => {
    const text = data.query.toLowerCase();

    // "Show all lost items" means search lost reports.
    // "I lost my wallet" means search found reports.
    const asksForAllLost =
      /\b(show|list|display|browse|all)\b/.test(text) &&
      /\blost\b/.test(text);

    let type: ItemType | undefined;

    if (asksForAllLost) {
      type = "lost";
    } else if (/\b(lost|missing|misplaced)\b/.test(text)) {
      type = "found";
    } else if (/\b(found|picked up)\b/.test(text)) {
      type = "found";
    }

    const stopWords = new Set([
      "i", "my", "me", "a", "an", "the", "in", "at", "on",
      "to", "for", "of", "is", "are", "was", "were", "and",
      "show", "all", "list", "display", "browse", "find",
      "search", "please", "has", "have", "anyone", "someone",
      "been", "it", "item", "items", "lost", "missing",
      "misplaced", "found", "picked", "up", "do", "you",
      "how", "what", "where", "can", "could", "there",
    ]);

    const terms = text
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word && !stopWords.has(word))
      .map((word) => {
        const plurals: Record<string, string> = {
          wallets: "wallet",
          keys: "key",
          bottles: "bottle",
          books: "book",
          cards: "card",
          earbuds: "earbud",
          earphones: "earphone",
        };
        return plurals[word] ?? word;
      });

    // Avoid returning every database record for a greeting or vague query.
    if (terms.length === 0 && !type) return [];

    const activeItems = await fetchActiveItems();

const synonyms: Record<string, string[]> = {
  phone: ["phone", "mobile", "smartphone", "handset", "cellphone"],
  mobile: ["phone", "mobile", "smartphone", "handset", "cellphone"],
  smartphone: ["phone", "mobile", "smartphone", "handset", "cellphone"],
  handset: ["phone", "mobile", "smartphone", "handset", "cellphone"],
  cellphone: ["phone", "mobile", "smartphone", "handset", "cellphone"],
};

return activeItems.filter((item) => {
  if (type && item.type !== type) return false;

  const haystack = [
    item.title,
    item.category,
    item.description,
    item.location,
  ].join(" ").toLowerCase();

  return terms.every((term) => {
    const alternatives = synonyms[term] ?? [term];
    return alternatives.some((word) => haystack.includes(word));
  });
});
  });

export const getItemDetail = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => {
    const id = String(input?.id ?? "").slice(0, 100);
    return { id };
  })
  .handler(async ({ data }): Promise<{ item: Item; matches: Item[] } | null> => {
    if (!UUID_RE.test(data.id)) {
      const sample = getItem(data.id);
      return sample ? { item: sample, matches: getPossibleMatches(sample) } : null;
    }
    const { data: row, error } = await publicClient()
      .from("items")
      .select(ITEM_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("[items] detail failed", error.message);
      throw new Error("We couldn't load this item right now. Please try again.");
    }
    if (!row) return null;
    const item = mapItemRow(row as ItemRow);
    const pool = await fetchActiveItems();
    return { item, matches: getPossibleMatches(item, pool) };
  });


export const askFindItAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) => ({
    query: String(input?.query ?? "").trim().slice(0, 500),
  }))
  .handler(async ({ data }) => {
    if (!data.query) return "Please enter your question.";

    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      throw new Error("Groq API key is missing. Check your .env file.");
    }

    const activeItems = await fetchActiveItems();

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `You are FindIt Assistant, the lost-and-found assistant for a college campus.

Help users report, search for, and understand lost and found items.

IMPORTANT RULES:
- Use only the item records supplied below for claims about reported items.
- Never invent an item, location, date, or report.
- Understand natural language, spelling mistakes, colours, item names, and locations.
- If matching reports exist, use a numbered list with each item on a separate line. Include its name, lost/found status, location, and date. Use plain text only. Do not use Markdown, asterisks, tables, or special formatting symbols.
- If no matching report exists, clearly say that no matching active report was found.
- If the user asks for all lost or all found items, list the relevant records.
- Be concise, friendly, and helpful.
- For unrelated questions, politely explain your campus lost-and-found purpose.
- After mentioning a matching item, include its exact database ID in this format: [[ITEM:item_id]]. Never change or invent an ID.
- If the user says they lost or misplaced an item, search for matching FOUND reports only.
- If the user says they found an item and want its owner, search for matching LOST reports only. Never mix opposite-status results unless the user explicitly asks for both.
- When the user says they lost an item and a matching FOUND report exists, say: "Yes! Someone has reported finding a [item name]." Do not say "I found a matching report for a found [item name]."
- When the user says they found an item and a matching LOST report exists, say: "Yes! Someone has reported losing a [item name]."

ACTIVE ITEM RECORDS:
${JSON.stringify(
  activeItems.slice(0, 100).map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    category: item.category,
    description: item.description,
    location: item.location,
    date: item.date,
    image: item.image,
  }))
)}`,
        },
        {
          role: "user",
          content: data.query,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content;

    return typeof reply === "string"
      ? reply
      : "Sorry, I couldn't generate a response. Please try again.";
  });

