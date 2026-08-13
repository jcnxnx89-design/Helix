import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useState } from "react";
import { z } from "zod";

import { VideoPlayer } from "@/components/video/video-player";
import { EmptyState } from "@/components/ui-states";
import { getPosition, saveProgress, useProfile } from "@/lib/profile-store";
import { movieQuery, seasonQuery, showQuery, sourcesQuery } from "@/lib/queries";

const watchSearch = z.object({
  season: fallback(z.number().optional(), undefined),
  episode: fallback(z.number().optional(), undefined),
  t: fallback(z.number().optional(), undefined),
});

export const Route = createFileRoute("/watch/$type/$id")({
  validateSearch: zodValidator(watchSearch),
  head: () => ({
    meta: [
      { title: "Now playing — Helix" },
      { name: "description", content: "Full-screen playback with phone remote control on Helix." },
      { property: "og:title", content: "Now playing — Helix" },
      { property: "og:description", content: "Full-screen playback with phone remote control." },
    ],
  }),
  component: WatchPage,
});

function WatchPage() {
  const { type, id } = Route.useParams();
  const { season, episode, t } = Route.useSearch();
  const router = useRouter();
  const navigate = useNavigate({ from: "/watch/$type/$id" });
  const mediaType = type === "tv" ? "tv" : "movie";
  const numericId = Number(id);
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const profile = useProfile();

  const movie = useQuery({ ...movieQuery(numericId), enabled: mediaType === "movie" });
  const show = useQuery({ ...showQuery(numericId), enabled: mediaType === "tv" });
  const episodes = useQuery({
    ...seasonQuery(numericId, season ?? 1),
    enabled: mediaType === "tv",
  });
  const sources = useQuery(
    sourcesQuery({
      mediaType,
      metadataId: String(numericId),
      seasonNumber: mediaType === "tv" ? (season ?? 1) : null,
      episodeNumber: mediaType === "tv" ? (episode ?? 1) : null,
    }),
  );

  // Debug logging
  useEffect(() => {
    console.log("[WatchPage] Sources query result:", {
      mediaType,
      numericId,
      isLoading: sources.isLoading,
      isError: sources.isError,
      error: sources.error,
      dataLength: sources.data?.length,
      data: sources.data?.map(s => ({ name: s.name, kind: s.kind, url: s.url })),
    });
  }, [sources.data, sources.isLoading, sources.isError, sources.error, mediaType, numericId]);

  const detail = mediaType === "tv" ? show.data : movie.data;
  const currentEpisode = episodes.data?.find((e) => e.episodeNumber === (episode ?? 1));
  
  // Use preferred source if available, otherwise first source
  const preferredSourceName = profile.preferences.preferredSourceName;
  const source = preferredSourceName && sources.data
    ? sources.data.find(s => s.name === preferredSourceName) || sources.data[0]
    : sources.data?.[selectedSourceIndex];
  const saved = detail
    ? getPosition(mediaType, numericId, season ?? null, episode ?? null)
    : undefined;

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else
      void navigate({
        to: mediaType === "tv" ? "/show/$id" : "/movie/$id",
        params: { id: String(numericId) },
      });
  };

  if (sources.isLoading || (!detail && (movie.isLoading || show.isLoading))) {
    return <div className="grid min-h-screen place-items-center bg-black text-muted-foreground">Loading…</div>;
  }

  if (!source || !detail) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <EmptyState
          title="No playable source"
          description="This title has no source configured yet. Add one from the library manager and try again."
        />
      </div>
    );
  }

  const title = detail.title;
  const subtitle =
    mediaType === "tv" && currentEpisode
      ? `S${season ?? 1} E${currentEpisode.episodeNumber} • ${currentEpisode.title}`
      : null;

  const goToEpisode = (delta: number) => {
    if (mediaType !== "tv") return;
    const next = (episode ?? 1) + delta;
    if (next < 1) return;
    void navigate({ search: (prev) => ({ ...prev, episode: next, t: undefined }) });
  };

  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer
        source={source}
        title={title}
        subtitle={subtitle}
        poster={detail.backdrop}
        startAt={t ?? saved?.position ?? 0}
        onBack={goBack}
        onProgress={(position, duration) =>
          saveProgress({
            mediaType,
            mediaId: numericId,
            seasonNumber: season ?? null,
            episodeNumber: episode ?? null,
            position,
            duration,
            title,
            poster: detail.poster,
            backdrop: detail.backdrop,
            episodeTitle: subtitle,
          })
        }
        onEnded={() => goToEpisode(1)}
        {...(mediaType === "tv" ? { onNext: () => goToEpisode(1), onPrev: () => goToEpisode(-1) } : {})}
      />
    </div>
  );
}
