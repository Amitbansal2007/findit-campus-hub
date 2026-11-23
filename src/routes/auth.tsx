import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, ScanSearch, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } =>
    search["mode"] === "register" ? { mode: "register" } : search["mode"] === "login" ? { mode: "login" } : {},
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
  const { mode = "login" } = Route.useSearch();
  const navigate = useNavigate({ from: "/auth" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setLoading(true);
    // Real sign-in arrives with the backend step.
    window.setTimeout(() => {
      setLoading(false);
      toast.info("Accounts are coming soon", {
        description: "Sign-in will be enabled once the backend is connected.",
      });
    }, 800);
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
                onClick={() => navigate({ search: { mode: m }, replace: true })}
                className={cn(
                  "rounded-lg py-2 text-sm font-medium transition-all",
                  mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "New to FindIt? " : "Already have an account? "}
            <Link
              to="/auth"
              search={{ mode: isLogin ? "register" : "login" }}
              replace
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
