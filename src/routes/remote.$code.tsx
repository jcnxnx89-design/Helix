import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Home,
  Loader2,
  Pause,
  Play,
  Power,
  RotateCcw,
  RotateCw,
  Search,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  Undo2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/format";
import { claimPairing } from "@/lib/remote.functions";
import { joinRemoteChannel, type HostState, type RemoteBus, type RemoteCommand } from "@/lib/remote-bus";

export const Route = createFileRoute("/remote/$code")({
  head: () => ({
    meta: [
      { title: "Remote — Helix" },
      { name: "description", content: "Control your Helix screen from your phone." },
      { property: "og:title", content: "Remote — Helix" },
      { property: "og:description", content: "Control your Helix screen from your phone." },
    ],
  }),
  component: RemotePage,
});

type Status = "connecting" | "connected" | "error";

function RemotePage() {
  const { code } = Route.useParams();
  const [status, setStatus] = useState<Status>("connecting");
  const [reason, setReason] = useState<string | null>(null);
  const [state, setState] = useState<HostState | null>(null);
  const busRef = useRef<RemoteBus | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await claimPairing({ data: { code } });
        if (!active) return;
        if (!result.ok) {
          setStatus("error");
          setReason(
            result.reason === "expired"
              ? "That code expired. Generate a new one on your TV."
              : result.reason === "already-used"
                ? "That code was already used. Generate a new one on your TV."
                : result.reason === "rate-limited"
                  ? "Too many attempts. Generate a new code on your TV."
                  : "That code isn't valid.",
          );
          return;
        }
        busRef.current = joinRemoteChannel(result.sessionId, "remote", {
          onState: (s) => setState(s),
          onSubscribed: () => setStatus("connected"),
        });
      } catch {
        if (active) {
          setStatus("error");
          setReason("Could not reach the pairing service.");
        }
      }
    })();
    return () => {
      active = false;
      busRef.current?.leave();
      busRef.current = null;
    };
  }, [code]);

  const send = (cmd: RemoteCommand) => {
    busRef.current?.sendCommand(cmd);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
  };

  if (status === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div className="max-w-xs space-y-3">
          <h1 className="text-xl font-semibold">Can't pair</h1>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  const np = state?.nowPlaying ?? null;

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-background px-5 py-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-primary">Connected</p>
        <h1 className="truncate text-lg font-semibold">{np?.title ?? "Helix"}</h1>
        {np?.subtitle ? <p className="truncate text-sm text-muted-foreground">{np.subtitle}</p> : null}
        {np ? (
          <p className="mt-1 text-xs tabular-nums text-muted-foreground">
            {formatTime(np.position)} / {formatTime(np.duration)}
          </p>
        ) : null}
      </header>

      <div className="mx-auto grid w-full max-w-xs grid-cols-3 grid-rows-3 gap-3">
        <div />
        <PadButton label="Up" onClick={() => send({ type: "dpad", payload: { dir: "up" } })}>
          <ChevronUp className="size-7" />
        </PadButton>
        <div />
        <PadButton label="Left" onClick={() => send({ type: "dpad", payload: { dir: "left" } })}>
          <ChevronLeft className="size-7" />
        </PadButton>
        <button
          aria-label="OK"
          onClick={() => send({ type: "ok" })}
          className="rounded-full bg-primary py-6 text-base font-bold text-primary-foreground active:scale-95"
        >
          OK
        </button>
        <PadButton label="Right" onClick={() => send({ type: "dpad", payload: { dir: "right" } })}>
          <ChevronRight className="size-7" />
        </PadButton>
        <div />
        <PadButton label="Down" onClick={() => send({ type: "dpad", payload: { dir: "down" } })}>
          <ChevronDown className="size-7" />
        </PadButton>
        <div />
      </div>

      <div className="mx-auto grid w-full max-w-xs grid-cols-4 gap-3">
        <PadButton label="Back" onClick={() => send({ type: "back" })}>
          <Undo2 className="size-6" />
        </PadButton>
        <PadButton label="Home" onClick={() => send({ type: "home" })}>
          <Home className="size-6" />
        </PadButton>
        <PadButton label="Search" onClick={() => send({ type: "navigate", payload: { to: "/search" } })}>
          <Search className="size-6" />
        </PadButton>
        <PadButton label="Menu" onClick={() => send({ type: "menu" })}>
          <Settings className="size-6" />
        </PadButton>
      </div>

      <div className="mx-auto grid w-full max-w-xs grid-cols-5 items-center gap-3">
        <PadButton label="Previous" onClick={() => send({ type: "prev" })}>
          <SkipBack className="size-5" />
        </PadButton>
        <PadButton label="Back 10 seconds" onClick={() => send({ type: "seek", payload: { seconds: -10 } })}>
          <RotateCcw className="size-5" />
        </PadButton>
        <button
          aria-label="Play or pause"
          onClick={() => send({ type: "playpause" })}
          className="rounded-2xl bg-surface-2 py-5 active:scale-95"
        >
          {np?.paused === false ? (
            <Pause className="mx-auto size-7" />
          ) : (
            <Play className="mx-auto size-7 fill-current" />
          )}
        </button>
        <PadButton label="Forward 10 seconds" onClick={() => send({ type: "seek", payload: { seconds: 10 } })}>
          <RotateCw className="size-5" />
        </PadButton>
        <PadButton label="Next" onClick={() => send({ type: "next" })}>
          <SkipForward className="size-5" />
        </PadButton>
      </div>

      <div className="mx-auto grid w-full max-w-xs grid-cols-4 gap-3">
        <PadButton label="Volume down" onClick={() => send({ type: "volume", payload: { delta: -0.1 } })}>
          <VolumeX className="size-5" />
        </PadButton>
        <PadButton label="Volume up" onClick={() => send({ type: "volume", payload: { delta: 0.1 } })}>
          <Volume2 className="size-5" />
        </PadButton>
        <PadButton label="Subtitles" onClick={() => send({ type: "subtitles" })}>
          <Subtitles className="size-5" />
        </PadButton>
        <PadButton label="Fullscreen" onClick={() => send({ type: "fullscreen" })}>
          <Power className="size-5" />
        </PadButton>
      </div>

      <Button
        variant="ghost"
        className="mx-auto mt-auto text-muted-foreground"
        onClick={() => send({ type: "disconnect" })}
      >
        Disconnect
      </Button>
    </div>
  );
}

function PadButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center rounded-2xl bg-surface py-5 text-foreground transition-transform active:scale-95"
    >
      {children}
    </button>
  );
}
