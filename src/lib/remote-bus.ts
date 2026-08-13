import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type RemoteCommandType =
  | "dpad"
  | "ok"
  | "back"
  | "home"
  | "menu"
  | "playpause"
  | "seek"
  | "seekTo"
  | "volume"
  | "setVolume"
  | "mute"
  | "next"
  | "prev"
  | "fullscreen"
  | "subtitles"
  | "navigate"
  | "play"
  | "search"
  | "requestState"
  | "disconnect";

export interface RemoteCommand {
  type: RemoteCommandType;
  payload?: Record<string, unknown>;
}

export interface HostState {
  route: string;
  title: string;
  phoneName?: string;
  nowPlaying: null | {
    title: string;
    subtitle: string | null;
    poster: string | null;
    position: number;
    duration: number;
    paused: boolean;
    volume: number;
    muted: boolean;
    subtitlesOn: boolean;
  };
}

export function channelName(sessionId: string): string {
  return `helix-remote-${sessionId}`;
}

interface BusHandlers {
  onCommand?: (cmd: RemoteCommand) => void;
  onState?: (state: HostState) => void;
  onPeerJoin?: () => void;
  onPeerLeave?: () => void;
  onSubscribed?: () => void;
}

export interface RemoteBus {
  sendCommand: (cmd: RemoteCommand) => void;
  sendState: (state: HostState) => void;
  leave: () => void;
  channel: RealtimeChannel;
}

export function joinRemoteChannel(
  sessionId: string,
  role: "host" | "remote",
  handlers: BusHandlers,
): RemoteBus {
  const channel = supabase.channel(channelName(sessionId), {
    config: { broadcast: { self: false }, presence: { key: role } },
  });

  channel
    .on("broadcast", { event: "cmd" }, ({ payload }) => {
      handlers.onCommand?.(payload as RemoteCommand);
    })
    .on("broadcast", { event: "state" }, ({ payload }) => {
      handlers.onState?.(payload as HostState);
    })
    .on("presence", { event: "join" }, ({ key }) => {
      if (key !== role) handlers.onPeerJoin?.();
    })
    .on("presence", { event: "leave" }, ({ key }) => {
      if (key !== role) handlers.onPeerLeave?.();
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        void channel.track({ role, at: Date.now() });
        handlers.onSubscribed?.();
        const peers = Object.keys(channel.presenceState());
        if (peers.some((k) => k !== role)) handlers.onPeerJoin?.();
      }
    });

  return {
    channel,
    sendCommand: (cmd) => {
      void channel.send({ type: "broadcast", event: "cmd", payload: cmd });
    },
    sendState: (state) => {
      void channel.send({ type: "broadcast", event: "state", payload: state });
    },
    leave: () => {
      void supabase.removeChannel(channel);
    },
  };
}
