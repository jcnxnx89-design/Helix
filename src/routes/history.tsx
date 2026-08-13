import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui-states";
import { formatTime } from "@/lib/format";
import { clearHistory, clearHistoryEntry, useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Watch History — Helix" },
      { name: "description", content: "Review everything you have watched on Helix." },
      { property: "og:title", content: "Watch History — Helix" },
      { property: "og:description", content: "Review everything you have watched." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const profile = useProfile();

  return (
    <div className="px-4 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold md:text-4xl">Watch history</h1>
        {profile.watchHistory.length ? (
          <Button variant="outline" onClick={() => clearHistory()} data-focusable>
            <Trash2 className="size-4" /> Clear all
          </Button>
        ) : null}
      </div>

      {profile.watchHistory.length ? (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-surface">
          {profile.watchHistory.map((entry) => (
            <li key={`${entry.key}-${entry.watchedAt}`} className="flex items-center gap-4 p-4">
              {entry.poster ? (
                <img src={entry.poster} alt="" className="h-20 w-14 rounded-lg object-cover" />
              ) : (
                <div className="h-20 w-14 rounded-lg bg-surface-2" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{entry.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {entry.episodeTitle ? `${entry.episodeTitle} • ` : ""}
                  {formatTime(entry.position)} of {formatTime(entry.duration)} •{" "}
                  {new Date(entry.watchedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Remove ${entry.title} from history`}
                onClick={() => clearHistoryEntry(entry.key)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No history yet" description="Watch something and it will be listed here." />
      )}
    </div>
  );
}
