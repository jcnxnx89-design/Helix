import { useSyncExternalStore } from "react";

import { idbGet, idbSet } from "./idb";
import {
  DEFAULT_PREFERENCES,
  positionKey,
  type HistoryEntry,
  type ListEntry,
  type MediaType,
  type PlaybackPosition,
  type Preferences,
  type UserProfile,
  type VideoSource,
} from "./types";

const ID_KEY = "helix.userId";
const PREFS_KEY = "helix.preferences";
const PROFILE_KEY = "profile";
const MAX_HISTORY = 400;

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined") crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function emptyProfile(): UserProfile {
  return {
    userId: "",
    createdAt: 0,
    version: 1,
    preferences: { ...DEFAULT_PREFERENCES },
    playbackPositions: {},
    watchHistory: [],
    myList: [],
    recentlyViewed: [],
    completedMovies: [],
    completedEpisodes: [],
    deviceSources: [],
    remoteSessions: [],
  };
}

let state: UserProfile = emptyProfile();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ID_KEY, state.userId);
    localStorage.setItem(PREFS_KEY, JSON.stringify(state.preferences));
  } catch {
    /* storage may be unavailable */
  }
  void idbSet(PROFILE_KEY, state);
}

function applyAppearance(prefs: Preferences) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset["reduceMotion"] = String(prefs.reduceMotion || !prefs.animations);
  document.documentElement.dataset["largeText"] = String(prefs.largeText);
}

