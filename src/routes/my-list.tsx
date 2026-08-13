import { createFileRoute } from "@tanstack/react-router";

import { MediaCard } from "@/components/media/media-card";
import { EmptyState } from "@/components/ui-states";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/my-list")({
  head: () => ({
    meta: [
      { title: "My List — Helix" },
      { name: "description", content: "Everything you saved to watch later on Helix." },
      { property: "og:title", content: "My List — Helix" },
      { property: "og:description", content: "Everything you saved to watch later." },
    ],
  }),
  component: MyListPage,
});

function MyListPage() {
  const profile = useProfile();

  return (
    <div className="px-4 py-8 md:px-10">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">My List</h1>
      {profile.myList.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {profile.myList.map((entry) => (
            <MediaCard
              key={`${entry.type}-${entry.id}`}
              item={{
                id: entry.id,
                type: entry.type,
                title: entry.title,
                poster: entry.poster,
                backdrop: entry.backdrop,
                overview: "",
                year: entry.year,
                rating: entry.rating,
                genres: [],
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Your list is empty" description="Add titles from any detail page to find them here." />
      )}
    </div>
  );
}
