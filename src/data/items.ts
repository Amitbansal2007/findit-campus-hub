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

export function getItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

/** Items of the opposite type in the same category — a stand-in for AI matching until Gemini is wired in. */
export function getPossibleMatches(item: Item, limit = 3): Item[] {
  return ITEMS.filter((i) => i.type !== item.type && i.category === item.category).slice(0, limit);
}
