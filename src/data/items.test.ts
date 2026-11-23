import { describe, expect, it } from "vitest";
import { ITEMS, filterItems, getPossibleMatches, getItem } from "./items";

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
