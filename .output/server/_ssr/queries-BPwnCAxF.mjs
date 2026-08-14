import { n as createServerFn } from "./server-D4-2jtEm.mjs";
import { E as createSsrRpc } from "./router-ChHaMAyj.mjs";
import { a as enumType, c as stringType, o as numberType, s as objectType } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { t as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { r as getSources } from "./sources.functions-BB9ryYGP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-BPwnCAxF.js
var idInput = objectType({ id: numberType() });
var getTrending = createServerFn({ method: "GET" }).handler(createSsrRpc("77d90f9fc38890a4f6d20405d7a31e99e4e9248bf892cecaa7ecfea8b8ef06bf"));
var getPopularMovies = createServerFn({ method: "GET" }).handler(createSsrRpc("e8a337af69ce24b98a35c9a5c786e4a264a2a1eaacc400bea05e1e0e0ed883e1"));
var getTopRatedMovies = createServerFn({ method: "GET" }).handler(createSsrRpc("c579d9df7f0798d5de4c39174a5ddabc1357565e0f8b7dcbf53563e652328365"));
var getNowPlayingMovies = createServerFn({ method: "GET" }).handler(createSsrRpc("35b9365597b830e04a0ca1baeed6daab63be3b6b7446b2b8a16483edaf0ae0c8"));
var getPopularShows = createServerFn({ method: "GET" }).handler(createSsrRpc("784d18509f5758260386cedead664b7b0ae3970696a9998828604ea0ab6b5bbb"));
var getTopRatedShows = createServerFn({ method: "GET" }).handler(createSsrRpc("8cb8ea9a9a63e5dcb86418b558560a3e43b6d8b6aeacc4d31d64ab4adc694d43"));
var getAiringShows = createServerFn({ method: "GET" }).handler(createSsrRpc("8f641421d7e331477d95e0497dafd36c55a82a351938a2ce7b50aed3076c3061"));
var discover = createServerFn({ method: "GET" }).inputValidator(objectType({
	type: enumType(["movie", "tv"]),
	genre: stringType().optional(),
	year: stringType().optional(),
	minRating: numberType().optional(),
	sort: stringType().optional(),
	page: numberType().optional()
})).handler(createSsrRpc("25fa7e666e5a3afee8e19fef04b92df9ac82a750803979fbc88e2a8b05fc57dd"));
createServerFn({ method: "GET" }).inputValidator(objectType({ type: enumType(["movie", "tv"]) })).handler(createSsrRpc("ebf876321ff9fb76ab5e3e0145e843f93b8696f9dada1feaafa0882cc7a7fdef"));
var getMovie = createServerFn({ method: "GET" }).inputValidator(idInput).handler(createSsrRpc("22b060e2a8b5a413622ca9d52229ff13f35c2922a920dadfca7da6e01686acfd"));
var getShow = createServerFn({ method: "GET" }).inputValidator(idInput).handler(createSsrRpc("01455c05c1f66976a73244e9b67617a7302e999eac312db5f6451b06908f0ee0"));
var getSeason = createServerFn({ method: "GET" }).inputValidator(objectType({
	id: numberType(),
	season: numberType()
})).handler(createSsrRpc("a88edc453082894d652124c430c7a3d066602e628a6fac62288f02cf51c49f58"));
var getRecommendations = createServerFn({ method: "GET" }).inputValidator(objectType({
	id: numberType(),
	type: enumType(["movie", "tv"])
})).handler(createSsrRpc("60377b0b957e359f55e5c9e6f48d2f5c6375bd2adfcc645f40f59d841be7b6df"));
var searchMedia = createServerFn({ method: "GET" }).inputValidator(objectType({ query: stringType() })).handler(createSsrRpc("4554bac009cb7b0dd4f23b35e6381cde80f8891f6cd2c529ecb25d91e64f42ba"));
var HOUR = 36e5;
var trendingQuery = () => queryOptions({
	queryKey: ["trending"],
	queryFn: () => getTrending(),
	staleTime: HOUR
});
var popularMoviesQuery = () => queryOptions({
	queryKey: ["movies", "popular"],
	queryFn: () => getPopularMovies(),
	staleTime: HOUR
});
var topRatedMoviesQuery = () => queryOptions({
	queryKey: ["movies", "top"],
	queryFn: () => getTopRatedMovies(),
	staleTime: HOUR
});
var nowPlayingMoviesQuery = () => queryOptions({
	queryKey: ["movies", "now"],
	queryFn: () => getNowPlayingMovies(),
	staleTime: HOUR
});
var popularShowsQuery = () => queryOptions({
	queryKey: ["shows", "popular"],
	queryFn: () => getPopularShows(),
	staleTime: HOUR
});
var topRatedShowsQuery = () => queryOptions({
	queryKey: ["shows", "top"],
	queryFn: () => getTopRatedShows(),
	staleTime: HOUR
});
var airingShowsQuery = () => queryOptions({
	queryKey: ["shows", "airing"],
	queryFn: () => getAiringShows(),
	staleTime: HOUR
});
var discoverQuery = (input) => queryOptions({
	queryKey: ["discover", input],
	queryFn: () => discover({ data: input }),
	staleTime: HOUR
});
var movieQuery = (id) => queryOptions({
	queryKey: ["movie", id],
	queryFn: () => getMovie({ data: { id } }),
	staleTime: HOUR
});
var showQuery = (id) => queryOptions({
	queryKey: ["show", id],
	queryFn: () => getShow({ data: { id } }),
	staleTime: HOUR
});
var seasonQuery = (id, season) => queryOptions({
	queryKey: [
		"season",
		id,
		season
	],
	queryFn: () => getSeason({ data: {
		id,
		season
	} }),
	staleTime: HOUR
});
var recommendationsQuery = (id, type) => queryOptions({
	queryKey: [
		"recommendations",
		type,
		id
	],
	queryFn: () => getRecommendations({ data: {
		id,
		type
	} }),
	staleTime: HOUR
});
var searchQuery = (query) => queryOptions({
	queryKey: ["search", query],
	queryFn: () => searchMedia({ data: { query } }),
	enabled: query.trim().length > 1,
	staleTime: 6e5
});
var sourcesQuery = (input) => queryOptions({
	queryKey: ["sources", input],
	queryFn: () => getSources({ data: input }),
	staleTime: 3e5
});
//#endregion
export { popularMoviesQuery as a, searchQuery as c, sourcesQuery as d, topRatedMoviesQuery as f, nowPlayingMoviesQuery as i, seasonQuery as l, trendingQuery as m, discoverQuery as n, popularShowsQuery as o, topRatedShowsQuery as p, movieQuery as r, recommendationsQuery as s, airingShowsQuery as t, showQuery as u };
