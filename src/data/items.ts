import idCard from "@/assets/item-id-card.jpg";
import wallet from "@/assets/item-wallet.jpg";
import book from "@/assets/item-book.jpg";
import keys from "@/assets/item-keys.jpg";
import bottle from "@/assets/item-bottle.jpg";
import earphones from "@/assets/item-earphones.jpg";

export type ItemType = "lost" | "found";

export const CATEGORIES = [
  "ID Cards",
  "Wallets",
  "Electronics",
  "Books",
  "Keys",
  "Bottles",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CAMPUS_LOCATIONS = [
  "Central Library",
  "Main Cafeteria",
  "Academic Block A",
  "Academic Block C",
  "Sports Complex",
  "Admin Building",
  "Boys Hostel",
  "Girls Hostel",
  "Campus Bus Stop",
  "Computer Lab",
] as const;

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: Category;
  description: string;
  location: string;
  date: string; // display date
  postedLabel: string; // relative label, static until the backend supplies timestamps
  image: string;
  reporter: string;
  color?: string;
}

export const ITEMS: Item[] = [
  {
    id: "lost-id-card-aarav",
    type: "lost",
    title: "Student ID Card with navy lanyard",
    category: "ID Cards",
    description:
      "College ID card on a navy blue college lanyard. Name on card: Aarav Sharma, B.Tech CSE 2nd year. Needed urgently for exams.",
    location: "Central Library",
    date: "Nov 22, 2026",
    postedLabel: "2 hours ago",
    image: idCard,
    reporter: "Aarav S.",
    color: "Navy",
  },
  {
    id: "lost-brown-wallet",
    type: "lost",
    title: "Brown leather bifold wallet",
    category: "Wallets",
    description:
      "Brown leather wallet with stitched edges. Contains Aadhaar card, debit card and a metro card. Reward offered.",
    location: "Central Library",
    date: "Nov 22, 2026",
    postedLabel: "5 hours ago",
    image: wallet,
    reporter: "Riya M.",
    color: "Brown",
  },
  {
    id: "lost-white-earbuds",
    type: "lost",
    title: "White wireless earbuds in case",
    category: "Electronics",
    description:
      "White wireless earbuds in a charging case, small scratch on the lid. Left on a table near the window.",
    location: "Main Cafeteria",
    date: "Nov 21, 2026",
    postedLabel: "Yesterday",
    image: earphones,
    reporter: "Kabir J.",
    color: "White",
  },
  {
    id: "lost-engineering-maths",
    type: "lost",
    title: "Engineering Mathematics textbook",
    category: "Books",
    description:
      "Blue hardcover Engineering Mathematics (7th edition). My name and roll number are written inside the front cover.",
    location: "Academic Block C",
    date: "Nov 20, 2026",
    postedLabel: "2 days ago",
    image: book,
    reporter: "Sneha P.",
    color: "Blue",
  },
  {
    id: "lost-navy-bottle",
    type: "lost",
    title: "Navy steel water bottle",
    category: "Bottles",
    description: "Matte navy stainless steel bottle with a steel loop cap. Has a small dent at the bottom.",
    location: "Sports Complex",
    date: "Nov 19, 2026",
    postedLabel: "3 days ago",
    image: bottle,
    reporter: "Dev K.",
    color: "Navy",
  },
  {
    id: "lost-hostel-keys",
    type: "lost",
    title: "Hostel room keys with red tag",
    category: "Keys",
    description: "Three keys on a steel ring with a red clock-tower keychain. Room 214 key is on it.",
    location: "Boys Hostel",
    date: "Nov 18, 2026",
    postedLabel: "4 days ago",
    image: keys,
    reporter: "Rohan T.",
    color: "Red",
  },
  {
    id: "found-red-tag-keys",
    type: "found",
    title: "Set of keys with red keychain",
    category: "Keys",
    description:
      "Found three keys on a ring with a red keychain on the front steps. Handed over to the security desk.",
    location: "Admin Building",
    date: "Nov 22, 2026",
    postedLabel: "1 hour ago",
    image: keys,
    reporter: "Security Desk",
    color: "Red",
  },
  {
    id: "found-steel-bottle",
    type: "found",
    title: "Navy blue steel bottle",
    category: "Bottles",
    description: "Found on the lawn next to the football ground after evening practice.",
    location: "Sports Complex",
    date: "Nov 22, 2026",
    postedLabel: "3 hours ago",
    image: bottle,
    reporter: "Ananya R.",
    color: "Navy",
  },
  {
    id: "found-id-card-bench",
    type: "found",
    title: "College ID card on lanyard",
    category: "ID Cards",
    description: "Found on a bench outside the admin building. Kept with me — message to claim with your roll number.",
    location: "Admin Building",
    date: "Nov 21, 2026",
    postedLabel: "Yesterday",
    image: idCard,
    reporter: "Ishaan V.",
    color: "Navy",
  },
  {
    id: "found-earbuds-canteen",
    type: "found",
    title: "Wireless earbuds case",
    category: "Electronics",
    description: "White earbuds case found under a table in the canteen. Describe the case to claim.",
    location: "Main Cafeteria",
    date: "Nov 21, 2026",
    postedLabel: "Yesterday",
    image: earphones,
    reporter: "Canteen Staff",
    color: "White",
  },
  {
    id: "found-wallet-bus-stop",
    type: "found",
    title: "Brown leather wallet",
    category: "Wallets",
    description: "Found near the campus bus stop shelter. Handed to the transport office.",
    location: "Campus Bus Stop",
    date: "Nov 20, 2026",
    postedLabel: "2 days ago",
    image: wallet,
    reporter: "Transport Office",
    color: "Brown",
  },
  {
    id: "found-maths-book-lab",
    type: "found",
    title: "Blue mathematics textbook",
    category: "Books",
    description: "Hardcover maths textbook left behind in the computer lab after the afternoon session.",
    location: "Computer Lab",
    date: "Nov 19, 2026",
    postedLabel: "3 days ago",
    image: book,
    reporter: "Lab Assistant",
    color: "Blue",
  },
];

