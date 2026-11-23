import { Link } from "@tanstack/react-router";
import { CheckCircle2, ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPUS_LOCATIONS, CATEGORIES, type ItemType } from "@/data/items";
import { cn } from "@/lib/utils";

const COPY: Record<ItemType, { location: string; date: string; submit: string; done: string }> = {
  lost: {
    location: "Where did you last have it?",
    date: "When did you lose it?",
    submit: "Submit lost report",
    done: "Your lost item report is ready",
  },
  found: {
    location: "Where did you find it?",
    date: "When did you find it?",
    submit: "Submit found report",
    done: "Thanks for reporting a found item",
  },
};

export function ReportForm({ type }: { type: ItemType }) {
  const copy = COPY[type];
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("title") ?? "").trim()) next["title"] = "Please name the item";
    if (!category) next["category"] = "Choose a category";
    if (!location) next["location"] = "Choose a location";
    if (!String(data.get("date") ?? "")) next["date"] = "Pick a date";
    if (String(data.get("description") ?? "").trim().length < 10)
      next["description"] = "Add a few more details (at least 10 characters)";
    if (!String(data.get("contact") ?? "").trim()) next["contact"] = "Add an email or phone number";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fill in the highlighted fields");
      return;
    }
    setSubmitting(true);
    // Saving to the database arrives with the backend step; for now we simulate a submit.
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success(type === "lost" ? "Lost report submitted" : "Found report submitted");
    }, 900);
  };

  if (submitted) {
    return (
      <div className="animate-fade-up rounded-3xl border border-border bg-card p-8 text-center shadow-elevated sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-found-soft text-found">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-foreground">{copy.done}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          We'll look for matching {type === "lost" ? "found" : "lost"} reports and let you know as soon as
          something turns up.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="xl">
            <Link to="/browse" search={{ type: type === "lost" ? "found" : "lost" }}>
              Browse {type === "lost" ? "found" : "lost"} items
            </Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              setSubmitted(false);
              setPreview(null);
              setCategory("");
              setLocation("");
            }}
          >
            Report another item
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (name: string) =>
    errors[name] ? <p className="text-xs font-medium text-destructive">{errors[name]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Item name</Label>
          <Input
            id="title"
            name="title"
            placeholder={type === "lost" ? "e.g. Black leather wallet" : "e.g. Blue steel water bottle"}
            className="h-11"
            aria-invalid={!!errors["title"]}
          />
          {fieldError("title")}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-11" aria-invalid={!!errors["category"]}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("category")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">{copy.date}</Label>
          <Input id="date" name="date" type="date" className="h-11" aria-invalid={!!errors["date"]} />
          {fieldError("date")}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>{copy.location}</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-11" aria-invalid={!!errors["location"]}>
              <SelectValue placeholder="Select campus location" />
            </SelectTrigger>
            <SelectContent>
              {CAMPUS_LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldError("location")}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Colour, brand, stickers, anything inside… The more detail, the better the match."
            aria-invalid={!!errors["description"]}
          />
          {fieldError("description")}
        </div>

        {type === "found" && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="handover">Where is the item now?</Label>
            <Input id="handover" name="handover" placeholder="e.g. With me / Security desk / Library counter" className="h-11" />
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label>Photo (optional)</Label>
          {preview ? (
            <div className="relative w-fit">
              <img src={preview} alt="Selected item" className="h-40 w-40 rounded-2xl border border-border object-cover" />
              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Remove photo"
                className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-muted/40 px-6 py-10 text-center transition-colors hover:border-navy-soft hover:bg-accent/50",
              )}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-card text-navy shadow-soft">
                <ImagePlus className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-foreground">Click to upload a photo</span>
              <span className="text-xs text-muted-foreground">PNG or JPG, up to 5 MB</span>
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact">Your contact (email or phone)</Label>
          <Input
            id="contact"
            name="contact"
            placeholder="you@college.edu"
            className="h-11"
            aria-invalid={!!errors["contact"]}
          />
          <p className="text-xs text-muted-foreground">Only shared with a verified match.</p>
          {fieldError("contact")}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-sky" /> AI will start looking for matches right after you submit.
        </p>
        <Button type="submit" variant={type} size="xl" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {copy.submit}
        </Button>
      </div>
    </form>
  );
}
