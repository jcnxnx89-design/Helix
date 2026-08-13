import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { tmdbRequest } from "./tmdb.server";
import {
  toDetail,
  toEpisode,
  toSummary,
  type RawItem,
  type RawDetail,
  type RawEpisode,
} from "./tmdb-map";
import type { EpisodeInfo, MediaDetail, MediaSummary } from "./types";

const idInput = z.object({ id: z.number() });

async function list(path: string, params?: Record<string, string>): Promise<MediaSummary[]> {
  const data = await tmdbRequest<{ results?: RawItem[] }>(path, params);
  return (data.results ?? []).filter((r) => r.media_type !== "person").map(toSummary);
}

export const getTrending = createServerFn({ method: "GET" }).handler(async () =>
  list("/trending/all/week"),
);

export const getPopularMovies = createServerFn({ method: "GET" }).handler(async () =>
  list("/movie/popular"),
);

export const getTopRatedMovies = createServerFn({ method: "GET" }).handler(async () =>
  list("/movie/top_rated"),
);

export const getNowPlayingMovies = createServerFn({ method: "GET" }).handler(async () =>
  list("/movie/now_playing"),
);

export const getPopularShows = createServerFn({ method: "GET" }).handler(async () =>
  list("/tv/popular"),
);

export const getTopRatedShows = createServerFn({ method: "GET" }).handler(async () =>
  list("/tv/top_rated"),
);

export const getAiringShows = createServerFn({ method: "GET" }).handler(async () =>
  list("/tv/on_the_air"),
);

export const discover = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      type: z.enum(["movie", "tv"]),
      genre: z.string().optional(),
      year: z.string().optional(),
      minRating: z.number().optional(),
      sort: z.string().optional(),
      page: z.number().optional(),
    }),
  )
  .handler(async ({ data }): Promise<MediaSummary[]> => {
    const params: Record<string, string> = {
      sort_by: data.sort ?? "popularity.desc",
      page: String(Math.max(1, Math.min(500, data.page ?? 1))),
    };
    if (data.genre) params["with_genres"] = data.genre;
    if (data.minRating) params["vote_average.gte"] = String(data.minRating);
    if (data.year) {
      params[data.type === "movie" ? "primary_release_year" : "first_air_date_year"] = data.year;
    }
    return list(`/discover/${data.type}`, params);
  });

export const getGenres = createServerFn({ method: "GET" })
  .inputValidator(z.object({ type: z.enum(["movie", "tv"]) }))
  .handler(async ({ data }) => {
    const res = await tmdbRequest<{ genres?: { id: number; name: string }[] }>(
      `/genre/${data.type}/list`,
    );
    return res.genres ?? [];
  });

export const getMovie = createServerFn({ method: "GET" })
  .inputValidator(idInput)
  .handler(async ({ data }): Promise<MediaDetail> => {
    const raw = await tmdbRequest<RawDetail>(`/movie/${data.id}`, {
      append_to_response: "credits,videos,external_ids",
    });
    return toDetail(raw, "movie");
  });

export const getShow = createServerFn({ method: "GET" })
  .inputValidator(idInput)
  .handler(async ({ data }): Promise<MediaDetail> => {
    const raw = await tmdbRequest<RawDetail>(`/tv/${data.id}`, {
      append_to_response: "credits,videos,external_ids",
    });
    return toDetail(raw, "tv");
  });

export const getSeason = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.number(), season: z.number() }))
  .handler(async ({ data }): Promise<EpisodeInfo[]> => {
    const raw = await tmdbRequest<{ episodes?: RawEpisode[] }>(
      `/tv/${data.id}/season/${data.season}`,
    );
    return (raw.episodes ?? []).map(toEpisode);
  });

export const getRecommendations = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.number(), type: z.enum(["movie", "tv"]) }))
  .handler(async ({ data }) => {
    const results = await list(`/${data.type}/${data.id}/recommendations`);
    return results.map((r) => ({ ...r, type: data.type }));
  });

export const searchMedia = createServerFn({ method: "GET" })
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data }) => {
    const query = data.query.trim().slice(0, 120);
    if (!query) return { movies: [], shows: [], people: [] };
    const res = await tmdbRequest<{ results?: RawItem[] }>("/search/multi", {
      query,
      include_adult: "false",
    });
    const results = res.results ?? [];
    const people = results
      .filter((r) => r.media_type === "person")
      .slice(0, 12)
      .map((p) => ({
        id: p.id,
        name: p.name ?? "",
        profile: p.profile_path ?? null,
        knownFor: (p.known_for ?? []).map(toSummary),
      }));
    const media = results.filter((r) => r.media_type !== "person").map(toSummary);
    return {
      movies: media.filter((m) => m.type === "movie"),
      shows: media.filter((m) => m.type === "tv"),
      people,
    };
  });
