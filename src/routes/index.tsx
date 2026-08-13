import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Hero } from "@/components/media/hero";
import { MediaCard } from "@/components/media/media-card";
import { MediaRow } from "@/components/media/media-row";
import { ErrorState, HeroSkeleton, RowSkeleton } from "@/components/ui-states";
import { continueWatching, useProfile } from "@/lib/profile-store";
import {
  airingShowsQuery,
  nowPlayingMoviesQuery,
  popularMoviesQuery,
  popularShowsQuery,
  topRatedMoviesQuery,
  topRatedShowsQuery,
  trendingQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helix — Sit back and watch" },
      {
        name: "description",
        content:
          "A cinematic TV-style home screen for your movies and shows, with a phone remote built in.",
      },
      { property: "og:title", content: "Helix — Sit back and watch" },
      {
        property: "og:description",
        content: "Browse trending movies and shows on a TV-style interface, controlled by your phone.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  useProfile();
  const trending = useQuery(trendingQuery());
  const popularMovies = useQuery(popularMoviesQuery());
  const popularShows = useQuery(popularShowsQuery());
  const topMovies = useQuery(topRatedMoviesQuery());
  const topShows = useQuery(topRatedShowsQuery());
  const nowPlaying = useQuery(nowPlayingMoviesQuery());
  const airing = useQuery(airingShowsQuery());
  const resume = continueWatching().slice(0, 12);

  if (trending.isError) {
    return (
      <div className="px-4 py-24 md:px-10">
        <ErrorState
          title="Couldn't load your library"
          description="Metadata could not be fetched right now. Check the TMDB key in settings and try again."
          onRetry={() => void trending.refetch()}
        />
      </div>
    );
  }

  const hero = trending.data?.[0];

  return (
    <div className="pb-16">
      {trending.isLoading || !hero ? <HeroSkeleton /> : <Hero item={hero} />}

      <div className="-mt-10 space-y-2 md:-mt-16">
        {resume.length ? (
          <MediaRow title="Continue watching" action={<Link to="/continue" className="text-sm text-muted-foreground hover:text-foreground">See all</Link>}>
            {resume.map((p) => (
              <MediaCard
                key={p.key}
                orientation="landscape"
                progress={p.percentage}
                caption={p.episodeTitle ?? "Resume"}
                className="w-[260px] md:w-[320px]"
                item={{
                  id: p.mediaId,
                  type: p.mediaType,
                  title: p.title,
                  poster: p.poster,
                  backdrop: p.backdrop,
                  overview: "",
                  year: null,
                  rating: 0,
                  genres: [],
                }}
              />
            ))}
          </MediaRow>
        ) : null}

        <Row title="Trending now" q={trending} />
        <Row title="Popular movies" q={popularMovies} />
        <Row title="Popular series" q={popularShows} />
        <Row title="In theatres" q={nowPlaying} />
        <Row title="Airing this week" q={airing} />
        <Row title="Top rated films" q={topMovies} />
        <Row title="Top rated series" q={topShows} />
      </div>
    </div>
  );
}

function Row({
  title,
  q,
}: {
  title: string;
  q: { data?: import("@/lib/types").MediaSummary[] | undefined; isLoading: boolean };
}) {
  if (q.isLoading) {
    return (
      <MediaRow title={title}>
        <RowSkeleton />
      </MediaRow>
    );
  }
  if (!q.data?.length) return null;
  return (
    <MediaRow title={title}>
      {q.data.map((item) => (
        <MediaCard key={`${item.type}-${item.id}`} item={item} className="w-[150px] md:w-[190px]" />
      ))}
    </MediaRow>
  );
}
