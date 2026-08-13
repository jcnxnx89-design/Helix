import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { clearMyList, clearPositions, resetProfile, updatePreferences, useProfile } from "@/lib/profile-store";
import { listAllSources } from "@/lib/sources.functions";
import { trendingQuery } from "@/lib/queries";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Helix" },
      { name: "description", content: "Tune playback, subtitles, motion and data preferences in Helix." },
      { property: "og:title", content: "Settings — Helix" },
      { property: "og:description", content: "Tune playback, subtitles and data preferences." },
    ],
  }),
  component: SettingsPage,
});

const TOGGLES = [
  { key: "autoplay", label: "Autoplay", hint: "Start playing as soon as a title opens." },
  { key: "autoplayNext", label: "Autoplay next episode", hint: "Roll straight into the next episode." },
  { key: "resumePlayback", label: "Resume playback", hint: "Pick up where you left off." },
  { key: "subtitlesOn", label: "Subtitles by default", hint: "Enable captions when available." },
  { key: "reduceMotion", label: "Reduce motion", hint: "Calmer transitions and hover effects." },
  { key: "largeText", label: "Large text", hint: "Bigger type for across-the-room reading." },
] as const;

function SettingsPage() {
  const profile = useProfile();
  const trendings = useQuery(trendingQuery());

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-10">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl">Settings</h1>

      <section className="mb-8 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-surface">
        {TOGGLES.map((t) => (
          <div key={t.key} className="flex items-center justify-between gap-6 p-4">
            <div>
              <p className="font-medium">{t.label}</p>
              <p className="text-sm text-muted-foreground">{t.hint}</p>
            </div>
            <Switch
              checked={Boolean(profile.preferences[t.key])}
              onCheckedChange={(v) => updatePreferences({ [t.key]: v })}
              aria-label={t.label}
            />
          </div>
        ))}
      </section>

      <section className="mb-8 space-y-3 rounded-2xl border border-border/60 bg-surface p-5">
        <h2 className="text-lg font-semibold">Preferred streaming source</h2>
        <p className="text-sm text-muted-foreground">
          Choose your default video source. You can still switch during playback.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updatePreferences({ preferredSourceName: undefined })}
            className={`rounded px-3 py-2 text-sm font-medium transition ${
              !profile.preferences.preferredSourceName
                ? "bg-primary text-primary-foreground"
                : "bg-background/50 text-foreground hover:bg-background/70"
            }`}
          >
            Auto (first available)
          </button>
          {["VidCore", "2embed", "HiMovie", "MovieBox", "StreamM4u", "Losmovies", "Flixtor"].map((name) => (
            <button
              key={name}
              onClick={() => updatePreferences({ preferredSourceName: name })}
              className={`rounded px-3 py-2 text-sm font-medium transition ${
                profile.preferences.preferredSourceName === name
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/50 text-foreground hover:bg-background/70"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border/60 bg-surface p-5">
        <h2 className="text-lg font-semibold">Your data</h2>
        <p className="text-sm text-muted-foreground">
          Helix stores your history and list on this device only — no account needed.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => clearPositions()}>Clear progress</Button>
          <Button variant="outline" onClick={() => clearMyList()}>Clear my list</Button>
          <Button variant="destructive" onClick={() => resetProfile()}>Reset everything</Button>
        </div>
      </section>
    </div>
  );
}
