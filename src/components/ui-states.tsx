import { Link } from "@tanstack/react-router";
import { AlertTriangle, Film, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-surface/50 px-8 py-20 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-surface-2 text-primary">
        {icon ?? <Film className="size-7" />}
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 px-8 py-16 text-center"
    >
      <AlertTriangle className="mb-4 size-8 text-destructive" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description ?? "We couldn't load this right now. Please try again."}
      </p>
      <div className="mt-6 flex gap-3">
        {onRetry ? (
          <Button onClick={onRetry} data-focusable>
            <RefreshCw className="size-4" /> Try again
          </Button>
        ) : null}
        <Button variant="outline" asChild data-focusable>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-surface-2", className)} />;
}

export function RowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-4 md:px-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[46vw] shrink-0 sm:w-64 md:w-72">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
      <Skeleton className="size-full rounded-none" />
      <div className="absolute bottom-16 left-4 space-y-4 md:left-10">
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-4 w-[min(90vw,36rem)]" />
        <Skeleton className="h-11 w-64" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      <HeroSkeleton />
      <div className="space-y-4 px-4 py-10 md:px-10">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-2/3 max-w-2xl" />
      </div>
    </div>
  );
}
