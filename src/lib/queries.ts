import { queryOptions } from "@tanstack/react-query";

import { getSources } from "./sources.functions";
import {
  discover,
  getAiringShows,
  getGenres,
  getMovie,
  getNowPlayingMovies,
  getPopularMovies,
  getPopularShows,
  getRecommendations,
  getSeason,
  getShow,
  getTopRatedMovies,
  getTopRatedShows,
  getTrending,
  searchMedia,
} from "./tmdb.functions";
import type { MediaType } from "./types";

const HOUR = 1000 * 60 * 60;

export const trendingQuery = () =>
  queryOptions({ queryKey: ["trending"], queryFn: () => getTrending(), staleTime: HOUR });

export const popularMoviesQuery = () =>
  queryOptions({ queryKey: ["movies", "popular"], queryFn: () => getPopularMovies(), staleTime: HOUR });

export const topRatedMoviesQuery = () =>
  queryOptions({ queryKey: ["movies", "top"], queryFn: () => getTopRatedMovies(), staleTime: HOUR });

export const nowPlayingMoviesQuery = () =>
  queryOptions({ queryKey: ["movies", "now"], queryFn: () => getNowPlayingMovies(), staleTime: HOUR });

export const popularShowsQuery = () =>
  queryOptions({ queryKey: ["shows", "popular"], queryFn: () => getPopularShows(), staleTime: HOUR });

export const topRatedShowsQuery = () =>
  queryOptions({ queryKey: ["shows", "top"], queryFn: () => getTopRatedShows(), staleTime: HOUR });

export const airingShowsQuery = () =>
  queryOptions({ queryKey: ["shows", "airing"], queryFn: () => getAiringShows(), staleTime: HOUR });

export const genresQuery = (type: MediaType) =>
  queryOptions({
    queryKey: ["genres", type],
    queryFn: () => getGenres({ data: { type } }),
    staleTime: 24 * HOUR,
  });

export const discoverQuery = (input: {
  type: MediaType;
  genre?: string;
  year?: string;
  minRating?: number;
  sort?: string;
  page?: number;
}) =>
  queryOptions({
    queryKey: ["discover", input],
    queryFn: () => discover({ data: input }),
    staleTime: HOUR,
  });

export const movieQuery = (id: number) =>
  queryOptions({ queryKey: ["movie", id], queryFn: () => getMovie({ data: { id } }), staleTime: HOUR });

export const showQuery = (id: number) =>
  queryOptions({ queryKey: ["show", id], queryFn: () => getShow({ data: { id } }), staleTime: HOUR });

export const seasonQuery = (id: number, season: number) =>
  queryOptions({
    queryKey: ["season", id, season],
    queryFn: () => getSeason({ data: { id, season } }),
    staleTime: HOUR,
  });

export const recommendationsQuery = (id: number, type: MediaType) =>
  queryOptions({
    queryKey: ["recommendations", type, id],
    queryFn: () => getRecommendations({ data: { id, type } }),
    staleTime: HOUR,
  });

export const searchQuery = (query: string) =>
  queryOptions({
    queryKey: ["search", query],
    queryFn: () => searchMedia({ data: { query } }),
    enabled: query.trim().length > 1,
    staleTime: 10 * 60 * 1000,
  });

export const sourcesQuery = (input: {
  mediaType: MediaType;
  metadataId: string;
  seasonNumber?: number | null;
  episodeNumber?: number | null;
}) =>
  queryOptions({
    queryKey: ["sources", input],
    queryFn: () => getSources({ data: input }),
    staleTime: 5 * 60 * 1000,
  });
