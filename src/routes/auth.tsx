import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, MailCheck, ScanSearch, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/site/AuthProvider";

type Mode = "login" | "register";
interface AuthSearch {
  mode?: Mode;
  redirect?: string;
}

/** Turns sign-in errors into plain messages. */
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Wrong email or password. Please try again.";
  if (m.includes("not confirmed")) return "Please confirm your email first — check your inbox for the link.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Try logging in.";
  if (m.includes("password")) return message;
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("disabled") || m.includes("not enabled")) return "Email sign-in isn't switched on yet for FindIt.";
  return "Something went wrong. Please try again.";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const out: AuthSearch = {};
    if (search["mode"] === "register" || search["mode"] === "login") out.mode = search["mode"];
    const redirect = search["redirect"];
    // Only same-site paths, never another website.
    if (typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/auth"))
      out.redirect = redirect.slice(0, 200);
    return out;
  },
  head: () => ({
    meta: [
      { title: "Log in or Register – FindIt" },
      { name: "description", content: "Sign in to FindIt with your college account to report and claim lost and found items." },
      { property: "og:title", content: "Log in or Register – FindIt" },
      { property: "og:description", content: "Join your campus lost & found community on FindIt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const PERKS = [
  { icon: Sparkles, text: "Instant AI match alerts for your lost items" },
  { icon: ShieldCheck, text: "Private contact — shared only with verified matches" },
  { icon: Users, text: "Join 3,000+ students helping each other" },
];

function AuthPage() {
  const { mode = "login", redirect } = Route.useSearch();
  const navigate = useNavigate({ from: "/auth" });
  const router = useRouter();
  const { user, ready } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const isLogin = mode === "login";

  const goNext = () => router.history.push(redirect ?? "/");

  // Already signed in: continue where they were heading.
  useEffect(() => {
    if (ready && user) goNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        goNext();
      } else {
        const fullName = String(data.get("name") ?? "").trim().slice(0, 80);
        const roll = String(data.get("roll") ?? "").trim().slice(0, 30);
        const { data: res, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirect ?? "/"}`,
            data: { full_name: fullName, roll_number: roll },
          },
        });
        if (error) throw error;
        if (res.session) {
          toast.success("Account created — you're logged in");
          goNext();
        } else if (res.user && (res.user.identities?.length ?? 0) === 0) {
          toast.error("An account with this email already exists. Try logging in.");
        } else {
          setPendingEmail(email);
          toast.success("Almost there — check your email to confirm your account");
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(friendlyAuthError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-navy p-10 text-navy-foreground shadow-elevated lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_70%_at_30%_30%,black,transparent)]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />
        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-foreground text-navy">
            <ScanSearch className="h-6 w-6" />
          </span>
          <h2 className="mt-8 text-4xl font-bold leading-tight">
            Your campus.
            <br />
            Your stuff. <span className="text-sky">Back.</span>
          </h2>
          <p className="mt-4 max-w-sm text-navy-muted">
            Create a free account with your college email to report items, claim matches and chat with finders.
          </p>
        </div>
        <ul className="relative mt-auto space-y-4 pt-12">
          {PERKS.map((p) => (
            <li key={p.text} className="flex items-center gap-3 text-sm">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-foreground/10 text-sky">
                <p.icon className="h-4 w-4" />
              </span>
              {p.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="text-3xl font-bold text-foreground">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? "Log in to manage your reports and matches." : "It takes less than a minute to join FindIt."}
          </p>

          <div className="mt-8 grid grid-cols-2 rounded-xl border border-border bg-muted p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setPendingEmail(null);
                  void navigate({ search: (prev) => ({ ...prev, mode: m }), replace: true });
                }}
                className={cn(
                  "rounded-lg py-2 text-sm font-medium transition-all",
                  mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          {pendingEmail ? (
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-found-soft text-found">
                <MailCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">Check your email</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{pendingEmail}</span>. Open
                it to activate your account, then log in.
              </p>
            </div>
          ) : (
          <form key={mode} onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            {!isLogin && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required placeholder="Aarav Sharma" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roll">Roll number</Label>
                  <Input id="roll" name="roll" required placeholder="21CSE104" className="h-11" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">College email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@college.edu" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset is coming soon")}
                    className="text-xs font-medium text-navy-soft hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {isLogin ? "Log in" : "Create account"}
            </Button>
          </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "New to FindIt? " : "Already have an account? "}
            <Link
              to="/auth"
              search={(prev) => ({ ...prev, mode: isLogin ? "register" : "login" })}
              replace
              onClick={() => setPendingEmail(null)}
              className="font-semibold text-foreground hover:underline"
            >
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
