import { createFileRoute } from "@tanstack/react-router";

import { MediaCard } from "@/components/media/media-card";
import { EmptyState } from "@/components/ui-states";
import { continueWatching, useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/continue")({
  head: () => ({
    meta: [
      { title: "Continue Watching — Helix" },
      { name: "description", content: "Pick up every movie and episode exactly where you left off." },
      { property: "og:title", content: "Continue Watching — Helix" },
      { property: "og:description", content: "Pick up where you left off on Helix." },
    ],
  }),
  component: ContinuePage,
});

function ContinuePage() {
  useProfile();
  const items = continueWatching();

  return (
    <div className="px-4 py-8 md:px-10">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Continue watching</h1>
      {items.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <MediaCard
              key={p.key}
              orientation="landscape"
              progress={p.percentage}
              caption={p.episodeTitle ?? `${Math.round(p.percentage)}% watched`}
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
        </div>
      ) : (
        <EmptyState title="Nothing in progress" description="Start something and it will show up here." />
      )}
    </div>
  );
}
