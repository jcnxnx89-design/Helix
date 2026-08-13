import type { HostState } from "./remote-bus";

export interface PlayerApi {
  playPause: () => void;
  seekBy: (seconds: number) => void;
  seekTo: (seconds: number) => void;
  adjustVolume: (delta: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  nextEpisode: () => void;
  prevEpisode: () => void;
  toggleFullscreen: () => void;
  toggleSubtitles: () => void;
}

let player: PlayerApi | null = null;
let nowPlaying: HostState["nowPlaying"] = null;
const listeners = new Set<() => void>();

export function registerPlayer(api: PlayerApi): () => void {
  player = api;
  return () => {
    if (player === api) player = null;
    nowPlaying = null;
    listeners.forEach((l) => l());
  };
}

export function getPlayer(): PlayerApi | null {
  return player;
}

export function publishNowPlaying(state: HostState["nowPlaying"]) {
  nowPlaying = state;
  listeners.forEach((l) => l());
}

export function getNowPlaying(): HostState["nowPlaying"] {
  return nowPlaying;
}

export function subscribeNowPlaying(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
