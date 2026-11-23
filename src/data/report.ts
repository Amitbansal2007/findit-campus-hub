import type { ItemType } from "./items";

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;

export interface ReportInput {
  type: ItemType;
  title: string;
  category: string;
  location: string;
  date: string; // YYYY-MM-DD
  description: string;
  handover?: string;
}

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Field → message for every problem in a report; empty when it can be submitted. */
export function validateReport(input: ReportInput, today: string = todayISO()): Record<string, string> {
  const errors: Record<string, string> = {};
  const title = input.title.trim();
  if (!title) errors["title"] = "Please name the item";
  else if (title.length < 2) errors["title"] = "Item name is too short";
  else if (title.length > 120) errors["title"] = "Keep the item name under 120 characters";
  if (!input.category) errors["category"] = "Choose a category";
  if (!input.location) errors["location"] = "Choose a location";
  if (!input.date) errors["date"] = "Pick a date";
  else if (input.date > today) errors["date"] = "The date can't be in the future";
  const description = input.description.trim();
  if (description.length < 10) errors["description"] = "Add a few more details (at least 10 characters)";
  else if (description.length > 1800) errors["description"] = "Keep the description under 1800 characters";
  if ((input.handover ?? "").trim().length > 150) errors["handover"] = "Keep this under 150 characters";
  return errors;
}

/** Description saved with the report; for found items it notes where the item is now. */
export function buildDescription(input: ReportInput): string {
  const description = input.description.trim();
  const handover = (input.handover ?? "").trim();
  return input.type === "found" && handover ? `${description}\n\nItem is now with: ${handover}` : description;
}

export function photoProblem(file: { size: number; type: string }): string | null {
  if (!(PHOTO_TYPES as readonly string[]).includes(file.type)) return "Photo must be a PNG, JPG, WebP or GIF image";
  if (file.size > MAX_PHOTO_BYTES) return "Photo must be under 5 MB";
  return null;
}
