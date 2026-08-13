import { Link } from "@tanstack/react-router";
import { Check, Info, Play, Plus, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { inMyList, toggleMyList, useProfile } from "@/lib/profile-store";
import type { MediaSummary } from "@/lib/types";

export function Hero({ item }: { item: MediaSummary }) {
  useProfile();
  const listed = inMyList(item.id, item.type);
  const detailTo = item.type === "movie" ? "/movie/$id" : "/show/$id";

  return (
    <section className="relative min-h-[68vh] w-full overflow-hidden md:min-h-[76vh]">
      {item.backdrop ? (
        <img
          src={item.backdrop}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <div className="relative flex min-h-[68vh] max-w-3xl flex-col justify-end gap-5 px-4 pb-16 pt-28 md:min-h-[76vh] md:px-10 md:pb-24">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {item.type === "movie" ? "Film" : "Series"}
          </span>
          {item.rating > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="size-4 fill-primary text-primary" />
              {item.rating.toFixed(1)}
            </span>
          ) : null}
          {item.year ? <span>{item.year}</span> : null}
          {item.genres.length ? <span>{item.genres.slice(0, 3).join(" • ")}</span> : null}
        </div>

        <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl xl:text-7xl">{item.title}</h1>

        {item.overview ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {item.overview.length > 260 ? `${item.overview.slice(0, 260)}…` : item.overview}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button size="lg" asChild data-focusable className="h-12 px-7 text-base font-semibold">
            <Link
              to="/watch/$type/$id"
              params={{ type: item.type, id: String(item.id) }}
              search={{ season: undefined, episode: undefined, t: undefined }}
            >
              <Play className="size-5 fill-current" /> Play
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild data-focusable className="h-12 px-6 text-base">
            <Link to={detailTo} params={{ id: String(item.id) }}>
              <Info className="size-5" /> More info
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            data-focusable
            className="h-12 px-6 text-base"
            onClick={() =>
              toggleMyList({
                id: item.id,
                type: item.type,
                title: item.title,
                poster: item.poster,
                backdrop: item.backdrop,
                year: item.year,
                rating: item.rating,
              })
            }
          >
            {listed ? <Check className="size-5" /> : <Plus className="size-5" />}
            {listed ? "In My List" : "Add to My List"}
          </Button>
        </div>
      </div>
    </section>
  );
}