export interface ItemFilters {
  q?: string;
  type?: ItemType;
  category?: Category;
}

/** Filters items by free-text query (title, description, location, category), type and category. */
export function filterItems(items: Item[], filters: ItemFilters): Item[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  const terms = q.split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.category && item.category !== filters.category) return false;
    if (terms.length === 0) return true;
    const haystack =
      `${item.title} ${item.description} ${item.location} ${item.category} ${item.color ?? ""}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

/** Smarter search specifically for FindIt Assistant. */
export function searchAssistantItems(
  items: Item[],
  filters: ItemFilters
): Item[] {
  const q = filters.q?.trim().toLowerCase() ?? "";

  if (filters.type && !q) {
    return items.filter((item) => item.type === filters.type);
  }

  if (!q) return items;

  const normalized = q.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

  // Recognize campus locations.
  const matchedLocation =
    CAMPUS_LOCATIONS.find((loc) =>
      normalized.includes(loc.toLowerCase())
    ) ??
    (/\blibrary\b/.test(normalized) ? "Central Library" : undefined);

  const locationWords = matchedLocation
    ? matchedLocation.toLowerCase().split(/\s+/)
    : [];

  // Remove location words before searching for the item.
  const itemTerms = normalized
    .split(/\s+/)
    .filter((word) => word && !locationWords.includes(word));

  const categoryKeywords: Record<Category, string[]> = {
    "ID Cards": ["id", "card", "identity"],
    Wallets: ["wallet", "purse"],
    Electronics: ["earbud", "earphone", "airpod", "headphone"],
    Books: ["book", "textbook", "math"],
    Keys: ["key", "keys"],
    Bottles: ["bottle", "water"],
    Other: ["other"],
  };

  const results = items.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.category && item.category !== filters.category) return false;

    const locationMatch = matchedLocation
      ? item.location.toLowerCase().includes(matchedLocation.toLowerCase())
      : false;

    // If the query only contains a location, filter by location.
    if (itemTerms.length === 0) return locationMatch;

    const searchableText =
      `${item.title} ${item.description} ${item.category} ${item.color ?? ""}`
        .toLowerCase();

    const itemMatch = itemTerms.some((term) => {
      if (searchableText.includes(term)) return true;

      return categoryKeywords[item.category].some(
        (keyword) => keyword.includes(term) || term.includes(keyword)
      );
    });

    return itemMatch;
  });

  // Prefer location matches, but don't hide other possible item matches.
  if (matchedLocation && itemTerms.length > 0) {
    results.sort((a, b) => {
      const aMatch = a.location.toLowerCase().includes(
        matchedLocation.toLowerCase()
      );
      const bMatch = b.location.toLowerCase().includes(
        matchedLocation.toLowerCase()
      );

      return Number(bMatch) - Number(aMatch);
    });
  }

  return results;
}


export function getItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

/** Items of the opposite type in the same category — a stand-in for AI matching until Gemini is wired in. */
export function getPossibleMatches(item: Item, pool: Item[] = ITEMS, limit = 3): Item[] {
  return pool.filter((i) => i.type !== item.type && i.category === item.category).slice(0, limit);
}

/* ---------- Database rows ---------- */

export type ItemStatus = "active" | "claimed" | "returned";

/** Shape of a row in the `items` table. */
export interface ItemRow {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  item_type: string;
  description: string;
  campus_location: string;
  item_date: string;
  image_url: string | null;
  status: string;
  created_at: string;
}

/** Photo shown for a report posted without one. */
export const CATEGORY_IMAGES: Record<Category, string> = {
  "ID Cards": idCard,
  Wallets: wallet,
  Electronics: earphones,
  Books: book,
  Keys: keys,
  Bottles: bottle,
  Other: wallet,
};

export function toCategory(value: string): Category {
  return (CATEGORIES as readonly string[]).includes(value) ? (value as Category) : "Other";
}

/** "2026-11-22" → "Nov 22, 2026" (UTC, so server and browser agree). */
export function formatItemDate(isoDate: string): string {
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Relative "posted" label from a timestamp. */
export function formatPostedLabel(createdAt: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (Number.isNaN(mins) || mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return formatItemDate(createdAt);
}

export function mapItemRow(row: ItemRow, now: Date = new Date()): Item {
  const category = toCategory(row.category);
  return {
    id: row.id,
    type: row.item_type === "found" ? "found" : "lost",
    title: row.item_name,
    category,
    description: row.description,
    location: row.campus_location,
    date: formatItemDate(row.item_date),
    postedLabel: formatPostedLabel(row.created_at, now),
    image: row.image_url || CATEGORY_IMAGES[category],
    reporter: "FindIt student",
  };
}

export type ItemSource = "database" | "sample";

/** Real reports win: sample items are shown only while the database has no active reports. */
export function chooseItems(dbItems: Item[]): { items: Item[]; source: ItemSource } {
  return dbItems.length > 0 ? { items: dbItems, source: "database" } : { items: ITEMS, source: "sample" };
}
