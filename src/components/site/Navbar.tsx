import { Link } from "@tanstack/react-router";
import { Menu, PackageSearch, PackagePlus, LogIn, Home, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/browse", label: "Browse Items", icon: LayoutGrid },
  { to: "/report-lost", label: "Report Lost", icon: PackageSearch },
  { to: "/report-found", label: "Report Found", icon: PackagePlus },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "border-b border-border/70 bg-background/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 shadow-soft backdrop-blur lg:flex">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-primary text-primary-foreground hover:text-primary-foreground" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost">
            <Link to="/auth" search={{ mode: "login" }}>
              Log in
            </Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/auth" search={{ mode: "register" }}>
              Get started
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
            </SheetHeader>
            <ul className="mt-6 flex flex-col gap-1 px-4">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: true }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                    activeProps={{ className: "bg-accent" }}
                  >
                    <item.icon className="h-5 w-5 text-navy-soft" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2 px-4">
              <Button asChild variant="hero" size="xl" onClick={() => setOpen(false)}>
                <Link to="/auth" search={{ mode: "login" }}>
                  <LogIn /> Log in / Register
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
