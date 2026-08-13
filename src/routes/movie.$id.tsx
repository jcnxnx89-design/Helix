import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/media/hero";
import { MediaCard } from "@/components/media/media-card";
import { MediaRow } from "@/components/media/media-row";
import { DetailSkeleton, ErrorState } from "@/components/ui-states";
import { formatRuntime } from "@/lib/format";
import { movieQuery, recommendationsQuery } from "@/lib/queries";

export const Route = createFileRoute("/movie/$id")({
  head: () => ({
    meta: [
      { title: "Movie — Helix" },
      { name: "description", content: "Movie details, cast and playback on Helix." },
      { property: "og:title", content: "Movie — Helix" },
      { property: "og:description", content: "Movie details, cast and playback on Helix." },
    ],
  }),
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const numericId = Number(id);
  const detail = useQuery(movieQuery(numericId));
  const recs = useQuery(recommendationsQuery(numericId, "movie"));

  if (detail.isLoading) return <DetailSkeleton />;
  if (detail.isError || !detail.data) {
    return (
      <div className="px-4 py-24 md:px-10">
        <ErrorState title="Couldn't load this movie" onRetry={() => void detail.refetch()} />
      </div>
    );
  }

  const movie = detail.data;

  return (
    <div className="pb-16">
      <Hero item={movie} />
      <div className="space-y-8 px-4 py-8 md:px-10">
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          {formatRuntime(movie.runtime) ? <span>{formatRuntime(movie.runtime)}</span> : null}
          {movie.status ? <span>{movie.status}</span> : null}
          {movie.genres.length ? <span>{movie.genres.join(", ")}</span> : null}
        </div>

        {movie.cast.length ? (
          <section>
            <h2 className="mb-3 text-xl font-semibold">Cast</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {movie.cast.slice(0, 16).map((p) => (
                <div key={p.id} className="w-28 shrink-0 text-center">
                  {p.profile ? (
                    <img src={p.profile} alt={p.name} className="mb-2 size-28 rounded-full object-cover" />
                  ) : (
                    <div className="mb-2 size-28 rounded-full bg-surface-2" />
                  )}
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.role}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {recs.data?.length ? (
          <MediaRow title="More like this" className="-mx-4 md:-mx-10">
            {recs.data.map((item) => (
              <MediaCard key={item.id} item={item} className="w-[150px] md:w-[190px]" />
            ))}
          </MediaRow>
        ) : null}
      </div>
    </div>
  );
}
