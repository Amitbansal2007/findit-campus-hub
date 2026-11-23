import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { CheckCircle2, ImagePlus, Loader2, LogIn, Sparkles, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPUS_LOCATIONS, CATEGORIES, type ItemType } from "@/data/items";
import { photoProblem, todayISO, validateReport } from "@/data/report";
import { submitReport } from "@/data/submit-report";
import { useAuth } from "@/components/site/AuthProvider";
import { cn } from "@/lib/utils";

const COPY: Record<ItemType, { location: string; date: string; submit: string; done: string }> = {
  lost: {
    location: "Where did you last have it?",
    date: "When did you lose it?",
    submit: "Submit lost report",
    done: "Your lost item report is live",
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
  const { user, ready } = useAuth();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [maxDate, setMaxDate] = useState<string | undefined>(undefined);

  useEffect(() => setMaxDate(todayISO()), []);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const problem = photoProblem(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a report", { description: "It only takes a minute to create an account." });
      return;
    }
    const data = new FormData(e.currentTarget);
    const input = {
      type,
      title: String(data.get("title") ?? ""),
      category,
      location,
      date: String(data.get("date") ?? ""),
      description: String(data.get("description") ?? ""),
      handover: String(data.get("handover") ?? ""),
    };
    const next = validateReport(input);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const id = await submitReport(input, photo);
      await queryClient.invalidateQueries({ queryKey: ["items"] });
      setSubmittedId(id);
      toast.success(type === "lost" ? "Lost report submitted" : "Found report submitted", {
        description: "It's now visible to everyone on Browse Items.",
      });
    } catch (err) {
      toast.error("Report not submitted", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="animate-fade-up rounded-3xl border border-border bg-card p-8 text-center shadow-elevated sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-found-soft text-found">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-2xl font-bold text-foreground">{copy.done}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Your report is saved and visible on Browse Items. We'll look for matching{" "}
          {type === "lost" ? "found" : "lost"} reports.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="xl">
            <Link to="/items/$itemId" params={{ itemId: submittedId }}>
              View your report
            </Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              setSubmittedId(null);
              clearPhoto();
              setCategory("");
              setLocation("");
              setErrors({});
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
      {ready && !user && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-accent/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Log in to submit.</span>{" "}
            <span className="text-muted-foreground">Reports are linked to your student account.</span>
          </p>
          <Button asChild variant="hero" size="sm" className="shrink-0">
            <Link to="/auth" search={{ mode: "login", redirect: pathname }}>
              <LogIn /> Log in / Register
            </Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Item name</Label>
          <Input
            id="title"
            name="title"
            maxLength={120}
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
          <Input id="date" name="date" type="date" max={maxDate} className="h-11" aria-invalid={!!errors["date"]} />
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
            maxLength={1800}
            placeholder="Colour, brand, stickers, anything inside… The more detail, the better the match."
            aria-invalid={!!errors["description"]}
          />
          {fieldError("description")}
        </div>

        {type === "found" && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="handover">Where is the item now?</Label>
            <Input
              id="handover"
              name="handover"
              maxLength={150}
              placeholder="e.g. With me / Security desk / Library counter"
              className="h-11"
              aria-invalid={!!errors["handover"]}
            />
            {fieldError("handover")}
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label>Photo (optional)</Label>
          {preview ? (
            <div className="relative w-fit">
              <img src={preview} alt="Selected item" className="h-40 w-40 rounded-2xl border border-border object-cover" />
              <button
                type="button"
                onClick={clearPhoto}
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
              <span className="text-xs text-muted-foreground">PNG, JPG or WebP, up to 5 MB</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>

        {user && (
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Posting as <span className="font-medium text-foreground">{user.email}</span>. Your contact details are only
            shared with a verified match.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 text-sky" /> AI will start looking for matches right after you submit.
        </p>
        <Button type="submit" variant={type} size="xl" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Submitting…" : copy.submit}
        </Button>
      </div>
    </form>
  );
}
