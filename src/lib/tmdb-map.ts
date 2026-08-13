import type { EpisodeInfo, MediaDetail, MediaSummary, MediaType, Person } from "./types";

export interface RawItem {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  known_for?: RawItem[];
}

export interface RawDetail extends RawItem {
  original_title?: string;
  original_name?: string;
  runtime?: number;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    overview: string;
    air_date: string | null;
  }[];
  credits?: {
    cast?: { id: number; name: string; character?: string; profile_path?: string | null }[];
    crew?: { id: number; name: string; job?: string; profile_path?: string | null }[];
  };
  videos?: { results?: { key: string; site: string; type: string; official?: boolean }[] };
  external_ids?: Record<string, string | null>;
}

export interface RawEpisode {
  id: number;
  season_number: number;
  episode_number: number;
  name?: string;
  overview?: string;
  still_path?: string | null;
  runtime?: number | null;
  air_date?: string | null;
  vote_average?: number;
}

const GENRE_NAMES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

export function img(path: string | null | undefined, size = "w500"): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

function genreNames(raw: RawItem): string[] {
  if (raw.genres?.length) return raw.genres.map((g) => g.name);
  return (raw.genre_ids ?? []).map((id) => GENRE_NAMES[id]).filter((g): g is string => Boolean(g));
}

export function toSummary(raw: RawItem): MediaSummary {
  const type: MediaType = raw.media_type === "tv" || (!raw.title && !!raw.name) ? "tv" : "movie";
  const date = raw.release_date || raw.first_air_date || "";
  return {
    id: raw.id,
    type,
    title: raw.title ?? raw.name ?? "Untitled",
    poster: img(raw.poster_path, "w500"),
    backdrop: img(raw.backdrop_path, "w1280"),
    overview: raw.overview ?? "",
    year: date ? date.slice(0, 4) : null,
    rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
    genres: genreNames(raw),
  };
}

export function toDetail(raw: RawDetail, type: MediaType): MediaDetail {
  const summary = toSummary({ ...raw, media_type: type });
  const cast: Person[] = (raw.credits?.cast ?? []).slice(0, 20).map((c) => ({
    id: c.id,
    name: c.name,
    role: c.character ?? "",
    profile: img(c.profile_path, "w185"),
  }));
  const crew: Person[] = (raw.credits?.crew ?? [])
    .filter((c) => ["Director", "Writer", "Screenplay", "Creator"].includes(c.job ?? ""))
    .slice(0, 10)
    .map((c) => ({ id: c.id, name: c.name, role: c.job ?? "", profile: img(c.profile_path, "w185") }));
  const trailer = (raw.videos?.results ?? []).find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );
  return {
    ...summary,
    originalTitle: raw.original_title ?? raw.original_name ?? summary.title,
    runtime: raw.runtime ?? null,
    tagline: raw.tagline ?? "",
    status: raw.status ?? "",
    cast,
    crew,
    trailerKey: trailer?.key ?? null,
    externalIds: (raw.external_ids ?? {}) as Record<string, string | null>,
    seasons: (raw.seasons ?? [])
      .filter((s) => s.season_number > 0)
      .map((s) => ({
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        poster: img(s.poster_path, "w342"),
        overview: s.overview,
        airDate: s.air_date,
      })),
    episodeRunTime: raw.episode_run_time?.[0] ?? null,
    numberOfSeasons: raw.number_of_seasons ?? 0,
    numberOfEpisodes: raw.number_of_episodes ?? 0,
  };
}

export function toEpisode(raw: RawEpisode): EpisodeInfo {
  return {
    id: raw.id,
    seasonNumber: raw.season_number,
    episodeNumber: raw.episode_number,
    title: raw.name ?? `Episode ${raw.episode_number}`,
    overview: raw.overview ?? "",
    thumbnail: img(raw.still_path, "w500"),
    runtime: raw.runtime ?? null,
    airDate: raw.air_date ?? null,
    rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
  };
}
