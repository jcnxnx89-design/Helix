import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { T as useProfile, b as resetProfile, d as clearPositions, f as cn, t as Button, u as clearMyList, w as updatePreferences } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as trendingQuery } from "./queries-BPwnCAxF.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Ddad7Lh_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var TOGGLES = [
	{
		key: "autoplay",
		label: "Autoplay",
		hint: "Start playing as soon as a title opens."
	},
	{
		key: "autoplayNext",
		label: "Autoplay next episode",
		hint: "Roll straight into the next episode."
	},
	{
		key: "resumePlayback",
		label: "Resume playback",
		hint: "Pick up where you left off."
	},
	{
		key: "subtitlesOn",
		label: "Subtitles by default",
		hint: "Enable captions when available."
	},
	{
		key: "reduceMotion",
		label: "Reduce motion",
		hint: "Calmer transitions and hover effects."
	},
	{
		key: "largeText",
		label: "Large text",
		hint: "Bigger type for across-the-room reading."
	}
];
function SettingsPage() {
	const profile = useProfile();
	useQuery(trendingQuery());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-8 md:px-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-6 text-3xl font-bold md:text-4xl",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mb-8 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-surface",
				children: TOGGLES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-6 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t.hint
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: Boolean(profile.preferences[t.key]),
						onCheckedChange: (v) => updatePreferences({ [t.key]: v }),
						"aria-label": t.label
					})]
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8 space-y-3 rounded-2xl border border-border/60 bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Preferred streaming source"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Choose your default video source. You can still switch during playback."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updatePreferences({ preferredSourceName: void 0 }),
							className: `rounded px-3 py-2 text-sm font-medium transition ${!profile.preferences.preferredSourceName ? "bg-primary text-primary-foreground" : "bg-background/50 text-foreground hover:bg-background/70"}`,
							children: "Auto (first available)"
						}), ["VidCore", "VidSrc"].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updatePreferences({ preferredSourceName: name }),
							className: `rounded px-3 py-2 text-sm font-medium transition ${profile.preferences.preferredSourceName === name ? "bg-primary text-primary-foreground" : "bg-background/50 text-foreground hover:bg-background/70"}`,
							children: name
						}, name))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 rounded-2xl border border-border/60 bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Your data"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Helix stores your history and list on this device only — no account needed."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => clearPositions(),
								children: "Clear progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => clearMyList(),
								children: "Clear my list"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: () => resetProfile(),
								children: "Reset everything"
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
