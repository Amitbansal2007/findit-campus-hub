import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Search box. Without onSearch it navigates to Browse with the query. */
export function SearchBar({
  defaultValue = "",
  onSearch,
  size = "lg",
  className,
}: {
  defaultValue?: string;
  onSearch?: (q: string) => void;
  size?: "md" | "lg";
  className?: string;
}) {
  const [q, setQ] = useState(defaultValue);
  const navigate = useNavigate();

  // Keep the box in sync when the query changes from outside (e.g. "Clear filters").
  useEffect(() => {
    setQ((current) => (current.trim() === defaultValue.trim() ? current : defaultValue));
  }, [defaultValue]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    if (onSearch) onSearch(value);
    else navigate({ to: "/browse", search: value ? { q: value } : {} });
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      className={cn(
        "flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-elevated transition-shadow focus-within:ring-2 focus-within:ring-ring/30",
        className,
      )}
    >
      <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          if (onSearch) onSearch(e.target.value);
        }}
        placeholder="Search wallets, ID cards, keys, earphones…"
        aria-label="Search lost and found items"
        className={cn(
          "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
          size === "lg" ? "h-11 text-base" : "h-9 text-sm",
        )}
      />
      <Button type="submit" variant="hero" size={size === "lg" ? "xl" : "default"} className="rounded-xl">
        Search
      </Button>
    </form>
  );
}
