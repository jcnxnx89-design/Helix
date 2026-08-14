import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Route$4 } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { r as ErrorState, t as DetailSkeleton } from "./ui-states-CevxkTO-.mjs";
import { t as formatRuntime } from "./format-C-wS2g1W.mjs";
import { n as MediaRow, t as Hero } from "./media-row-CNvnboqI.mjs";
import { r as movieQuery, s as recommendationsQuery } from "./queries-BPwnCAxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/movie._id-ChAg1RUf.js
var import_jsx_runtime = require_jsx_runtime();
function MoviePage() {
	const { id } = Route$4.useParams();
	const numericId = Number(id);
	const detail = useQuery(movieQuery(numericId));
	const recs = useQuery(recommendationsQuery(numericId, "movie"));
	if (detail.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSkeleton, {});
	if (detail.isError || !detail.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 py-24 md:px-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			title: "Couldn't load this movie",
			onRetry: () => void detail.refetch()
		})
	});
	const movie = detail.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { item: movie }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8 px-4 py-8 md:px-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-6 text-sm text-muted-foreground",
					children: [
						formatRuntime(movie.runtime) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRuntime(movie.runtime) }) : null,
						movie.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: movie.status }) : null,
						movie.genres.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: movie.genres.join(", ") }) : null
					]
				}),
				movie.cast.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-xl font-semibold",
					children: "Cast"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar flex gap-4 overflow-x-auto pb-2",
					children: movie.cast.slice(0, 16).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-28 shrink-0 text-center",
						children: [
							p.profile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.profile,
								alt: p.name,
								className: "mb-2 size-28 rounded-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-2 size-28 rounded-full bg-surface-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: p.role
							})
						]
					}, p.id))
				})] }) : null,
				recs.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaRow, {
					title: "More like this",
					className: "-mx-4 md:-mx-10",
					children: recs.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
						item,
						className: "w-[150px] md:w-[190px]"
					}, item.id))
				}) : null
			]
		})]
	});
}
//#endregion
export { MoviePage as component };
