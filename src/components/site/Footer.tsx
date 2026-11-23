import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-navy-foreground">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-muted">
              FindIt is a centralized lost & found platform for college campuses. Students can report lost
              belongings, post found items and get reunited faster with AI-powered smart matching.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-navy-muted">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky" /> Student Services Office, Admin Building
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky" /> support@findit.campus
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-navy-muted">
              <li><Link to="/browse" className="hover:text-navy-foreground">Browse items</Link></li>
              <li><Link to="/report-lost" className="hover:text-navy-foreground">Report lost</Link></li>
              <li><Link to="/report-found" className="hover:text-navy-foreground">Report found</Link></li>
              <li><Link to="/auth" search={{ mode: "login" }} className="hover:text-navy-foreground">Log in</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold">Categories</h4>
            <ul className="mt-4 space-y-3 text-sm text-navy-muted">
              {(["ID Cards", "Wallets", "Electronics", "Books"] as const).map((c) => (
                <li key={c}>
                  <Link to="/browse" search={{ category: c }} className="hover:text-navy-foreground">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold">About the project</h4>
            <p className="mt-4 text-sm leading-relaxed text-navy-muted">
              A student-built campus project. Version 1.0 — frontend preview. Database, sign-in and
              Gemini-powered matching are coming next.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-navy-foreground/10 pt-6 text-xs text-navy-muted sm:flex-row">
          <p>© 2026 FindIt – Campus Lost & Found. Made for students, by students.</p>
          <p>Lost something? Don't panic — FindIt.</p>
        </div>
      </div>
    </footer>
  );
}
