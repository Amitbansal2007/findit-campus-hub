
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  LogIn,
  MapPin,
  PackageSearch,
  PackagePlus,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAMPUS_LOCATIONS, CATEGORIES, type ItemType } from "@/data/items";
import { photoProblem, todayISO, validateReport } from "@/data/report";
import { submitReport } from "@/data/submit-report";
import { useAuth } from "@/components/site/AuthProvider";
import { cn } from "@/lib/utils";

const COPY: Record<
  ItemType,
  {
    location: string;
    date: string;
    submit: string;
    done: string;
    heading: string;
    description: string;
  }
> = {
  lost: {
    location: "Where did you last have it?",
    date: "When did you lose it?",
    submit: "Submit lost report",
    done: "Your lost item report is live",
    heading: "Report a lost item",
    description: "Tell your campus community what you have misplaced.",
  },
  found: {
    location: "Where did you find it?",
    date: "When did you find it?",
    submit: "Submit found report",
    done: "Thanks for reporting a found item",
    heading: "Report a found item",
    description: "Help someone reconnect with their missing belongings.",
  },
};

export function ReportForm({ type }: { type: ItemType }) {
  const copy = COPY[type];
  const isLost = type === "lost";
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

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

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
      toast.error("Please log in to submit a report", {
        description: "It only takes a minute to create an account.",
      });
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

      toast.success(
        type === "lost" ? "Lost report submitted" : "Found report submitted",
        {
          description: "It's now visible to everyone on Browse Items.",
        }
      );
    } catch (err) {
      toast.error("Report not submitted", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="mt-1 text-xs font-medium text-destructive">
        {errors[name]}
      </p>
    ) : null;

  const sectionNumber =
    "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#142544] text-sm font-bold text-white";

  if (submittedId) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div
          className={cn(
            "h-2",
            isLost ? "bg-orange-500" : "bg-teal-600"
          )}
        />

        <div className="px-6 py-14 text-center sm:px-12">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-[1.5rem] bg-teal-50 text-teal-700">
            <CheckCircle2 className="h-10 w-10" />
          </span>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Report submitted successfully
          </p>

          <h2 className="mt-3 text-2xl font-black text-[#142544] sm:text-3xl">
            {copy.done}
          </h2>

          <p className="mx-auto mt-4 max-w-md leading-7 text-slate-500">
            Your report is saved and visible on Browse Items. We'll look for
            matching {type === "lost" ? "found" : "lost"} reports.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
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
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_75px_-30px_rgba(15,35,70,0.25)]"
    >
      {/* FORM HEADER */}
      <div className="relative overflow-hidden bg-[#142544] px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <span
            className={cn(
              "grid h-14 w-14 shrink-0 place-items-center rounded-2xl",
              isLost
                ? "bg-orange-400/15 text-orange-300"
                : "bg-teal-400/15 text-teal-300"
            )}
          >
            {isLost ? (
              <PackageSearch className="h-7 w-7" />
            ) : (
              <PackagePlus className="h-7 w-7" />
            )}
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              FindIt Campus Hub
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              {copy.heading}
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
              {copy.description}
            </p>
          </div>
        </div>

        <div className="relative mt-7 flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="h-4 w-4 text-teal-300" />
          Help your campus community reconnect with belongings.
        </div>
      </div>

      <div className="p-6 sm:p-9">
        {/* LOGIN NOTICE */}
        {ready && !user && (
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-[#142544]">
                Log in to submit your report
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Reports are linked to your student account.
              </p>
            </div>

            <Button asChild variant="hero" size="lg" className="shrink-0">
              <Link to="/auth" search={{ mode: "login", redirect: pathname }}>
                <LogIn /> Log in / Register
              </Link>
            </Button>
          </div>
        )}

        {/* SECTION 1 */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className={sectionNumber}>01</span>
          <div>
            <h3 className="font-bold text-[#142544]">Item information</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Tell us what the item looks like.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Item name *</Label>
            <Input
              id="title"
              name="title"
              maxLength={120}
              placeholder={
                isLost
                  ? "e.g. Black leather wallet"
                  : "e.g. Blue steel water bottle"
              }
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
              aria-invalid={!!errors["title"]}
            />
            {fieldError("title")}
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                aria-invalid={!!errors["category"]}
              >
                <SelectValue placeholder="Choose a category" />
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
            <Label htmlFor="date">{copy.date} *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              max={maxDate}
              className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
              aria-invalid={!!errors["date"]}
            />
            {fieldError("date")}
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="mt-10 flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className={sectionNumber}>02</span>
          <div>
            <h3 className="font-bold text-[#142544]">Location & description</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Give useful details to help identify the item.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <div className="space-y-2">
            <Label>{copy.location} *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                aria-invalid={!!errors["location"]}
              >
                <SelectValue placeholder="Choose campus location" />
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

          <div className="space-y-2">
            <Label htmlFor="description">Item description *</Label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              maxLength={1800}
              placeholder="Mention colour, brand, identifying marks, stickers or anything inside. More detail can help identify the correct item."
              className="resize-y rounded-xl border-slate-200 bg-slate-50/50 leading-7 focus:bg-white"
              aria-invalid={!!errors["description"]}
            />
            {fieldError("description")}
          </div>

          {type === "found" && (
            <div className="space-y-2">
              <Label htmlFor="handover">Where is the item now? *</Label>
              <Input
                id="handover"
                name="handover"
                maxLength={150}
                placeholder="e.g. With me / Security desk / Library counter"
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                aria-invalid={!!errors["handover"]}
              />
              {fieldError("handover")}
            </div>
          )}
        </div>

        {/* SECTION 3 */}
        <div className="mt-10 flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className={sectionNumber}>03</span>
          <div>
            <h3 className="font-bold text-[#142544]">Add an item photo</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              A photo is optional but can make identification easier.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {preview ? (
            <div className="relative w-fit overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <img
                src={preview}
                alt="Selected item"
                className="h-52 w-52 rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={clearPhoto}
                aria-label="Remove photo"
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#142544] text-white shadow-lg transition-colors hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 px-5 py-10 text-center transition-all duration-300",
                "hover:border-teal-500 hover:bg-teal-50/50"
              )}
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-teal-700 shadow-sm transition-transform group-hover:-translate-y-1">
                <UploadCloud className="h-8 w-8" />
              </span>

              <span className="mt-5 text-sm font-bold text-[#142544]">
                Click to upload an item photo
              </span>

              <span className="mt-2 text-xs text-slate-500">
                PNG, JPG or WebP · Up to 5 MB
              </span>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#142544] px-4 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-teal-700">
                <ImagePlus className="h-4 w-4" />
                Choose photo
              </span>

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

        {/* ACCOUNT INFORMATION */}
        {user && (
          <div className="mt-7 rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-500">
            Posting as{" "}
            <span className="font-semibold text-[#142544]">
              {user.email}
            </span>
            . Your report will be linked to your account.
          </div>
        )}

        {/* SUBMIT */}
        <div className="mt-9 border-t border-slate-100 pt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
              Your report will appear in Browse Items after successful submission.
            </p>

            <Button
              type="submit"
              variant={type}
              size="xl"
              disabled={submitting}
              className="min-w-[210px] justify-center rounded-xl"
            >
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Submitting..." : copy.submit}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
