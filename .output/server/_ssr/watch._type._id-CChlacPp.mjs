import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as saveProgress, T as useProfile, f as cn, h as getProfile, m as getPosition, n as Route, t as Button, v as publishNowPlaying, w as updatePreferences, y as registerPlayer } from "./router-ChHaMAyj.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as Maximize, I as Captions, L as ArrowLeft, S as Minimize, b as Play, d as SkipForward, f as SkipBack, g as RotateCcw, h as RotateCw, i as Volume1, n as VolumeX, r as Volume2, w as LoaderCircle, x as Pause } from "../_libs/lucide-react.mjs";
import { n as EmptyState } from "./ui-states-CevxkTO-.mjs";
import { n as formatTime } from "./format-C-wS2g1W.mjs";
import { d as sourcesQuery, l as seasonQuery, r as movieQuery, u as showQuery } from "./queries-BPwnCAxF.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch._type._id-CChlacPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
function VideoPlayer({ source, title, subtitle, poster, startAt = 0, onBack, onProgress, onEnded, onNext, onPrev }) {
	const shellRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const hideTimer = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [paused, setPaused] = (0, import_react.useState)(true);
	const [position, setPosition] = (0, import_react.useState)(startAt);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [buffering, setBuffering] = (0, import_react.useState)(false);
	const [volume, setVolumeState] = (0, import_react.useState)(1);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [subsOn, setSubsOn] = (0, import_react.useState)(false);
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const [controlsVisible, setControlsVisible] = (0, import_react.useState)(true);
	const showControls = (0, import_react.useCallback)(() => {
		setControlsVisible(true);
		if (hideTimer.current) window.clearTimeout(hideTimer.current);
		hideTimer.current = window.setTimeout(() => setControlsVisible(false), 3500);
	}, []);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video || source.kind === "iframe") return;
		setError(null);
		setReady(false);
		let destroy;
		const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");
		if (source.kind === "hls" && !nativeHls) {
			let cancelled = false;
			import("../_libs/hls.js.mjs").then((n) => n.t).then(({ default: Hls }) => {
				if (cancelled) return;
				if (!Hls.isSupported()) {
					setError("This browser can't play HLS streams.");
					return;
				}
				const hls = new Hls({ enableWorker: true });
				hls.loadSource(source.url);
				hls.attachMedia(video);
				hls.on(Hls.Events.ERROR, (_e, data) => {
					if (data.fatal) setError("The stream could not be loaded.");
				});
				destroy = () => hls.destroy();
			});
			return () => {
				cancelled = true;
				destroy?.();
			};
		}
		video.src = source.url;
		return () => {
			video.removeAttribute("src");
			video.load();
		};
	}, [source]);
	(0, import_react.useEffect)(() => {
		const prefs = getProfile().preferences;
		const video = videoRef.current;
		if (!video) return;
		video.volume = prefs.volume;
		video.muted = prefs.muted;
		video.playbackRate = prefs.playbackRate;
		setVolumeState(prefs.volume);
		setMuted(prefs.muted);
		setSubsOn(prefs.subtitlesOn);
	}, []);
	const api = {
		playPause: () => {
			const v = videoRef.current;
			if (!v) return;
			if (v.paused) v.play();
			else v.pause();
			showControls();
		},
		seekBy: (s) => {
			const v = videoRef.current;
			if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + s));
			showControls();
		},
		seekTo: (s) => {
			const v = videoRef.current;
			if (v) v.currentTime = Math.max(0, s);
			showControls();
		},
		adjustVolume: (d) => {
			const v = videoRef.current;
			if (!v) return;
			const next = Math.max(0, Math.min(1, v.volume + d));
			v.volume = next;
			v.muted = false;
			setVolumeState(next);
			setMuted(false);
			updatePreferences({
				volume: next,
				muted: false
			});
			showControls();
		},
		setVolume: (value) => {
			const v = videoRef.current;
			if (!v) return;
			const next = Math.max(0, Math.min(1, value));
			v.volume = next;
			setVolumeState(next);
			updatePreferences({ volume: next });
			showControls();
		},
		toggleMute: () => {
			const v = videoRef.current;
			if (!v) return;
			v.muted = !v.muted;
			setMuted(v.muted);
			updatePreferences({ muted: v.muted });
			showControls();
		},
		nextEpisode: () => onNext?.(),
		prevEpisode: () => onPrev?.(),
		toggleFullscreen: () => {
			const el = shellRef.current;
			if (!el) return;
			if (document.fullscreenElement) document.exitFullscreen();
			else el.requestFullscreen().catch(() => void 0);
		},
		toggleSubtitles: () => {
			setSubsOn((on) => {
				const next = !on;
				const v = videoRef.current;
				if (v) for (let i = 0; i < v.textTracks.length; i += 1) v.textTracks[i].mode = next && i === 0 ? "showing" : "hidden";
				updatePreferences({ subtitlesOn: next });
				return next;
			});
			showControls();
		}
	};
	const apiRef = (0, import_react.useRef)(api);
	apiRef.current = api;
	(0, import_react.useEffect)(() => {
		return registerPlayer({
			playPause: () => apiRef.current.playPause(),
			seekBy: (s) => apiRef.current.seekBy(s),
			seekTo: (s) => apiRef.current.seekTo(s),
			adjustVolume: (d) => apiRef.current.adjustVolume(d),
			setVolume: (v) => apiRef.current.setVolume(v),
			toggleMute: () => apiRef.current.toggleMute(),
			nextEpisode: () => apiRef.current.nextEpisode(),
			prevEpisode: () => apiRef.current.prevEpisode(),
			toggleFullscreen: () => apiRef.current.toggleFullscreen(),
			toggleSubtitles: () => apiRef.current.toggleSubtitles()
		});
	}, []);
	(0, import_react.useEffect)(() => {
		publishNowPlaying({
			title,
			subtitle: subtitle ?? null,
			poster: poster ?? null,
			position,
			duration,
			paused,
			volume,
			muted,
			subtitlesOn: subsOn
		});
	}, [
		title,
		subtitle,
		poster,
		position,
		duration,
		paused,
		volume,
		muted,
		subsOn
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const target = e.target;
			if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
			switch (e.key) {
				case " ":
				case "k":
					e.preventDefault();
					apiRef.current.playPause();
					break;
				case "ArrowRight":
					apiRef.current.seekBy(10);
					break;
				case "ArrowLeft":
					apiRef.current.seekBy(-10);
					break;
				case "ArrowUp":
					apiRef.current.adjustVolume(.1);
					break;
				case "ArrowDown":
					apiRef.current.adjustVolume(-.1);
					break;
				case "m":
					apiRef.current.toggleMute();
					break;
				case "f":
					apiRef.current.toggleFullscreen();
					break;
				case "c":
					apiRef.current.toggleSubtitles();
					break;
				case "Escape": if (!document.fullscreenElement) onBack();
			}
			showControls();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onBack, showControls]);
	(0, import_react.useEffect)(() => {
		const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, []);
	(0, import_react.useEffect)(() => {
		showControls();
		return () => {
			if (hideTimer.current) window.clearTimeout(hideTimer.current);
		};
	}, [showControls]);
	if (source.kind === "iframe") {
		let iframeUrl = source.url;
		iframeUrl = iframeUrl.replace("{id}", source.mediaId);
		iframeUrl = iframeUrl.replace("{season}", String(source.seasonNumber ?? 1));
		iframeUrl = iframeUrl.replace("{episode}", String(source.episodeNumber ?? 1));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: shellRef,
			className: "relative size-full bg-black",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				src: iframeUrl,
				title,
				allow: "autoplay; fullscreen; encrypted-media",
				allowFullScreen: true,
				className: "size-full border-0"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "secondary",
				className: "absolute left-4 top-4 rounded-full",
				onClick: onBack,
				"data-focusable": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back"]
			})]
		});
	}
	const VolumeIcon = muted || volume === 0 ? VolumeX : volume < .5 ? Volume1 : Volume2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: shellRef,
		className: "relative size-full select-none bg-black",
		onMouseMove: showControls,
		onClick: showControls,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				poster: poster ?? void 0,
				playsInline: true,
				autoPlay: true,
				className: "size-full object-contain",
				onLoadedMetadata: (e) => {
					const v = e.currentTarget;
					setDuration(v.duration || 0);
					if (startAt > 0 && startAt < (v.duration || Infinity) - 10) v.currentTime = startAt;
					setReady(true);
				},
				onTimeUpdate: (e) => {
					const v = e.currentTarget;
					setPosition(v.currentTime);
					onProgress?.(v.currentTime, v.duration || 0);
				},
				onPlay: () => setPaused(false),
				onPause: () => setPaused(true),
				onWaiting: () => setBuffering(true),
				onPlaying: () => setBuffering(false),
				onEnded: () => onEnded?.(),
				onError: () => setError("This source could not be played."),
				onDoubleClick: () => apiRef.current.toggleFullscreen(),
				children: source.subtitles.map((track, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", {
					kind: "subtitles",
					src: track.url,
					srcLang: track.lang,
					label: track.label,
					default: subsOn && i === 0
				}, track.url))
			}),
			(!ready || buffering) && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 grid place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-12 animate-spin text-primary" })
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center bg-background/90 px-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-sm space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: "Playback problem"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onBack,
							"data-focusable": true,
							children: "Go back"
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/90 transition-opacity duration-300", controlsVisible ? "opacity-100" : "opacity-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex items-start gap-4 p-4 md:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: onBack,
						"data-focusable": true,
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-lg font-semibold md:text-2xl",
							children: title
						}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-muted-foreground",
							children: subtitle
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto space-y-3 p-4 md:p-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						value: [duration ? position / duration * 100 : 0],
						onValueChange: ([v]) => apiRef.current.seekTo((v ?? 0) / 100 * duration),
						max: 100,
						step: .1,
						"aria-label": "Seek"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => apiRef.current.playPause(),
								"data-focusable": true,
								"aria-label": paused ? "Play" : "Pause",
								children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-6 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => apiRef.current.seekBy(-10),
								"data-focusable": true,
								"aria-label": "Back 10 seconds",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: () => apiRef.current.seekBy(10),
								"data-focusable": true,
								"aria-label": "Forward 10 seconds",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-5" })
							}),
							onPrev ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: onPrev,
								"data-focusable": true,
								"aria-label": "Previous episode",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-5" })
							}) : null,
							onNext ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								onClick: onNext,
								"data-focusable": true,
								"aria-label": "Next episode",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "size-5" })
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-1 hidden items-center gap-2 sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => apiRef.current.toggleMute(),
									"data-focusable": true,
									"aria-label": "Mute",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeIcon, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									className: "w-24",
									value: [muted ? 0 : volume * 100],
									onValueChange: ([v]) => apiRef.current.setVolume((v ?? 0) / 100),
									max: 100,
									"aria-label": "Volume"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 tabular-nums text-muted-foreground",
								children: [
									formatTime(position),
									" / ",
									formatTime(duration)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-1",
								children: [source.subtitles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: subsOn ? "default" : "ghost",
									onClick: () => apiRef.current.toggleSubtitles(),
									"data-focusable": true,
									"aria-label": "Subtitles",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, { className: "size-5" })
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => apiRef.current.toggleFullscreen(),
									"data-focusable": true,
									"aria-label": "Fullscreen",
									children: fullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-5" })
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
function WatchPage() {
	const { type, id } = Route.useParams();
	const { season, episode, t } = Route.useSearch();
	const router = useRouter();
	const navigate = useNavigate({ from: "/watch/$type/$id" });
	const mediaType = type === "tv" ? "tv" : "movie";
	const numericId = Number(id);
	const [selectedSourceIndex, setSelectedSourceIndex] = (0, import_react.useState)(0);
	const profile = useProfile();
	const movie = useQuery({
		...movieQuery(numericId),
		enabled: mediaType === "movie"
	});
	const show = useQuery({
		...showQuery(numericId),
		enabled: mediaType === "tv"
	});
	const episodes = useQuery({
		...seasonQuery(numericId, season ?? 1),
		enabled: mediaType === "tv"
	});
	const sources = useQuery(sourcesQuery({
		mediaType,
		metadataId: String(numericId),
		seasonNumber: mediaType === "tv" ? season ?? 1 : null,
		episodeNumber: mediaType === "tv" ? episode ?? 1 : null
	}));
	(0, import_react.useEffect)(() => {
		console.log("[WatchPage] Sources query result:", {
			mediaType,
			numericId,
			isLoading: sources.isLoading,
			isError: sources.isError,
			error: sources.error,
			dataLength: sources.data?.length,
			data: sources.data?.map((s) => ({
				name: s.name,
				kind: s.kind,
				url: s.url
			}))
		});
	}, [
		sources.data,
		sources.isLoading,
		sources.isError,
		sources.error,
		mediaType,
		numericId
	]);
	const detail = mediaType === "tv" ? show.data : movie.data;
	const currentEpisode = episodes.data?.find((e) => e.episodeNumber === (episode ?? 1));
	const preferredSourceName = profile.preferences.preferredSourceName;
	const source = preferredSourceName && sources.data ? sources.data.find((s) => s.name === preferredSourceName) || sources.data[0] : sources.data?.[selectedSourceIndex];
	const saved = detail ? getPosition(mediaType, numericId, season ?? null, episode ?? null) : void 0;
	const goBack = () => {
		if (window.history.length > 1) router.history.back();
		else navigate({
			to: mediaType === "tv" ? "/show/$id" : "/movie/$id",
			params: { id: String(numericId) }
		});
	};
	if (sources.isLoading || !detail && (movie.isLoading || show.isLoading)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-black text-muted-foreground",
		children: "Loading…"
	});
	if (!source || !detail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No playable source",
			description: "This title has no source configured yet. Add one from the library manager and try again."
		})
	});
	const title = detail.title;
	const subtitle = mediaType === "tv" && currentEpisode ? `S${season ?? 1} E${currentEpisode.episodeNumber} • ${currentEpisode.title}` : null;
	const goToEpisode = (delta) => {
		if (mediaType !== "tv") return;
		const next = (episode ?? 1) + delta;
		if (next < 1) return;
		navigate({ search: (prev) => ({
			...prev,
			episode: next,
			t: void 0
		}) });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-screen w-screen bg-black",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayer, {
			source,
			title,
			subtitle,
			poster: detail.backdrop,
			startAt: t ?? saved?.position ?? 0,
			onBack: goBack,
			onProgress: (position, duration) => saveProgress({
				mediaType,
				mediaId: numericId,
				seasonNumber: season ?? null,
				episodeNumber: episode ?? null,
				position,
				duration,
				title,
				poster: detail.poster,
				backdrop: detail.backdrop,
				episodeTitle: subtitle
			}),
			onEnded: () => goToEpisode(1),
			...mediaType === "tv" ? {
				onNext: () => goToEpisode(1),
				onPrev: () => goToEpisode(-1)
			} : {}
		})
	});
}
//#endregion
export { WatchPage as component };
