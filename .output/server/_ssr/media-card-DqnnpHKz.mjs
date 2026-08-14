import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as cn } from "./router-ChHaMAyj.mjs";
import { b as Play, l as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/media-card-DqnnpHKz.js
var import_jsx_runtime = require_jsx_runtime();
function ProgressBar({ value, className, label }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-2", className),
		role: "progressbar",
		"aria-valuenow": Math.round(pct),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-label": label ?? "Playback progress",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-primary transition-[width] duration-500",
			style: { width: `${pct}%` }
		})
	});
}
function MediaCard({ item, orientation = "portrait", progress, caption, className }) {
	const image = orientation === "landscape" ? item.backdrop ?? item.poster : item.poster ?? item.backdrop;
	const to = item.type === "movie" ? "/movie/$id" : "/show/$id";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params: { id: String(item.id) },
		"data-focusable": true,
		"aria-label": `${item.title}${item.year ? `, ${item.year}` : ""}`,
		className: cn("group relative block shrink-0 rounded-2xl outline-none transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:scale-[1.04]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden rounded-2xl bg-surface-2 shadow-card", orientation === "landscape" ? "aspect-video" : "aspect-[2/3]"),
			children: [
				image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: `${item.title} artwork`,
					loading: "lazy",
					decoding: "async",
					className: "size-full object-cover transition-opacity duration-500"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-full items-center justify-center px-3 text-center text-sm text-muted-foreground",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3 fill-current" }), " View"]
					})
				}),
				item.rating > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-semibold backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-primary text-primary" }), item.rating.toFixed(1)]
				}) : null,
				progress != null && progress > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-0 p-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressBar, { value: progress })
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2.5 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm font-semibold md:text-base",
				children: item.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-xs text-muted-foreground",
				children: caption ?? [item.year, item.genres[0]].filter(Boolean).join(" • ")
			})]
		})]
	});
}
//#endregion
export { MediaCard as t };
