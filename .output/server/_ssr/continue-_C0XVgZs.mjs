import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { T as useProfile, p as continueWatching } from "./router-ChHaMAyj.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { n as EmptyState } from "./ui-states-CevxkTO-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/continue-_C0XVgZs.js
var import_jsx_runtime = require_jsx_runtime();
function ContinuePage() {
	useProfile();
	const items = continueWatching();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8 md:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-3xl font-bold md:text-4xl",
			children: "Continue watching"
		}), items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
			children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
				orientation: "landscape",
				progress: p.percentage,
				caption: p.episodeTitle ?? `${Math.round(p.percentage)}% watched`,
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
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nothing in progress",
			description: "Start something and it will show up here."
		})]
	});
}
//#endregion
export { ContinuePage as component };
