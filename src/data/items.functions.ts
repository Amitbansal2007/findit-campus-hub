import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { chooseItems, getItem, getPossibleMatches, mapItemRow, type Item, type ItemRow, type ItemSource } from "./items";

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
