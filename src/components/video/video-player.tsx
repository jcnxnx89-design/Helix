import {
  ArrowLeft,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/format";
import { publishNowPlaying, registerPlayer } from "@/lib/player-bridge";
import { getProfile, updatePreferences } from "@/lib/profile-store";
import type { VideoSource } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface VideoPlayerProps {
  source: VideoSource;
  title: string;
  subtitle?: string | null;
  poster?: string | null;
  startAt?: number;
  onBack: () => void;
  onProgress?: (position: number, duration: number) => void;
  onEnded?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  sourceSelector?: React.ReactNode;
}

export function VideoPlayer({
  source,
  title,
  subtitle,
  poster,
  startAt = 0,
  onBack,
  onProgress,
  onEnded,
  onNext,
  onPrev,
  sourceSelector,
}: VideoPlayerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(true);
  const [position, setPosition] = useState(startAt);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const [subsOn, setSubsOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 3500);
  }, []);

  /* ---- attach media ---- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || source.kind === "iframe") return;
    setError(null);
    setReady(false);

    let destroy: (() => void) | undefined;
    const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");

    if (source.kind === "hls" && !nativeHls) {
      let cancelled = false;
      void import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (!Hls.isSupported()) {
          setError("This browser can't play HLS streams.");
          return;
        }
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(source.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) setError("The stream could not be loaded.");
        });
        destroy = () => hls.destroy();
      });
      return () => {
        cancelled = true;
        destroy?.();
      };
    }

    video.src = source.url;
    return () => {
      video.removeAttribute("src");
      video.load();
    };
  }, [source]);

  /* ---- preferences ---- */
  useEffect(() => {
    const prefs = getProfile().preferences;
    const video = videoRef.current;
    if (!video) return;
    video.volume = prefs.volume;
    video.muted = prefs.muted;
    video.playbackRate = prefs.playbackRate;
    setVolumeState(prefs.volume);
    setMuted(prefs.muted);
    setSubsOn(prefs.subtitlesOn);
  }, []);

  /* ---- player API for the phone remote ---- */
  const api = {
    playPause: () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) void v.play();
      else v.pause();
      showControls();
    },
    seekBy: (s: number) => {
      const v = videoRef.current;
      if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + s));
      showControls();
    },
    seekTo: (s: number) => {
      const v = videoRef.current;
      if (v) v.currentTime = Math.max(0, s);
      showControls();
    },
    adjustVolume: (d: number) => {
      const v = videoRef.current;
      if (!v) return;
      const next = Math.max(0, Math.min(1, v.volume + d));
      v.volume = next;
      v.muted = false;
      setVolumeState(next);
      setMuted(false);
      updatePreferences({ volume: next, muted: false });
      showControls();
    },
    setVolume: (value: number) => {
      const v = videoRef.current;
      if (!v) return;
      const next = Math.max(0, Math.min(1, value));
      v.volume = next;
      setVolumeState(next);
      updatePreferences({ volume: next });
      showControls();
    },
    toggleMute: () => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !v.muted;
      setMuted(v.muted);
      updatePreferences({ muted: v.muted });
      showControls();
    },
    nextEpisode: () => onNext?.(),
    prevEpisode: () => onPrev?.(),
    toggleFullscreen: () => {
      const el = shellRef.current;
      if (!el) return;
      if (document.fullscreenElement) void document.exitFullscreen();
      else void el.requestFullscreen().catch(() => undefined);
    },
    toggleSubtitles: () => {
      setSubsOn((on) => {
        const next = !on;
        const v = videoRef.current;
        if (v) {
          for (let i = 0; i < v.textTracks.length; i += 1) {
            v.textTracks[i]!.mode = next && i === 0 ? "showing" : "hidden";
          }
        }
        updatePreferences({ subtitlesOn: next });
        return next;
      });
      showControls();
    },
  };
  const apiRef = useRef(api);
  apiRef.current = api;

  useEffect(() => {
    return registerPlayer({
      playPause: () => apiRef.current.playPause(),
      seekBy: (s) => apiRef.current.seekBy(s),
      seekTo: (s) => apiRef.current.seekTo(s),
      adjustVolume: (d) => apiRef.current.adjustVolume(d),
      setVolume: (v) => apiRef.current.setVolume(v),
      toggleMute: () => apiRef.current.toggleMute(),
      nextEpisode: () => apiRef.current.nextEpisode(),
      prevEpisode: () => apiRef.current.prevEpisode(),
      toggleFullscreen: () => apiRef.current.toggleFullscreen(),
      toggleSubtitles: () => apiRef.current.toggleSubtitles(),
    });
  }, []);

  useEffect(() => {
    publishNowPlaying({
      title,
      subtitle: subtitle ?? null,
      poster: poster ?? null,
      position,
      duration,
      paused,
      volume,
      muted,
      subtitlesOn: subsOn,
    });
  }, [title, subtitle, poster, position, duration, paused, volume, muted, subsOn]);

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          apiRef.current.playPause();
          break;
        case "ArrowRight":
          apiRef.current.seekBy(10);
          break;
        case "ArrowLeft":
          apiRef.current.seekBy(-10);
          break;
        case "ArrowUp":
          apiRef.current.adjustVolume(0.1);
          break;
        case "ArrowDown":
          apiRef.current.adjustVolume(-0.1);
          break;
        case "m":
          apiRef.current.toggleMute();
          break;
        case "f":
          apiRef.current.toggleFullscreen();
          break;
        case "c":
          apiRef.current.toggleSubtitles();
          break;
        case "Escape":
          if (!document.fullscreenElement) onBack();
          break;
      }
      showControls();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack, showControls]);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    showControls();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [showControls]);

  if (source.kind === "iframe") {
    // Replace placeholders in iframe URL with actual IDs
    let iframeUrl = source.url;
    iframeUrl = iframeUrl.replace("{id}", source.mediaId);
    iframeUrl = iframeUrl.replace("{season}", String(source.seasonNumber ?? 1));
    iframeUrl = iframeUrl.replace("{episode}", String(source.episodeNumber ?? 1));
    
    return (
      <div ref={shellRef} className="relative size-full bg-black">
        <iframe
          src={iframeUrl}
          title={title}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          className="size-full border-0"
        />
        <Button
          variant="secondary"
          className="absolute left-4 top-4 rounded-full"
          onClick={onBack}
          data-focusable
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
      </div>
    );
  }

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={shellRef}
      className="relative size-full select-none bg-black"
      onMouseMove={showControls}
      onClick={showControls}
    >
      <video
        ref={videoRef}
        poster={poster ?? undefined}
        playsInline
        autoPlay
        className="size-full object-contain"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDuration(v.duration || 0);
          if (startAt > 0 && startAt < (v.duration || Infinity) - 10) v.currentTime = startAt;
          setReady(true);
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setPosition(v.currentTime);
          onProgress?.(v.currentTime, v.duration || 0);
        }}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onEnded={() => onEnded?.()}
        onError={() => setError("This source could not be played.")}
        onDoubleClick={() => apiRef.current.toggleFullscreen()}
      >
        {source.subtitles.map((track, i) => (
          <track
            key={track.url}
            kind="subtitles"
            src={track.url}
            srcLang={track.lang}
            label={track.label}
            default={subsOn && i === 0}
          />
        ))}
      </video>

      {(!ready || buffering) && !error ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Loader2 className="size-12 animate-spin text-primary" />
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 grid place-items-center bg-background/90 px-6 text-center">
          <div className="max-w-sm space-y-4">
            <h2 className="text-xl font-semibold">Playback problem</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={onBack} data-focusable>
              Go back
            </Button>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/90 transition-opacity duration-300",
          controlsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="pointer-events-auto flex items-start gap-4 p-4 md:p-6">
          <Button variant="ghost" size="icon" onClick={onBack} data-focusable aria-label="Back">
            <ArrowLeft className="size-6" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold md:text-2xl">{title}</p>
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            {sourceSelector}
          </div>
        </div>

        <div className="pointer-events-auto space-y-3 p-4 md:p-8">
          <Slider
            value={[duration ? (position / duration) * 100 : 0]}
            onValueChange={([v]) => apiRef.current.seekTo(((v ?? 0) / 100) * duration)}
            max={100}
            step={0.1}
            aria-label="Seek"
          />
          <div className="flex items-center gap-2 text-sm">
            <Button size="icon" variant="ghost" onClick={() => apiRef.current.playPause()} data-focusable aria-label={paused ? "Play" : "Pause"}>
              {paused ? <Play className="size-6 fill-current" /> : <Pause className="size-6" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => apiRef.current.seekBy(-10)} data-focusable aria-label="Back 10 seconds">
              <RotateCcw className="size-5" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => apiRef.current.seekBy(10)} data-focusable aria-label="Forward 10 seconds">
              <RotateCw className="size-5" />
            </Button>
            {onPrev ? (
              <Button size="icon" variant="ghost" onClick={onPrev} data-focusable aria-label="Previous episode">
                <SkipBack className="size-5" />
              </Button>
            ) : null}
            {onNext ? (
              <Button size="icon" variant="ghost" onClick={onNext} data-focusable aria-label="Next episode">
                <SkipForward className="size-5" />
              </Button>
            ) : null}
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <Button size="icon" variant="ghost" onClick={() => apiRef.current.toggleMute()} data-focusable aria-label="Mute">
                <VolumeIcon className="size-5" />
              </Button>
              <Slider
                className="w-24"
                value={[muted ? 0 : volume * 100]}
                onValueChange={([v]) => apiRef.current.setVolume((v ?? 0) / 100)}
                max={100}
                aria-label="Volume"
              />
            </div>
            <span className="ml-2 tabular-nums text-muted-foreground">
              {formatTime(position)} / {formatTime(duration)}
            </span>
            <div className="ml-auto flex items-center gap-1">
              {source.subtitles.length ? (
                <Button
                  size="icon"
                  variant={subsOn ? "default" : "ghost"}
                  onClick={() => apiRef.current.toggleSubtitles()}
                  data-focusable
                  aria-label="Subtitles"
                >
                  <Subtitles className="size-5" />
                </Button>
              ) : null}
              <Button size="icon" variant="ghost" onClick={() => apiRef.current.toggleFullscreen()} data-focusable aria-label="Fullscreen">
                {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
