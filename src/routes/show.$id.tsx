import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";

import { Hero } from "@/components/media/hero";
import { MediaCard } from "@/components/media/media-card";
import { MediaRow } from "@/components/media/media-row";
import { DetailSkeleton, ErrorState } from "@/components/ui-states";
import { recommendationsQuery, seasonQuery, showQuery } from "@/lib/queries";

export const Route = createFileRoute("/show/$id")({
  head: () => ({
    meta: [
      { title: "Series — Helix" },
      { name: "description", content: "Series details, seasons and episodes on Helix." },
      { property: "og:title", content: "Series — Helix" },
      { property: "og:description", content: "Series details, seasons and episodes on Helix." },
    ],
  }),
  component: ShowPage,
});

function ShowPage() {
  const { id } = Route.useParams();
  const numericId = Number(id);
  const detail = useQuery(showQuery(numericId));
  const recs = useQuery(recommendationsQuery(numericId, "tv"));
  const [season, setSeason] = useState(1);
  const seasonData = useQuery(seasonQuery(numericId, season));

  if (detail.isLoading) return <DetailSkeleton />;
  if (detail.isError || !detail.data) {
    return (
      <div className="px-4 py-24 md:px-10">
        <ErrorState title="Couldn't load this series" onRetry={() => void detail.refetch()} />
      </div>
    );
  }

  const show = detail.data;
  const seasons = show.seasons.filter((s) => s.seasonNumber > 0);

  return (
    <div className="pb-16">
      <Hero item={show} />
      <div className="space-y-8 px-4 py-8 md:px-10">
        <section>
          <div className="mb-4 flex flex-wrap gap-2">
            {seasons.map((s) => (
              <button
                key={s.seasonNumber}
                data-focusable
                onClick={() => setSeason(s.seasonNumber)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  season === s.seasonNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-muted-foreground"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <ul className="space-y-3">
            {(seasonData.data ?? []).map((ep) => (
              <li key={ep.id}>
                <Link
                  to="/watch/$type/$id"
                  params={{ type: "tv", id: String(numericId) }}
                  search={{ season: ep.seasonNumber, episode: ep.episodeNumber, t: undefined }}
                  data-focusable
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-3 transition-colors hover:bg-surface-2"
                >
                  {ep.thumbnail ? (
                    <img src={ep.thumbnail} alt="" className="h-20 w-36 rounded-lg object-cover" />
                  ) : (
                    <div className="h-20 w-36 rounded-lg bg-surface-2" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {ep.episodeNumber}. {ep.title}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{ep.overview}</p>
                  </div>
                  <Play className="size-5 shrink-0 fill-current text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

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
