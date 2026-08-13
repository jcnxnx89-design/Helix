import { Link, useRouterState } from "@tanstack/react-router";
import {
  Clock,
  Film,
  Heart,
  Home,
  PlayCircle,
  Search,
  Settings,
  Smartphone,
  Tv,
} from "lucide-react";
import type { ReactNode } from "react";

import { PairPhoneButton } from "@/components/remote/pair-dialog";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/shows", label: "TV Shows", icon: Tv },
  { to: "/search", label: "Search", icon: Search },
  { to: "/continue", label: "Continue", icon: PlayCircle },
  { to: "/my-list", label: "My List", icon: Heart },
  { to: "/history", label: "History", icon: Clock },
] as const;

const MOBILE_NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/shows", label: "Shows", icon: Tv },
  { to: "/search", label: "Search", icon: Search },
  { to: "/my-list", label: "My List", icon: Heart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bare = pathname.startsWith("/watch") || pathname.startsWith("/remote");

  if (bare) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 md:h-[72px] md:gap-6 md:px-10">
          <Link to="/" className="flex items-center gap-2" aria-label="Helix home">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PlayCircle className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight md:text-xl">Helix</span>
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-focusable
                search={{ q: "", type: "all" } as never}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                )}
                activeProps={{ className: "bg-surface-2 text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <PairPhoneButton />
            <Link
              to="/settings"
              aria-label="Settings"
              data-focusable
              className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <Settings className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16 md:pt-[72px]">{children}</main>

      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
      >
        {MOBILE_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            search={{ q: "", type: "all" } as never}
            className="flex flex-col items-center gap-1 py-3 text-[11px] text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <Link
        to="/remote"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-surface-2 px-4 py-3 text-xs font-semibold shadow-card md:hidden"
      >
        <Smartphone className="size-4" /> Remote
      </Link>
    </div>
  );
}
