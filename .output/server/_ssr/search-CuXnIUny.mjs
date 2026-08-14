import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$8 } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B4aWiqRN.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { i as GridSkeleton, n as EmptyState } from "./ui-states-CevxkTO-.mjs";
import { c as searchQuery } from "./queries-BPwnCAxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CuXnIUny.js
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const { q, type } = Route$8.useSearch();
	const navigate = useNavigate({ from: "/search" });
	const { data, isLoading } = useQuery(searchQuery(q));
	const filtered = (data ? [...data.movies, ...data.shows] : []).filter((item) => type === "all" ? true : type === "movie" ? item.type === "movie" : item.type === "tv");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8 md:px-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-6 text-3xl font-bold md:text-4xl",
				children: "Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6 max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					autoFocus: true,
					value: q,
					placeholder: "Search movies and shows…",
					"aria-label": "Search movies and shows",
					onChange: (e) => void navigate({ search: (prev) => ({
						...prev,
						q: e.target.value
					}) }),
					className: "h-14 rounded-2xl border-border bg-surface pl-12 text-base"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex gap-2",
				children: [
					"all",
					"movie",
					"tv"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"data-focusable": true,
					onClick: () => void navigate({ search: (prev) => ({
						...prev,
						type: t
					}) }),
					className: `rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`,
					children: t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"
				}, t))
			}),
			q.trim().length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Start typing",
				description: "Search for a title, and use your phone remote to pick it."
			}) : isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridSkeleton, {}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
				children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, { item }, `${item.type}-${item.id}`))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No results",
				description: `Nothing matched “${q}”.`
			})
		]
	});
}
//#endregion
export { SearchPage as component };
