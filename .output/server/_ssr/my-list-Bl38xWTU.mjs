import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { T as useProfile } from "./router-ChHaMAyj.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { n as EmptyState } from "./ui-states-CevxkTO-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/my-list-Bl38xWTU.js
var import_jsx_runtime = require_jsx_runtime();
function MyListPage() {
	const profile = useProfile();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8 md:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-3xl font-bold md:text-4xl",
			children: "My List"
		}), profile.myList.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
			children: profile.myList.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, { item: {
				id: entry.id,
				type: entry.type,
				title: entry.title,
				poster: entry.poster,
				backdrop: entry.backdrop,
				overview: "",
				year: entry.year,
				rating: entry.rating,
				genres: []
			} }, `${entry.type}-${entry.id}`))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Your list is empty",
			description: "Add titles from any detail page to find them here."
		})]
	});
}
//#endregion
export { MyListPage as component };
