import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";

import { MediaCard } from "@/components/media/media-card";
import { Input } from "@/components/ui/input";
import { EmptyState, GridSkeleton } from "@/components/ui-states";
import { searchQuery } from "@/lib/queries";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "all").default("all"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Search — Helix" },
      { name: "description", content: "Search movies and TV shows across the Helix library." },
      { property: "og:title", content: "Search — Helix" },
      { property: "og:description", content: "Search movies and TV shows across the Helix library." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q, type } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { data, isLoading } = useQuery(searchQuery(q));

  const all: import("@/lib/types").MediaSummary[] = data
    ? [...data.movies, ...data.shows]
    : [];
  const filtered = all.filter((item) =>
    type === "all" ? true : type === "movie" ? item.type === "movie" : item.type === "tv",
  );

  return (
    <div className="px-4 py-8 md:px-10">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Search</h1>
      <div className="relative mb-6 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          placeholder="Search movies and shows…"
          aria-label="Search movies and shows"
          onChange={(e) =>
            void navigate({ search: (prev) => ({ ...prev, q: e.target.value }) })
          }
          className="h-14 rounded-2xl border-border bg-surface pl-12 text-base"
        />
      </div>

      <div className="mb-6 flex gap-2">
        {(["all", "movie", "tv"] as const).map((t) => (
          <button
            key={t}
            data-focusable
            onClick={() => void navigate({ search: (prev) => ({ ...prev, type: t }) })}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              type === t ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
            }`}
          >
            {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
          </button>
        ))}
      </div>

      {q.trim().length < 2 ? (
        <EmptyState title="Start typing" description="Search for a title, and use your phone remote to pick it." />
      ) : isLoading ? (
        <GridSkeleton />
      ) : filtered.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {filtered.map((item) => (
            <MediaCard key={`${item.type}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No results" description={`Nothing matched “${q}”.`} />
      )}
    </div>
  );
}