export async function hydrateProfile(): Promise<UserProfile> {
  if (hydrated) return state;
  hydrated = true;
  const stored = await idbGet<UserProfile>(PROFILE_KEY);
  let userId = "";
  try {
    userId = localStorage.getItem(ID_KEY) ?? "";
  } catch {
    /* ignore */
  }
  const base = stored ?? emptyProfile();
  state = {
    ...emptyProfile(),
    ...base,
    preferences: { ...DEFAULT_PREFERENCES, ...(base.preferences ?? {}) },
    userId: base.userId || userId || randomId(),
    createdAt: base.createdAt || Date.now(),
  };
  applyAppearance(state.preferences);
  persist();
  emit();
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot = emptyProfile();

export function useProfile(): UserProfile {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

export function getProfile(): UserProfile {
  return state;
}

export function isHydrated(): boolean {
  return hydrated && state.userId !== "";
}

/* ------------------------------ mutations ------------------------------ */

export function updatePreferences(patch: Partial<Preferences>) {
  state.preferences = { ...state.preferences, ...patch };
  applyAppearance(state.preferences);
  persist();
  emit();
}

export interface ProgressInput {
  mediaType: MediaType;
  mediaId: number;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
  position: number;
  duration: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  episodeTitle?: string | null;
}

export function saveProgress(input: ProgressInput) {
  if (!input.duration || input.duration < 1) return;
  const key = positionKey(input.mediaType, input.mediaId, input.seasonNumber, input.episodeNumber);
  const percentage = Math.min(100, (input.position / input.duration) * 100);
  const completed = percentage >= state.preferences.completionThreshold;
  const entry: PlaybackPosition = {
    key,
    mediaType: input.mediaType,
    mediaId: input.mediaId,
    seasonNumber: input.seasonNumber ?? null,
    episodeNumber: input.episodeNumber ?? null,
    position: input.position,
    duration: input.duration,
    percentage,
    lastWatched: Date.now(),
    completed,
    title: input.title,
    poster: input.poster,
    backdrop: input.backdrop,
    episodeTitle: input.episodeTitle ?? null,
  };
  state.playbackPositions = { ...state.playbackPositions, [key]: entry };

  const history: HistoryEntry[] = [
    { ...entry, watchedAt: Date.now() },
    ...state.watchHistory.filter((h) => h.key !== key),
  ].slice(0, MAX_HISTORY);
  state.watchHistory = history;

  if (completed) {
    if (input.mediaType === "movie" && !state.completedMovies.includes(input.mediaId)) {
      state.completedMovies = [...state.completedMovies, input.mediaId];
    }
    if (input.mediaType === "tv" && !state.completedEpisodes.includes(key)) {
      state.completedEpisodes = [...state.completedEpisodes, key];
    }
  }
  persist();
  emit();
}

export function getPosition(
  type: MediaType,
  id: number,
  season?: number | null,
  episode?: number | null,
): PlaybackPosition | undefined {
  return state.playbackPositions[positionKey(type, id, season, episode)];
}

export function continueWatching(): PlaybackPosition[] {
  return Object.values(state.playbackPositions)
    .filter((p) => !p.completed && p.percentage > 1)
    .sort((a, b) => b.lastWatched - a.lastWatched);
}

export function removeFromContinue(key: string) {
  const next = { ...state.playbackPositions };
  delete next[key];
  state.playbackPositions = next;
  persist();
  emit();
}

export function clearHistoryEntry(key: string) {
  state.watchHistory = state.watchHistory.filter((h) => h.key !== key);
  persist();
  emit();
}

export function clearHistory() {
  state.watchHistory = [];
  persist();
  emit();
}

export function clearPositions() {
  state.playbackPositions = {};
  state.completedMovies = [];
  state.completedEpisodes = [];
  persist();
  emit();
}

export function toggleMyList(entry: Omit<ListEntry, "addedAt">): boolean {
  const exists = state.myList.some((m) => m.id === entry.id && m.type === entry.type);
  state.myList = exists
    ? state.myList.filter((m) => !(m.id === entry.id && m.type === entry.type))
    : [{ ...entry, addedAt: Date.now() }, ...state.myList];
  persist();
  emit();
  return !exists;
}

export function inMyList(id: number, type: MediaType): boolean {
  return state.myList.some((m) => m.id === id && m.type === type);
}

export function clearMyList() {
  state.myList = [];
  persist();
  emit();
}

export function trackRecentlyViewed(entry: Omit<ListEntry, "addedAt">) {
  const filtered = state.recentlyViewed.filter((r) => !(r.id === entry.id && r.type === entry.type));
  state.recentlyViewed = [{ ...entry, addedAt: Date.now() }, ...filtered].slice(0, 30);
  persist();
  emit();
}

export function addDeviceSource(source: VideoSource) {
  state.deviceSources = [source, ...state.deviceSources];
  persist();
  emit();
}

export function removeDeviceSource(id: string) {
  state.deviceSources = state.deviceSources.filter((s) => s.id !== id);
  persist();
  emit();
}

export function recordRemoteSession(id: string) {
  state.remoteSessions = [{ id, pairedAt: Date.now() }, ...state.remoteSessions].slice(0, 10);
  persist();
  emit();
}

export function clearRemoteSessions() {
  state.remoteSessions = [];
  persist();
  emit();
}

export function resetProfile() {
  const prefs = { ...DEFAULT_PREFERENCES };
  state = { ...emptyProfile(), userId: randomId(), createdAt: Date.now(), preferences: prefs };
  applyAppearance(prefs);
  persist();
  emit();
}

export function exportProfile(): string {
  const { userId, createdAt, preferences, playbackPositions, watchHistory, myList, recentlyViewed, completedMovies, completedEpisodes, deviceSources } = state;
  return JSON.stringify(
    {
      app: "helix",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile: {
        userId,
        createdAt,
        preferences,
        playbackPositions,
        watchHistory,
        myList,
        recentlyViewed,
        completedMovies,
        completedEpisodes,
        deviceSources: deviceSources.filter((s) => !s.url.startsWith("blob:")),
      },
    },
    null,
    2,
  );
}

export function importProfile(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json) as { profile?: Partial<UserProfile> };
    const incoming = parsed.profile;
    if (!incoming || typeof incoming !== "object") return { ok: false, error: "Unrecognised file format." };
    state = {
      ...emptyProfile(),
      ...state,
      ...incoming,
      preferences: { ...DEFAULT_PREFERENCES, ...(incoming.preferences ?? {}) },
      userId: state.userId || incoming.userId || randomId(),
      createdAt: incoming.createdAt || Date.now(),
    };
    applyAppearance(state.preferences);
    persist();
    emit();
    return { ok: true };
  } catch {
    return { ok: false, error: "That file could not be read as a Helix profile." };
  }
}
