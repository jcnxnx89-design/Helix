import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { getNowPlaying, getPlayer } from "@/lib/player-bridge";
import { recordRemoteSession } from "@/lib/profile-store";
import { createPairing, endPairing } from "@/lib/remote.functions";
import { joinRemoteChannel, type RemoteBus, type RemoteCommand } from "@/lib/remote-bus";
import { activateFocused, moveFocus, type Direction } from "@/lib/spatial-nav";

export type PairStatus = "idle" | "starting" | "waiting" | "connected" | "error";

interface RemoteHostValue {
  status: PairStatus;
  code: string | null;
  sessionId: string | null;
  expiresAt: number | null;
  error: string | null;
  pairUrl: string | null;
  startPairing: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const RemoteHostContext = createContext<RemoteHostValue | null>(null);

export function useRemoteHost(): RemoteHostValue {
  const ctx = useContext(RemoteHostContext);
  if (!ctx) throw new Error("useRemoteHost must be used inside RemoteHostProvider");
  return ctx;
}

export function RemoteHostProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<PairStatus>("idle");
  const [code, setCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busRef = useRef<RemoteBus | null>(null);

  const handleCommand = useCallback(
    (cmd: RemoteCommand) => {
      const p = getPlayer();
      const payload = cmd.payload ?? {};
      switch (cmd.type) {
        case "dpad":
          moveFocus(payload["dir"] as Direction);
          break;
        case "ok":
          activateFocused();
          break;
        case "back":
          router.history.back();
          break;
        case "home":
          void router.navigate({ to: "/" });
          break;
        case "menu":
          void router.navigate({ to: "/settings" });
          break;
        case "playpause":
          p?.playPause();
          break;
        case "seek":
          p?.seekBy(Number(payload["seconds"] ?? 10));
          break;
        case "seekTo":
          p?.seekTo(Number(payload["seconds"] ?? 0));
          break;
        case "volume":
          p?.adjustVolume(Number(payload["delta"] ?? 0.1));
          break;
        case "setVolume":
          p?.setVolume(Number(payload["value"] ?? 1));
          break;
        case "mute":
          p?.toggleMute();
          break;
        case "next":
          p?.nextEpisode();
          break;
        case "prev":
          p?.prevEpisode();
          break;
        case "fullscreen":
          p?.toggleFullscreen();
          break;
        case "subtitles":
          p?.toggleSubtitles();
          break;
        case "navigate":
          void router.navigate({ to: String(payload["to"] ?? "/") });
          break;
        case "search":
          void router.navigate({
            to: "/search",
            search: { q: String(payload["query"] ?? ""), type: "all" },
          });
          break;
        case "play": {
          const type = payload["type"] === "tv" ? "tv" : "movie";
          const id = Number(payload["id"]);
          if (!id) break;
          void router.navigate({
            to: "/watch/$type/$id",
            params: { type, id: String(id) },
            search: {
              season: payload["season"] != null ? Number(payload["season"]) : undefined,
              episode: payload["episode"] != null ? Number(payload["episode"]) : undefined,
              t: undefined,
            },
          });
          break;
        }
        case "disconnect":
          void disconnect();
          break;
        case "requestState":
          break;
      }
      broadcastState();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  const broadcastState = useCallback(() => {
    const bus = busRef.current;
    if (!bus) return;
    bus.sendState({
      route: typeof window !== "undefined" ? window.location.pathname : "/",
      title: "Helix",
      nowPlaying: getNowPlaying(),
    });
  }, []);

  const startPairing = useCallback(async () => {
    setStatus("starting");
    setError(null);
    try {
      const result = await createPairing();
      console.log("Pairing created:", result);
      setCode(result.code);
      setSessionId(result.sessionId);
      setExpiresAt(new Date(result.expiresAt).getTime());
      busRef.current?.leave();
      busRef.current = joinRemoteChannel(result.sessionId, "host", {
        onCommand: handleCommand,
        onPeerJoin: () => {
          setStatus("connected");
          recordRemoteSession(result.sessionId);
          toast.success("Phone connected");
          broadcastState();
        },
        onPeerLeave: () => {
          setStatus("waiting");
          toast("Remote disconnected");
        },
      });
      setStatus("waiting");
    } catch (err) {
      console.error("Pairing error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Pairing failed. Check your connection and try again.");
    }
  }, [handleCommand, broadcastState]);

  const disconnect = useCallback(async () => {
    busRef.current?.leave();
    busRef.current = null;
    if (sessionId) {
      try {
        await endPairing({ data: { sessionId } });
      } catch {
        /* session already gone */
      }
    }
    setSessionId(null);
    setCode(null);
    setExpiresAt(null);
    setStatus("idle");
  }, [sessionId]);

  useEffect(() => {
    if (status !== "connected") return;
    const interval = window.setInterval(broadcastState, 1000);
    return () => window.clearInterval(interval);
  }, [status, broadcastState]);

  useEffect(() => {
    return () => busRef.current?.leave();
  }, []);

  const pairUrl = useMemo(() => {
    if (!code || typeof window === "undefined") return null;
    return `${window.location.origin}/remote/${code}`;
  }, [code]);

  const value = useMemo(
    () => ({ status, code, sessionId, expiresAt, error, pairUrl, startPairing, disconnect }),
    [status, code, sessionId, expiresAt, error, pairUrl, startPairing, disconnect],
  );

  return <RemoteHostContext.Provider value={value}>{children}</RemoteHostContext.Provider>;
}
