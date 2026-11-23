import { describe, expect, it } from "vitest";
import { buildDescription, photoProblem, validateReport, type ReportInput } from "./report";

const base: ReportInput = {
  type: "lost",
  title: "Black wallet",
  category: "Wallets",
  location: "Central Library",
  date: "2026-11-22",
  description: "Black leather wallet with metro card inside.",
};

describe("validateReport", () => {
  it("accepts a complete report", () => {
    expect(validateReport(base, "2026-11-23")).toEqual({});
  });
  it("rejects a date in the future", () => {
    expect(validateReport({ ...base, date: "2026-11-24" }, "2026-11-23")["date"]).toBeDefined();
  });
  it("requires at least 10 characters of description", () => {
    expect(validateReport({ ...base, description: "wallet" }, "2026-11-23")["description"]).toBeDefined();
  });
  it("requires category and location", () => {
    const errors = validateReport({ ...base, category: "", location: "" }, "2026-11-23");
    expect(Object.keys(errors).sort()).toEqual(["category", "location"]);
  });
});

describe("buildDescription", () => {
  it("adds where a found item is now", () => {
    expect(buildDescription({ ...base, type: "found", description: "Blue bottle", handover: "Security desk" })).toBe(
      "Blue bottle\n\nItem is now with: Security desk",
    );
  });
});

describe("photoProblem", () => {
  it("rejects photos over 5 MB", () => {
    expect(photoProblem({ size: 5 * 1024 * 1024 + 1, type: "image/jpeg" })).not.toBeNull();
    expect(photoProblem({ size: 1024, type: "image/png" })).toBeNull();
  });
});
