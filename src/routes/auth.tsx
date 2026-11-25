
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
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

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login")) return "Wrong email or password. Please try again.";
  if (m.includes("not confirmed")) return "Please confirm your email first. Check your inbox.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try logging in.";
  if (m.includes("password")) return message;
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("disabled") || m.includes("not enabled"))
    return "Email sign-in is not enabled yet.";

  return "Something went wrong. Please try again.";
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const out: AuthSearch = {};

    if (search["mode"] === "register" || search["mode"] === "login") {
      out.mode = search["mode"];
    }

    const redirect = search["redirect"];

    if (
      typeof redirect === "string" &&
      redirect.startsWith("/") &&
      !redirect.startsWith("//") &&
      !redirect.startsWith("/auth")
    ) {
      out.redirect = redirect.slice(0, 200);
    }

    return out;
  },

  head: () => ({
    meta: [
      { title: "Log in or Register – FindIt" },
      {
        name: "description",
        content: "Sign in to FindIt to report and browse campus lost and found items.",
      },
    ],
  }),

  component: AuthPage,
});

const PERKS = [
  {
    icon: ScanSearch,
    title: "Find campus belongings",
    description: "Browse lost and found reports in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Account-based reporting",
    description: "Sign in to submit and manage your reports.",
  },
  {
    icon: Sparkles,
    title: "AI assistant",
    description: "Ask questions about reported campus items.",
  },
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
            data: {
              full_name: fullName,
              roll_number: roll,
            },
          },
        });

        if (error) throw error;

        if (res.session) {
          toast.success("Account created successfully!");
          goNext();
        } else if (res.user && (res.user.identities?.length ?? 0) === 0) {
          toast.error("An account with this email already exists. Try logging in.");
        } else {
          setPendingEmail(email);
          toast.success("Check your email to confirm your account.");
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
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-sky/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">

        {/* Left information panel */}
        <div className="relative hidden overflow-hidden rounded-[2rem] bg-gradient-navy p-10 text-navy-foreground shadow-elevated lg:flex lg:flex-col">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky/20 blur-3xl" />

          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-navy-foreground text-navy shadow-lg">
              <ScanSearch className="h-7 w-7" />
            </span>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-sky">
              FindIt Campus Hub
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight xl:text-5xl">
              Lost something?
              <br />
              <span className="text-sky">Find it here.</span>
            </h2>

            <p className="mt-5 max-w-sm text-base leading-relaxed text-navy-muted">
              One campus platform to report lost belongings, discover found items,
              and reconnect students with their possessions.
            </p>
          </div>

          <div className="relative mt-auto space-y-5 pt-14">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-foreground/10 text-sky">
                  <perk.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{perk.title}</p>
                  <p className="mt-0.5 text-xs text-navy-muted">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-10 border-t border-white/10 pt-5 text-xs text-navy-muted">
            Your campus. Your community. Your FindIt.
          </div>
        </div>

        {/* Right authentication panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md animate-fade-up rounded-[2rem] border border-border bg-card p-6 shadow-elevated sm:p-9">

            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-white">
                <ScanSearch className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold text-foreground">FindIt</p>
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground">
                  CAMPUS LOST & FOUND
                </p>
              </div>
            </div>

            <div className="mb-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-navy-soft">
                <Sparkles className="h-3.5 w-3.5 text-sky" />
                Welcome to FindIt
              </span>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {isLogin
                  ? "Log in to manage your lost and found reports."
                  : "Join your campus community and help reconnect lost belongings."}
              </p>
            </div>

            <div className="grid grid-cols-2 rounded-xl border border-border bg-muted p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setPendingEmail(null);
                    setShowPw(false);
                    void navigate({
                      search: (prev) => ({ ...prev, mode: m }),
                      replace: true,
                    });
                  }}
                  className={cn(
                    "rounded-lg py-3 text-sm font-semibold transition-all duration-200",
                    mode === m
                      ? "bg-card text-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m === "login" ? "Log in" : "Register"}
                </button>
              ))}
            </div>

            {pendingEmail ? (
              <div className="mt-7 rounded-2xl border border-border bg-muted/50 p-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-found-soft text-found">
                  <MailCheck className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-foreground">
                  Check your email
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  We sent a confirmation link to{" "}
                  <span className="font-semibold text-foreground">{pendingEmail}</span>.
                  Open it to activate your account, then log in.
                </p>
                <Button
                  type="button"
                  variant="hero"
                  className="mt-6 w-full"
                  onClick={() => {
                    setPendingEmail(null);
                    void navigate({
                      search: (prev) => ({ ...prev, mode: "login" }),
                      replace: true,
                    });
                  }}
                >
                  Go to login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form key={mode} onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        maxLength={80}
                        placeholder="Enter your full name"
                        className="h-12 rounded-xl bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roll">Roll number</Label>
                      <Input
                        id="roll"
                        name="roll"
                        required
                        maxLength={30}
                        placeholder="Enter your roll number"
                        className="h-12 rounded-xl bg-background"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-12 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {isLogin && (
                      <span className="text-xs text-muted-foreground">
                        Minimum 6 characters
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Enter your password"
                      className="h-12 rounded-xl bg-background pr-12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      {isLogin ? "Log in to FindIt" : "Create account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <div className="mt-7 border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "New to FindIt?" : "Already have an account?"}{" "}
                <Link
                  to="/auth"
                  search={(prev) => ({
                    ...prev,
                    mode: isLogin ? "register" : "login",
                  })}
                  replace
                  onClick={() => setPendingEmail(null)}
                  className="font-bold text-foreground underline-offset-4 hover:underline"
                >
                  {isLogin ? "Create an account" : "Log in"}
                </Link>
              </p>

              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-found" />
                Secure account authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
