import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as Play } from "../_libs/lucide-react.mjs";
import { t as MediaCard } from "./media-card-DqnnpHKz.mjs";
import { r as ErrorState, t as DetailSkeleton } from "./ui-states-CevxkTO-.mjs";
import { n as MediaRow, t as Hero } from "./media-row-CNvnboqI.mjs";
import { l as seasonQuery, s as recommendationsQuery, u as showQuery } from "./queries-BPwnCAxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/show._id-CF0HAEbL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShowPage() {
	const { id } = Route$1.useParams();
	const numericId = Number(id);
	const detail = useQuery(showQuery(numericId));
	const recs = useQuery(recommendationsQuery(numericId, "tv"));
	const [season, setSeason] = (0, import_react.useState)(1);
	const seasonData = useQuery(seasonQuery(numericId, season));
	if (detail.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSkeleton, {});
	if (detail.isError || !detail.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 py-24 md:px-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			title: "Couldn't load this series",
			onRetry: () => void detail.refetch()
		})
	});
	const show = detail.data;
	const seasons = show.seasons.filter((s) => s.seasonNumber > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, { item: show }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8 px-4 py-8 md:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: seasons.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"data-focusable": true,
					onClick: () => setSeason(s.seasonNumber),
					className: `rounded-full px-4 py-2 text-sm font-medium transition-colors ${season === s.seasonNumber ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`,
					children: s.name
				}, s.seasonNumber))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: (seasonData.data ?? []).map((ep) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/watch/$type/$id",
					params: {
						type: "tv",
						id: String(numericId)
					},
					search: {
						season: ep.seasonNumber,
						episode: ep.episodeNumber,
						t: void 0
					},
					"data-focusable": true,
					className: "flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-3 transition-colors hover:bg-surface-2",
					children: [
						ep.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: ep.thumbnail,
							alt: "",
							className: "h-20 w-36 rounded-lg object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-20 w-36 rounded-lg bg-surface-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate font-semibold",
								children: [
									ep.episodeNumber,
									". ",
									ep.title
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 text-sm text-muted-foreground",
								children: ep.overview
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 shrink-0 fill-current text-primary" })
					]
				}) }, ep.id))
			})] }), recs.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaRow, {
				title: "More like this",
				className: "-mx-4 md:-mx-10",
				children: recs.data.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCard, {
					item,
					className: "w-[150px] md:w-[190px]"
				}, item.id))
			}) : null]
		})]
	});
}
//#endregion
export { ShowPage as component };
