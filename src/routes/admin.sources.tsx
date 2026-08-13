import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addSource, listAllSources, deleteSource, setSourceEnabled } from "@/lib/sources.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { VideoSource } from "@/lib/types";

export const Route = createFileRoute("/admin/sources")({
  component: AdminSourcesPage,
});

function AdminSourcesPage() {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    mediaType: "movie" as const,
    metadataId: "550",
    seasonNumber: null as number | null,
    episodeNumber: null as number | null,
    name: "VidCore",
    kind: "iframe" as const,
    url: "https://vidcore.org/embed/movie/{id}",
    mimeType: null as string | null,
    subtitles: [] as any[],
  });

  const handleAuth = async () => {
    setLoading(true);
    try {
      await listAllSources({ data: { passcode } });
      setAuthenticated(true);
      await loadSources();
    } catch (err) {
      alert("Invalid passcode");
    }
    setLoading(false);
  };

  const loadSources = async () => {
    try {
      const data = await listAllSources({ data: { passcode } });
      setSources(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSource = async () => {
    setLoading(true);
    try {
      await addSource({
        data: {
          passcode,
          ...form,
          seasonNumber: form.seasonNumber,
          episodeNumber: form.episodeNumber,
        },
      });
      alert("Source added!");
      await loadSources();
      setForm({
        mediaType: "movie",
        metadataId: "550",
        seasonNumber: null,
        episodeNumber: null,
        name: "VidCore",
        kind: "iframe",
        url: "https://vidcore.org/embed/movie/550",
        mimeType: null,
        subtitles: [],
      });
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoading(false);
  };

  const handleToggleSource = async (id: string, enabled: boolean) => {
    setLoading(true);
    try {
      await setSourceEnabled({
        data: { passcode, id, enabled: !enabled },
      });
      await loadSources();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoading(false);
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await deleteSource({ data: { passcode, id } });
      await loadSources();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md space-y-4 p-6">
          <h1 className="text-2xl font-bold">Admin: Add Sources</h1>
          <Input
            type="password"
            placeholder="Admin Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <Button onClick={handleAuth} disabled={loading} className="w-full">
            {loading ? "Authenticating..." : "Login"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Source Library Manager</h1>
          <Button variant="outline" onClick={() => setAuthenticated(false)}>
            Logout
          </Button>
        </div>

        {/* Add Source Form */}
        <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Add New Source</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Media Type</label>
              <select
                className="w-full rounded border bg-background p-2"
                value={form.mediaType}
                onChange={(e) =>
                  setForm({ ...form, mediaType: e.target.value as "movie" | "tv" })
                }
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">TMDB ID</label>
              <Input
                value={form.metadataId}
                onChange={(e) => setForm({ ...form, metadataId: e.target.value })}
              />
            </div>

            {form.mediaType === "tv" && (
              <>
                <div>
                  <label className="text-sm font-medium">Season</label>
                  <Input
                    type="number"
                    value={form.seasonNumber || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seasonNumber: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Episode</label>
                  <Input
                    type="number"
                    value={form.episodeNumber || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        episodeNumber: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Source Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Kind</label>
              <select
                className="w-full rounded border bg-background p-2"
                value={form.kind}
                onChange={(e) =>
                  setForm({ ...form, kind: e.target.value as "mp4" | "hls" | "dash" | "iframe" })
                }
              >
                <option value="iframe">iframe (Embedded Player)</option>
                <option value="mp4">MP4</option>
                <option value="hls">HLS</option>
                <option value="dash">DASH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Stream URL (must be HTTPS)</label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://vidcore.org/embed/movie/{id}"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              For iframe URLs, use placeholders: {"{id}"} for TMDB ID, {"{season}"} for season, {"{episode}"} for episode
            </p>
          </div>

          <Button onClick={handleAddSource} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Source"}
          </Button>
        </Card>

        {/* Sources List */}
        <Card className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Existing Sources ({sources.length})</h2>

          <div className="space-y-2">
            {sources.length === 0 ? (
              <p className="text-muted-foreground">No sources yet</p>
            ) : (
              sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {source.mediaType === "tv"
                        ? `${source.name} - S${source.seasonNumber}E${source.episodeNumber}`
                        : `${source.name} (Movie #${source.mediaId})`}
                    </p>
                    <p className="text-xs text-muted-foreground">{source.kind.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={source.enabled ? "default" : "outline"}
                      onClick={() => handleToggleSource(source.id, source.enabled)}
                    >
                      {source.enabled ? "Enabled" : "Disabled"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
