import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as joinRemoteChannel, i as Route$2, s as claimPairing, t as Button } from "./router-ChHaMAyj.mjs";
import { E as House, I as Captions, M as ChevronRight, N as ChevronLeft, P as ChevronDown, a as Undo2, b as Play, d as SkipForward, f as SkipBack, g as RotateCcw, h as RotateCw, j as ChevronUp, m as Search, n as VolumeX, p as Settings, r as Volume2, v as Power, w as LoaderCircle, x as Pause } from "../_libs/lucide-react.mjs";
import { n as formatTime } from "./format-C-wS2g1W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/remote._code-rCCq1lur.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RemotePage() {
	const { code } = Route$2.useParams();
	const [status, setStatus] = (0, import_react.useState)("connecting");
	const [reason, setReason] = (0, import_react.useState)(null);
	const [state, setState] = (0, import_react.useState)(null);
	const busRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			try {
				const result = await claimPairing({ data: { code } });
				if (!active) return;
				if (!result.ok) {
					setStatus("error");
					setReason(result.reason === "expired" ? "That code expired. Generate a new one on your TV." : result.reason === "already-used" ? "That code was already used. Generate a new one on your TV." : result.reason === "rate-limited" ? "Too many attempts. Generate a new code on your TV." : "That code isn't valid.");
					return;
				}
				busRef.current = joinRemoteChannel(result.sessionId, "remote", {
					onState: (s) => setState(s),
					onSubscribed: () => setStatus("connected")
				});
			} catch {
				if (active) {
					setStatus("error");
					setReason("Could not reach the pairing service.");
				}
			}
		})();
		return () => {
			active = false;
			busRef.current?.leave();
			busRef.current = null;
		};
	}, [code]);
	const send = (cmd) => {
		busRef.current?.sendCommand(cmd);
		if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
	};
	if (status === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-xs space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Can't pair"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: reason
			})]
		})
	});
	if (status === "connecting") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-10 animate-spin text-primary" })
	});
	const np = state?.nowPlaying ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col gap-5 bg-background px-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-primary",
						children: "Connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "truncate text-lg font-semibold",
						children: np?.title ?? "Helix"
					}),
					np?.subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted-foreground",
						children: np.subtitle
					}) : null,
					np ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs tabular-nums text-muted-foreground",
						children: [
							formatTime(np.position),
							" / ",
							formatTime(np.duration)
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-xs grid-cols-3 grid-rows-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Up",
						onClick: () => send({
							type: "dpad",
							payload: { dir: "up" }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Left",
						onClick: () => send({
							type: "dpad",
							payload: { dir: "left" }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "OK",
						onClick: () => send({ type: "ok" }),
						className: "rounded-full bg-primary py-6 text-base font-bold text-primary-foreground active:scale-95",
						children: "OK"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Right",
						onClick: () => send({
							type: "dpad",
							payload: { dir: "right" }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Down",
						onClick: () => send({
							type: "dpad",
							payload: { dir: "down" }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-xs grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Back",
						onClick: () => send({ type: "back" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Home",
						onClick: () => send({ type: "home" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Search",
						onClick: () => send({
							type: "navigate",
							payload: { to: "/search" }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Menu",
						onClick: () => send({ type: "menu" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-6" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-xs grid-cols-5 items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Previous",
						onClick: () => send({ type: "prev" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Back 10 seconds",
						onClick: () => send({
							type: "seek",
							payload: { seconds: -10 }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Play or pause",
						onClick: () => send({ type: "playpause" }),
						className: "rounded-2xl bg-surface-2 py-5 active:scale-95",
						children: np?.paused === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mx-auto size-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mx-auto size-7 fill-current" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Forward 10 seconds",
						onClick: () => send({
							type: "seek",
							payload: { seconds: 10 }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Next",
						onClick: () => send({ type: "next" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid w-full max-w-xs grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Volume down",
						onClick: () => send({
							type: "volume",
							payload: { delta: -.1 }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Volume up",
						onClick: () => send({
							type: "volume",
							payload: { delta: .1 }
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Subtitles",
						onClick: () => send({ type: "subtitles" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PadButton, {
						label: "Fullscreen",
						onClick: () => send({ type: "fullscreen" }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mx-auto mt-auto text-muted-foreground",
				onClick: () => send({ type: "disconnect" }),
				children: "Disconnect"
			})
		]
	});
}
function PadButton({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": label,
		onClick,
		className: "flex items-center justify-center rounded-2xl bg-surface py-5 text-foreground transition-transform active:scale-95",
		children
	});
}
//#endregion
export { RemotePage as component };
