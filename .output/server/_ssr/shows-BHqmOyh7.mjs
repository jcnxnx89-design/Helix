import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { i as GridSkeleton, n as EmptyState } from "./ui-states-CevxkTO-.mjs";
import { n as discoverQuery } from "./queries-BPwnCAxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shows-BHqmOyh7.js
var import_jsx_runtime = require_jsx_runtime();
function ShowsPage() {
	const { data, isLoading } = useQuery(discoverQuery({
		type: "tv",
		sort: "popularity.desc"
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8 md:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-3xl font-bold md:text-4xl",
			children: "TV Shows"
		}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridSkeleton, {}) : data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
			children: data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, { item }, item.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No shows found",
			description: "Try again in a moment."
		})]
	});
}
//#endregion
export { ShowsPage as component };
