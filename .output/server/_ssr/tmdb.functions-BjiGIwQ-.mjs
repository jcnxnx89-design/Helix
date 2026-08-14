import { n as createServerFn } from "./server-D4-2jtEm.mjs";
import { a as enumType, c as stringType, o as numberType, s as objectType } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { t as createServerRpc } from "./createServerRpc-PeZKVqZb.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/tmdb.functions-BjiGIwQ-.js
var BASE = "https://api.themoviedb.org/3";
var MetadataError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "MetadataError";
	}
};
/**
* Calls the TMDB metadata API. Supports both v4 read-access tokens (Bearer)
* and classic v3 API keys. The key is read per-request: env is injected at
* request time on the edge runtime.
*/
async function tmdbRequest(path, params = {}) {
	const key = processModule.env["TMDB_API_KEY"];
	if (!key) throw new MetadataError("The metadata service is not configured.");
	const url = new URL(BASE + path);
	url.searchParams.set("language", "en-US");
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	const headers = { accept: "application/json" };
	if (key.length > 60 || key.startsWith("ey")) headers["Authorization"] = `Bearer ${key}`;
	else url.searchParams.set("api_key", key);
	let response;
	try {
		response = await fetch(url.toString(), { headers });
	} catch {
		throw new MetadataError("Could not reach the metadata service.");
	}
	if (!response.ok) {
		if (response.status === 401) throw new MetadataError("The metadata API key was rejected.");
		if (response.status === 404) throw new MetadataError("That title could not be found.");
		if (response.status === 429) throw new MetadataError("Too many requests — try again shortly.");
		throw new MetadataError("The metadata service is temporarily unavailable.");
	}
	return await response.json();
}
var GENRE_NAMES = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Sci-Fi",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	37: "Western",
	10759: "Action & Adventure",
	10762: "Kids",
	10763: "News",
	10764: "Reality",
	10765: "Sci-Fi & Fantasy",
	10766: "Soap",
	10767: "Talk",
	10768: "War & Politics"
};
function img(path, size = "w500") {
	return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
function genreNames(raw) {
	if (raw.genres?.length) return raw.genres.map((g) => g.name);
	return (raw.genre_ids ?? []).map((id) => GENRE_NAMES[id]).filter((g) => Boolean(g));
}
function toSummary(raw) {
	const type = raw.media_type === "tv" || !raw.title && !!raw.name ? "tv" : "movie";
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
		genres: genreNames(raw)
	};
}
function toDetail(raw, type) {
	const summary = toSummary({
		...raw,
		media_type: type
	});
	const cast = (raw.credits?.cast ?? []).slice(0, 20).map((c) => ({
		id: c.id,
		name: c.name,
		role: c.character ?? "",
		profile: img(c.profile_path, "w185")
	}));
	const crew = (raw.credits?.crew ?? []).filter((c) => [
		"Director",
		"Writer",
		"Screenplay",
		"Creator"
	].includes(c.job ?? "")).slice(0, 10).map((c) => ({
		id: c.id,
		name: c.name,
		role: c.job ?? "",
		profile: img(c.profile_path, "w185")
	}));
	const trailer = (raw.videos?.results ?? []).find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
	return {
		...summary,
		originalTitle: raw.original_title ?? raw.original_name ?? summary.title,
		runtime: raw.runtime ?? null,
		tagline: raw.tagline ?? "",
		status: raw.status ?? "",
		cast,
		crew,
		trailerKey: trailer?.key ?? null,
		externalIds: raw.external_ids ?? {},
		seasons: (raw.seasons ?? []).filter((s) => s.season_number > 0).map((s) => ({
			seasonNumber: s.season_number,
			name: s.name,
			episodeCount: s.episode_count,
			poster: img(s.poster_path, "w342"),
			overview: s.overview,
			airDate: s.air_date
		})),
		episodeRunTime: raw.episode_run_time?.[0] ?? null,
		numberOfSeasons: raw.number_of_seasons ?? 0,
		numberOfEpisodes: raw.number_of_episodes ?? 0
	};
}
function toEpisode(raw) {
	return {
		id: raw.id,
		seasonNumber: raw.season_number,
		episodeNumber: raw.episode_number,
		title: raw.name ?? `Episode ${raw.episode_number}`,
		overview: raw.overview ?? "",
		thumbnail: img(raw.still_path, "w500"),
		runtime: raw.runtime ?? null,
		airDate: raw.air_date ?? null,
		rating: Math.round((raw.vote_average ?? 0) * 10) / 10
	};
}
var idInput = objectType({ id: numberType() });
async function list(path, params) {
	return ((await tmdbRequest(path, params)).results ?? []).filter((r) => r.media_type !== "person").map(toSummary);
}
var getTrending_createServerFn_handler = createServerRpc({
	id: "77d90f9fc38890a4f6d20405d7a31e99e4e9248bf892cecaa7ecfea8b8ef06bf",
	name: "getTrending",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getTrending.__executeServer(opts));
var getTrending = createServerFn({ method: "GET" }).handler(getTrending_createServerFn_handler, async () => list("/trending/all/week"));
var getPopularMovies_createServerFn_handler = createServerRpc({
	id: "e8a337af69ce24b98a35c9a5c786e4a264a2a1eaacc400bea05e1e0e0ed883e1",
	name: "getPopularMovies",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getPopularMovies.__executeServer(opts));
var getPopularMovies = createServerFn({ method: "GET" }).handler(getPopularMovies_createServerFn_handler, async () => list("/movie/popular"));
var getTopRatedMovies_createServerFn_handler = createServerRpc({
	id: "c579d9df7f0798d5de4c39174a5ddabc1357565e0f8b7dcbf53563e652328365",
	name: "getTopRatedMovies",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getTopRatedMovies.__executeServer(opts));
var getTopRatedMovies = createServerFn({ method: "GET" }).handler(getTopRatedMovies_createServerFn_handler, async () => list("/movie/top_rated"));
var getNowPlayingMovies_createServerFn_handler = createServerRpc({
	id: "35b9365597b830e04a0ca1baeed6daab63be3b6b7446b2b8a16483edaf0ae0c8",
	name: "getNowPlayingMovies",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getNowPlayingMovies.__executeServer(opts));
var getNowPlayingMovies = createServerFn({ method: "GET" }).handler(getNowPlayingMovies_createServerFn_handler, async () => list("/movie/now_playing"));
var getPopularShows_createServerFn_handler = createServerRpc({
	id: "784d18509f5758260386cedead664b7b0ae3970696a9998828604ea0ab6b5bbb",
	name: "getPopularShows",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getPopularShows.__executeServer(opts));
var getPopularShows = createServerFn({ method: "GET" }).handler(getPopularShows_createServerFn_handler, async () => list("/tv/popular"));
var getTopRatedShows_createServerFn_handler = createServerRpc({
	id: "8cb8ea9a9a63e5dcb86418b558560a3e43b6d8b6aeacc4d31d64ab4adc694d43",
	name: "getTopRatedShows",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getTopRatedShows.__executeServer(opts));
var getTopRatedShows = createServerFn({ method: "GET" }).handler(getTopRatedShows_createServerFn_handler, async () => list("/tv/top_rated"));
var getAiringShows_createServerFn_handler = createServerRpc({
	id: "8f641421d7e331477d95e0497dafd36c55a82a351938a2ce7b50aed3076c3061",
	name: "getAiringShows",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getAiringShows.__executeServer(opts));
var getAiringShows = createServerFn({ method: "GET" }).handler(getAiringShows_createServerFn_handler, async () => list("/tv/on_the_air"));
var discover_createServerFn_handler = createServerRpc({
	id: "25fa7e666e5a3afee8e19fef04b92df9ac82a750803979fbc88e2a8b05fc57dd",
	name: "discover",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => discover.__executeServer(opts));
var discover = createServerFn({ method: "GET" }).inputValidator(objectType({
	type: enumType(["movie", "tv"]),
	genre: stringType().optional(),
	year: stringType().optional(),
	minRating: numberType().optional(),
	sort: stringType().optional(),
	page: numberType().optional()
})).handler(discover_createServerFn_handler, async ({ data }) => {
	const params = {
		sort_by: data.sort ?? "popularity.desc",
		page: String(Math.max(1, Math.min(500, data.page ?? 1)))
	};
	if (data.genre) params["with_genres"] = data.genre;
	if (data.minRating) params["vote_average.gte"] = String(data.minRating);
	if (data.year) params[data.type === "movie" ? "primary_release_year" : "first_air_date_year"] = data.year;
	return list(`/discover/${data.type}`, params);
});
var getGenres_createServerFn_handler = createServerRpc({
	id: "ebf876321ff9fb76ab5e3e0145e843f93b8696f9dada1feaafa0882cc7a7fdef",
	name: "getGenres",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getGenres.__executeServer(opts));
var getGenres = createServerFn({ method: "GET" }).inputValidator(objectType({ type: enumType(["movie", "tv"]) })).handler(getGenres_createServerFn_handler, async ({ data }) => {
	return (await tmdbRequest(`/genre/${data.type}/list`)).genres ?? [];
});
var getMovie_createServerFn_handler = createServerRpc({
	id: "22b060e2a8b5a413622ca9d52229ff13f35c2922a920dadfca7da6e01686acfd",
	name: "getMovie",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getMovie.__executeServer(opts));
var getMovie = createServerFn({ method: "GET" }).inputValidator(idInput).handler(getMovie_createServerFn_handler, async ({ data }) => {
	return toDetail(await tmdbRequest(`/movie/${data.id}`, { append_to_response: "credits,videos,external_ids" }), "movie");
});
var getShow_createServerFn_handler = createServerRpc({
	id: "01455c05c1f66976a73244e9b67617a7302e999eac312db5f6451b06908f0ee0",
	name: "getShow",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getShow.__executeServer(opts));
var getShow = createServerFn({ method: "GET" }).inputValidator(idInput).handler(getShow_createServerFn_handler, async ({ data }) => {
	return toDetail(await tmdbRequest(`/tv/${data.id}`, { append_to_response: "credits,videos,external_ids" }), "tv");
});
var getSeason_createServerFn_handler = createServerRpc({
	id: "a88edc453082894d652124c430c7a3d066602e628a6fac62288f02cf51c49f58",
	name: "getSeason",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getSeason.__executeServer(opts));
var getSeason = createServerFn({ method: "GET" }).inputValidator(objectType({
	id: numberType(),
	season: numberType()
})).handler(getSeason_createServerFn_handler, async ({ data }) => {
	return ((await tmdbRequest(`/tv/${data.id}/season/${data.season}`)).episodes ?? []).map(toEpisode);
});
var getRecommendations_createServerFn_handler = createServerRpc({
	id: "60377b0b957e359f55e5c9e6f48d2f5c6375bd2adfcc645f40f59d841be7b6df",
	name: "getRecommendations",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => getRecommendations.__executeServer(opts));
var getRecommendations = createServerFn({ method: "GET" }).inputValidator(objectType({
	id: numberType(),
	type: enumType(["movie", "tv"])
})).handler(getRecommendations_createServerFn_handler, async ({ data }) => {
	return (await list(`/${data.type}/${data.id}/recommendations`)).map((r) => ({
		...r,
		type: data.type
	}));
});
var searchMedia_createServerFn_handler = createServerRpc({
	id: "4554bac009cb7b0dd4f23b35e6381cde80f8891f6cd2c529ecb25d91e64f42ba",
	name: "searchMedia",
	filename: "src/lib/tmdb.functions.ts"
}, (opts) => searchMedia.__executeServer(opts));
var searchMedia = createServerFn({ method: "GET" }).inputValidator(objectType({ query: stringType() })).handler(searchMedia_createServerFn_handler, async ({ data }) => {
	const query = data.query.trim().slice(0, 120);
	if (!query) return {
		movies: [],
		shows: [],
		people: []
	};
	const results = (await tmdbRequest("/search/multi", {
		query,
		include_adult: "false"
	})).results ?? [];
	const people = results.filter((r) => r.media_type === "person").slice(0, 12).map((p) => ({
		id: p.id,
		name: p.name ?? "",
		profile: p.profile_path ?? null,
		knownFor: (p.known_for ?? []).map(toSummary)
	}));
	const media = results.filter((r) => r.media_type !== "person").map(toSummary);
	return {
		movies: media.filter((m) => m.type === "movie"),
		shows: media.filter((m) => m.type === "tv"),
		people
	};
});
//#endregion
export { discover_createServerFn_handler, getAiringShows_createServerFn_handler, getGenres_createServerFn_handler, getMovie_createServerFn_handler, getNowPlayingMovies_createServerFn_handler, getPopularMovies_createServerFn_handler, getPopularShows_createServerFn_handler, getRecommendations_createServerFn_handler, getSeason_createServerFn_handler, getShow_createServerFn_handler, getTopRatedMovies_createServerFn_handler, getTopRatedShows_createServerFn_handler, getTrending_createServerFn_handler, searchMedia_createServerFn_handler };
