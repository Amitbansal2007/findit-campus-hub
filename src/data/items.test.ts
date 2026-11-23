import { describe, expect, it } from "vitest";
import { ITEMS, chooseItems, filterItems, getPossibleMatches, getItem, mapItemRow } from "./items";

describe("filterItems", () => {
  it("returns only lost items when type is lost", () => {
    const res = filterItems(ITEMS, { type: "lost" });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((i) => i.type === "lost")).toBe(true);
  });

  it("matches a search for 'wallet' across lost and found", () => {
    const res = filterItems(ITEMS, { q: "wallet" });
    expect(res.map((i) => i.id).sort()).toEqual(["found-wallet-bus-stop", "lost-brown-wallet"]);
  });

  it("requires every search word to match", () => {
    expect(filterItems(ITEMS, { q: "wallet library" }).map((i) => i.id)).toEqual(["lost-brown-wallet"]);
  });

  it("combines category and type", () => {
    const res = filterItems(ITEMS, { category: "Keys", type: "found" });
    expect(res.map((i) => i.id)).toEqual(["found-red-tag-keys"]);
  });
});

describe("getPossibleMatches", () => {
  it("suggests found items of the same category for a lost item", () => {
    const lost = getItem("lost-brown-wallet");
    expect(lost).toBeDefined();
    if (!lost) return;
    expect(getPossibleMatches(lost).map((i) => i.id)).toEqual(["found-wallet-bus-stop"]);
  });
});

describe("real reports vs sample items", () => {
  const row = {
    id: "8f1c2a3b-1111-4222-8333-444455556666",
    user_id: "00000000-0000-4000-8000-000000000001",
    item_name: "Grey hoodie",
    category: "Clothing",
    item_type: "found",
    description: "Grey hoodie left on a chair in the library.",
    campus_location: "Central Library",
    item_date: "2026-11-20",
    image_url: null,
    status: "active",
    created_at: "2026-11-23T08:00:00Z",
  };

  it("shows only database reports when at least one exists", () => {
    const real = [mapItemRow(row)];
    const chosen = chooseItems(real);
    expect(chosen.source).toBe("database");
    expect(chosen.items.map((i) => i.id)).toEqual([row.id]);
  });

  it("falls back to sample items only when the database has none", () => {
    const chosen = chooseItems([]);
    expect(chosen.source).toBe("sample");
    expect(chosen.items).toBe(ITEMS);
  });

  it("maps a row into a found item with a readable date", () => {
    const item = mapItemRow(row, new Date("2026-11-23T10:00:00Z"));
    expect(item.type).toBe("found");
    expect(item.category).toBe("Other");
    expect(item.date).toBe("Nov 20, 2026");
    expect(item.postedLabel).toBe("2 hours ago");
  });
});
