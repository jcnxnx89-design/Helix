export type MediaType = "movie" | "tv";

export interface MediaSummary {
  id: number;
  type: MediaType;
  title: string;
  poster: string | null;
  backdrop: string | null;
  overview: string;
  year: string | null;
  rating: number;
  genres: string[];
}

export interface Person {
  id: number;
  name: string;
  role: string;
  profile: string | null;
}

export interface SeasonSummary {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  poster: string | null;
  overview: string;
  airDate: string | null;
}

export interface EpisodeInfo {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  thumbnail: string | null;
  runtime: number | null;
  airDate: string | null;
  rating: number;
}

export interface MediaDetail extends MediaSummary {
  originalTitle: string;
  runtime: number | null;
  tagline: string;
  status: string;
  cast: Person[];
  crew: Person[];
  trailerKey: string | null;
  externalIds: Record<string, string | null>;
  seasons: SeasonSummary[];
  episodeRunTime: number | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
}

/** A playable, authorized source of video for a movie or episode. */
export type VideoSourceKind = "mp4" | "hls" | "dash" | "iframe" | "local";

export interface SubtitleTrack {
  label: string;
  lang: string;
  url: string;
}

export interface VideoSource {
  id: string;
  mediaId: string;
  mediaType: MediaType;
  seasonNumber: number | null;
  episodeNumber: number | null;
  name: string;
  kind: VideoSourceKind;
  url: string;
  mimeType: string | null;
  subtitles: SubtitleTrack[];
  enabled: boolean;
  origin: "library" | "device";
  authorizationStatus: "owner-authorized" | "device-local";
}

/* ---------- user state ---------- */

export interface PlaybackPosition {
  key: string;
  mediaType: MediaType;
  mediaId: number;
  seasonNumber: number | null;
  episodeNumber: number | null;
  position: number;
  duration: number;
  percentage: number;
  lastWatched: number;
  completed: boolean;
  title: string;
  poster: string | null;
  backdrop: string | null;
  episodeTitle: string | null;
}

export interface HistoryEntry extends PlaybackPosition {
  watchedAt: number;
}

export interface ListEntry {
  id: number;
  type: MediaType;
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string | null;
  rating: number;
  addedAt: number;
}

export interface Preferences {
  autoplay: boolean;
  autoplayNext: boolean;
  defaultQuality: "auto" | "1080p" | "720p" | "480p";
  subtitleLanguage: string;
  audioLanguage: string;
  skipIntro: boolean;
  resumePlayback: boolean;
  animations: boolean;
  reduceMotion: boolean;
  largeText: boolean;
  cardSize: "small" | "medium" | "large";
  volume: number;
  muted: boolean;
  subtitlesOn: boolean;
  playbackRate: number;
  completionThreshold: number;
}

export interface UserProfile {
  userId: string;
  createdAt: number;
  version: number;
  preferences: Preferences;
  playbackPositions: Record<string, PlaybackPosition>;
  watchHistory: HistoryEntry[];
  myList: ListEntry[];
  recentlyViewed: ListEntry[];
  completedMovies: number[];
  completedEpisodes: string[];
  deviceSources: VideoSource[];
  remoteSessions: { id: string; pairedAt: number }[];
}

export const DEFAULT_PREFERENCES: Preferences = {
  autoplay: true,
  autoplayNext: true,
  defaultQuality: "auto",
  subtitleLanguage: "en",
  audioLanguage: "en",
  skipIntro: true,
  resumePlayback: true,
  animations: true,
  reduceMotion: false,
  largeText: false,
  cardSize: "medium",
  volume: 1,
  muted: false,
  subtitlesOn: false,
  playbackRate: 1,
  completionThreshold: 90,
};

export function positionKey(
  type: MediaType,
  id: number,
  season?: number | null,
  episode?: number | null,
): string {
  return type === "tv" && season != null && episode != null
    ? `tv:${id}:s${season}e${episode}`
    : `${type}:${id}`;
}
