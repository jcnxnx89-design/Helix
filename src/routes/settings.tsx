import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { clearMyList, clearPositions, resetProfile, updatePreferences, useProfile } from "@/lib/profile-store";

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
