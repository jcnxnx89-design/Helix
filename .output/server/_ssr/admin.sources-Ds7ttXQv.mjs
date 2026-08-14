import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as cn, t as Button } from "./router-ChHaMAyj.mjs";
import { a as setSourceEnabled, i as listAllSources, n as deleteSource, t as addSource } from "./sources.functions-BB9ryYGP.mjs";
import { t as Input } from "./input-B4aWiqRN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.sources-Ds7ttXQv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
function AdminSourcesPage() {
	const [passcode, setPasscode] = (0, import_react.useState)("");
	const [authenticated, setAuthenticated] = (0, import_react.useState)(false);
	const [sources, setSources] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		mediaType: "movie",
		metadataId: "550",
		seasonNumber: null,
		episodeNumber: null,
		name: "VidCore",
		kind: "iframe",
		url: "https://vidcore.org/embed/movie/{id}",
		mimeType: null,
		subtitles: []
	});
	const handleAuth = async () => {
		setLoading(true);
		try {
			await listAllSources({ data: { passcode } });
			setAuthenticated(true);
			await loadSources();
		} catch (err) {
			alert("Invalid passcode");
		}
		setLoading(false);
	};
	const loadSources = async () => {
		try {
			const data = await listAllSources({ data: { passcode } });
			setSources(data);
		} catch (err) {
			console.error(err);
		}
	};
	const handleAddSource = async () => {
		setLoading(true);
		try {
			await addSource({ data: {
				passcode,
				...form,
				seasonNumber: form.seasonNumber,
				episodeNumber: form.episodeNumber
			} });
			alert("Source added!");
			await loadSources();
			setForm({
				mediaType: "movie",
				metadataId: "550",
				seasonNumber: null,
				episodeNumber: null,
				name: "VidCore",
				kind: "iframe",
				url: "https://vidcore.org/embed/movie/550",
				mimeType: null,
				subtitles: []
			});
		} catch (err) {
			alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
		setLoading(false);
	};
	const handleToggleSource = async (id, enabled) => {
		setLoading(true);
		try {
			await setSourceEnabled({ data: {
				passcode,
				id,
				enabled: !enabled
			} });
			await loadSources();
		} catch (err) {
			alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
		setLoading(false);
	};
	const handleDeleteSource = async (id) => {
		if (!confirm("Are you sure?")) return;
		setLoading(true);
		try {
			await deleteSource({ data: {
				passcode,
				id
			} });
			await loadSources();
		} catch (err) {
			alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
		}
		setLoading(false);
	};
	if (!authenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md space-y-4 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Admin: Add Sources"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Admin Passcode",
					value: passcode,
					onChange: (e) => setPasscode(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: handleAuth,
					disabled: loading,
					className: "w-full",
					children: loading ? "Authenticating..." : "Login"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Source Library Manager"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setAuthenticated(false),
						children: "Logout"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-4 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-semibold",
							children: "Add New Source"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Media Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "w-full rounded border bg-background p-2",
									value: form.mediaType,
									onChange: (e) => setForm({
										...form,
										mediaType: e.target.value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "movie",
										children: "Movie"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "tv",
										children: "TV Show"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "TMDB ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.metadataId,
									onChange: (e) => setForm({
										...form,
										metadataId: e.target.value
									})
								})] }),
								form.mediaType === "tv" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Season"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.seasonNumber || "",
									onChange: (e) => setForm({
										...form,
										seasonNumber: e.target.value ? parseInt(e.target.value) : null
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Episode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: form.episodeNumber || "",
									onChange: (e) => setForm({
										...form,
										episodeNumber: e.target.value ? parseInt(e.target.value) : null
									})
								})] })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Source Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								})
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Kind"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full rounded border bg-background p-2",
								value: form.kind,
								onChange: (e) => setForm({
									...form,
									kind: e.target.value
								}),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "iframe",
										children: "iframe (Embedded Player)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mp4",
										children: "MP4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hls",
										children: "HLS"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "dash",
										children: "DASH"
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Stream URL (must be HTTPS)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.url,
								onChange: (e) => setForm({
									...form,
									url: e.target.value
								}),
								placeholder: "https://vidcore.org/embed/movie/{id}"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"For iframe URLs, use placeholders: ",
									"{id}",
									" for TMDB ID, ",
									"{season}",
									" for season, ",
									"{episode}",
									" for episode"
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleAddSource,
							disabled: loading,
							className: "w-full",
							children: loading ? "Adding..." : "Add Source"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-xl font-semibold",
						children: [
							"Existing Sources (",
							sources.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: sources.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "No sources yet"
						}) : sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: source.mediaType === "tv" ? `${source.name} - S${source.seasonNumber}E${source.episodeNumber}` : `${source.name} (Movie #${source.mediaId})`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: source.kind.toUpperCase()
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: source.enabled ? "default" : "outline",
									onClick: () => handleToggleSource(source.id, source.enabled),
									children: source.enabled ? "Enabled" : "Disabled"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: () => handleDeleteSource(source.id),
									children: "Delete"
								})]
							})]
						}, source.id))
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminSourcesPage as component };
