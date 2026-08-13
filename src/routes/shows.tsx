import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { MediaCard } from "@/components/media/media-card";
import { EmptyState, GridSkeleton } from "@/components/ui-states";
import { discoverQuery } from "@/lib/queries";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "TV Shows — Helix" },
      { name: "description", content: "Browse trending and top rated TV series on Helix." },
      { property: "og:title", content: "TV Shows — Helix" },
      { property: "og:description", content: "Browse trending and top rated TV series." },
    ],
  }),
  component: ShowsPage,
});

function ShowsPage() {
  const { data, isLoading } = useQuery(discoverQuery({ type: "tv", sort: "popularity.desc" }));

  return (
    <div className="px-4 py-8 md:px-10">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">TV Shows</h1>
      {isLoading ? (
        <GridSkeleton />
      ) : data?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {data.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No shows found" description="Try again in a moment." />
      )}
    </div>
  );
}
