import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { T as useProfile, c as clearHistory, l as clearHistoryEntry, t as Button } from "./router-ChHaMAyj.mjs";
import { c as Trash2 } from "../_libs/lucide-react.mjs";
import { n as EmptyState } from "./ui-states-CevxkTO-.mjs";
import { n as formatTime } from "./format-C-wS2g1W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-DztFzmls.js
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const profile = useProfile();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-8 md:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold md:text-4xl",
				children: "Watch history"
			}), profile.watchHistory.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => clearHistory(),
				"data-focusable": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Clear all"]
			}) : null]
		}), profile.watchHistory.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-surface",
			children: profile.watchHistory.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-4 p-4",
				children: [
					entry.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: entry.poster,
						alt: "",
						className: "h-20 w-14 rounded-lg object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 w-14 rounded-lg bg-surface-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-semibold",
							children: entry.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted-foreground",
							children: [
								entry.episodeTitle ? `${entry.episodeTitle} • ` : "",
								formatTime(entry.position),
								" of ",
								formatTime(entry.duration),
								" •",
								" ",
								new Date(entry.watchedAt).toLocaleDateString()
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": `Remove ${entry.title} from history`,
						onClick: () => clearHistoryEntry(entry.key),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})
				]
			}, `${entry.key}-${entry.watchedAt}`))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No history yet",
			description: "Watch something and it will be listed here."
		})]
	});
}
//#endregion
export { HistoryPage as component };
