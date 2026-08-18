import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import logoAsset from "@/assets/rakshanet-logo.png.asset.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/emergency", label: "Emergency" },
  { to: "/guide", label: "Guide Me" },
  { to: "/responders", label: "Responders" },
  { to: "/dashboard", label: "Responder App" },
  { to: "/rakshapass", label: "RakshaPass" },
  { to: "/training", label: "Training" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src={logoAsset.url}
            alt="RakshaNet logo"
            className="size-10 object-contain"
            width={40}
            height={40}
          />
          <span className="font-display text-lg font-bold tracking-tight">RakshaNet</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Button asChild variant="emergency" size="sm">
            <Link to="/emergency">Activate</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <div className={cn("border-t border-border bg-background lg:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-display font-semibold text-foreground">
          RakshaNet — Community first-response network for India&apos;s golden hour
        </p>
        <p className="mt-2 max-w-2xl">
          Hackathon prototype with simulated data. RakshaNet gives safe bystander guidance and
          coordination only — it does not provide medical diagnosis and never replaces calling 112 or
          108.
        </p>
      </div>
    </footer>
  );
}
