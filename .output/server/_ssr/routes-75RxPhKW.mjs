import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as useProfile, p as continueWatching } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { a as HeroSkeleton, o as RowSkeleton, r as ErrorState } from "./ui-states-CevxkTO-.mjs";
import { n as MediaRow, t as Hero } from "./media-row-CNvnboqI.mjs";
import { a as popularMoviesQuery, f as topRatedMoviesQuery, i as nowPlayingMoviesQuery, m as trendingQuery, o as popularShowsQuery, p as topRatedShowsQuery, t as airingShowsQuery } from "./queries-BPwnCAxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-75RxPhKW.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	useProfile();
	const trending = useQuery(trendingQuery());
	const popularMovies = useQuery(popularMoviesQuery());
	const popularShows = useQuery(popularShowsQuery());
	const topMovies = useQuery(topRatedMoviesQuery());
	const topShows = useQuery(topRatedShowsQuery());
	const nowPlaying = useQuery(nowPlayingMoviesQuery());
	const airing = useQuery(airingShowsQuery());
	const resume = continueWatching().slice(0, 12);
	if (trending.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 py-24 md:px-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			title: "Couldn't load your library",
			description: "Metadata could not be fetched right now. Check the TMDB key in settings and try again.",
			onRetry: () => void trending.refetch()
		})
	});
	const hero = trending.data?.[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [trending.isLoading || !hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { item: hero }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "-mt-10 space-y-2 md:-mt-16",
			children: [
				resume.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaRow, {
					title: "Continue watching",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/continue",
						className: "text-sm text-muted-foreground hover:text-foreground",
						children: "See all"
					}),
					children: resume.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
						orientation: "landscape",
						progress: p.percentage,
						caption: p.episodeTitle ?? "Resume",
						className: "w-[260px] md:w-[320px]",
						item: {
							id: p.mediaId,
							type: p.mediaType,
							title: p.title,
							poster: p.poster,
							backdrop: p.backdrop,
							overview: "",
							year: null,
							rating: 0,
							genres: []
						}
					}, p.key))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Trending now",
					q: trending
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Popular movies",
					q: popularMovies
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Popular series",
					q: popularShows
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "In theatres",
					q: nowPlaying
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Airing this week",
					q: airing
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Top rated films",
					q: topMovies
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					title: "Top rated series",
					q: topShows
				})
			]
		})]
	});
}
function Row({ title, q }) {
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaRow, {
		title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, {})
	});
	if (!q.data?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaRow, {
		title,
		children: q.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
			item,
			className: "w-[150px] md:w-[190px]"
		}, `${item.type}-${item.id}`))
	});
}
//#endregion
export { Home as component };
