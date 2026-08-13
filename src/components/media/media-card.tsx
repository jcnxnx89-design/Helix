import { Link } from "@tanstack/react-router";
import { Play, Star } from "lucide-react";

import { ProgressBar } from "@/components/media/progress-bar";
import { cn } from "@/lib/utils";
import type { MediaSummary } from "@/lib/types";

interface MediaCardProps {
  item: MediaSummary;
  orientation?: "portrait" | "landscape";
  progress?: number;
  caption?: string;
  className?: string;
}

export function MediaCard({
  item,
  orientation = "portrait",
  progress,
  caption,
  className,
}: MediaCardProps) {
  const image = orientation === "landscape" ? (item.backdrop ?? item.poster) : (item.poster ?? item.backdrop);
  const to = item.type === "movie" ? "/movie/$id" : "/show/$id";

  return (
    <Link
      to={to}
      params={{ id: String(item.id) }}
      data-focusable
      aria-label={`${item.title}${item.year ? `, ${item.year}` : ""}`}
      className={cn(
        "group relative block shrink-0 rounded-2xl outline-none transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:scale-[1.04]",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-surface-2 shadow-card",
          orientation === "landscape" ? "aspect-video" : "aspect-[2/3]",
        )}
      >
        {image ? (
          <img
            src={image}
            alt={`${item.title} artwork`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-opacity duration-500"
          />
        ) : (
          <div className="flex size-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
            {item.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Play className="size-3 fill-current" /> View
          </span>
        </div>
        {item.rating > 0 ? (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
            <Star className="size-3 fill-primary text-primary" />
            {item.rating.toFixed(1)}
          </span>
        ) : null}
        {progress != null && progress > 0 ? (
          <div className="absolute inset-x-0 bottom-0 p-2">
            <ProgressBar value={progress} />
          </div>
        ) : null}
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="truncate text-sm font-semibold md:text-base">{item.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {caption ?? [item.year, item.genres[0]].filter(Boolean).join(" • ")}
        </p>
      </div>
    </Link>
  );
}
