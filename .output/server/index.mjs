globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx+unenv.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/android-chrome-192x192.png": {
		"type": "image/png",
		"etag": "\"108c0-Mi7HBwBZBiniykyNdq4d1batN0I\"",
		"mtime": "2026-08-14T20:15:51.010Z",
		"size": 67776,
		"path": "../public/android-chrome-192x192.png"
	},
	"/android-chrome-512x512.png": {
		"type": "image/png",
		"etag": "\"63bc2-N6pdk9PHDaVE4Wz0nromF6wB8M8\"",
		"mtime": "2026-08-14T20:15:51.011Z",
		"size": 408514,
		"path": "../public/android-chrome-512x512.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"ecd7-S2iWgh9DxcBRDFhHZrqlLkTCNwA\"",
		"mtime": "2026-08-14T20:15:51.014Z",
		"size": 60631,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon-16x16.png": {
		"type": "image/png",
		"etag": "\"3c9-BhLg0MUyl1w9sbEw/iAuas8MCzA\"",
		"mtime": "2026-08-14T20:15:51.014Z",
		"size": 969,
		"path": "../public/favicon-16x16.png"
	},
	"/favicon-32x32.png": {
		"type": "image/png",
		"etag": "\"b7c-3QYGJOenlSlSjMxn4EvucECWM4M\"",
		"mtime": "2026-08-14T20:15:51.015Z",
		"size": 2940,
		"path": "../public/favicon-32x32.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"3c2e-4UIoNNSM5ye07o4o+WqrGqEAWBE\"",
		"mtime": "2026-08-14T20:15:51.016Z",
		"size": 15406,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-08-14T20:15:51.016Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/site.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"107-vzG6+RvdL83iSkXj8qG+M3M8b2k\"",
		"mtime": "2026-08-14T20:15:51.016Z",
		"size": 263,
		"path": "../public/site.webmanifest"
	},
	"/assets/admin.sources-DEFWbx7h.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fd-EkTB3umsA0XOPtJoNvB799Wj/Go\"",
		"mtime": "2026-08-14T20:17:40.869Z",
		"size": 6653,
		"path": "../public/assets/admin.sources-DEFWbx7h.js"
	},
	"/assets/button-T7NrFFS-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d92-Xt23d6I7NHDntSpRAXxXv2H9r5E\"",
		"mtime": "2026-08-14T20:17:40.870Z",
		"size": 40338,
		"path": "../public/assets/button-T7NrFFS-.js"
	},
	"/assets/chevron-right-xk218KmN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-bB0F1K6KuPd/+ba4mdIV/WNaJgs\"",
		"mtime": "2026-08-14T20:17:40.870Z",
		"size": 207,
		"path": "../public/assets/chevron-right-xk218KmN.js"
	},
	"/assets/continue-JPzZK94M.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"374-oe7oLNqNUbU+Cr58duV9j6Orpls\"",
		"mtime": "2026-08-14T20:17:40.870Z",
		"size": 884,
		"path": "../public/assets/continue-JPzZK94M.js"
	},
	"/assets/createLucideIcon-CmZvQuGU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f2-Y+3Vc2VSh52RQnuz+/uAKnBedrE\"",
		"mtime": "2026-08-14T20:17:40.871Z",
		"size": 1266,
		"path": "../public/assets/createLucideIcon-CmZvQuGU.js"
	},
	"/assets/dist-CAiosC7J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"27b-KYE7QYzM2dSHZ+/wkNso2kqcudU\"",
		"mtime": "2026-08-14T20:17:40.872Z",
		"size": 635,
		"path": "../public/assets/dist-CAiosC7J.js"
	},
	"/assets/createServerFn-CqLG7uxl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"965e-vkpWCfirIjfizdVIhT/ATQtlMuk\"",
		"mtime": "2026-08-14T20:17:40.871Z",
		"size": 38494,
		"path": "../public/assets/createServerFn-CqLG7uxl.js"
	},
	"/assets/format-hZ4gfSE0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"169-bRr+eJvrOfpSmaz6clwR11XP/A4\"",
		"mtime": "2026-08-14T20:17:40.872Z",
		"size": 361,
		"path": "../public/assets/format-hZ4gfSE0.js"
	},
	"/assets/history-H39ZLiIP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ad-F8YDYffjVTGmknMttl/KjgdGt/I\"",
		"mtime": "2026-08-14T20:17:40.872Z",
		"size": 1965,
		"path": "../public/assets/history-H39ZLiIP.js"
	},
	"/assets/input-Dgblu8fB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"242-BZd2SThOuAVlgQiEtVJbGxkyNZg\"",
		"mtime": "2026-08-14T20:17:40.873Z",
		"size": 578,
		"path": "../public/assets/input-Dgblu8fB.js"
	},
	"/assets/media-card-C1iuxc5w.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce1-CeoT9gOhLqyG2Mem0yQFDpjqic4\"",
		"mtime": "2026-08-14T20:17:40.874Z",
		"size": 3297,
		"path": "../public/assets/media-card-C1iuxc5w.js"
	},
	"/assets/link-C1YYi8u8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5b1d-A4Xf9nPhgUiRZNU+4wQT0BhpMEA\"",
		"mtime": "2026-08-14T20:17:40.874Z",
		"size": 23325,
		"path": "../public/assets/link-C1YYi8u8.js"
	},
	"/assets/media-row-BDaJKez1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10fb-yhZFLf4e/KhJAUDSuLQccM4s2gU\"",
		"mtime": "2026-08-14T20:17:40.874Z",
		"size": 4347,
		"path": "../public/assets/media-row-BDaJKez1.js"
	},
	"/assets/movie._id-BS-aShXu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"765-vIXOEGM72HFZHBQgJ3MGXHzOV0Q\"",
		"mtime": "2026-08-14T20:17:40.875Z",
		"size": 1893,
		"path": "../public/assets/movie._id-BS-aShXu.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-08-14T20:17:40.873Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/hls-Ct-6oJs2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8bde0-fI9ORjyNOJ0d11AXGZw4IiJuc7U\"",
		"mtime": "2026-08-14T20:17:40.873Z",
		"size": 572896,
		"path": "../public/assets/hls-Ct-6oJs2.js"
	},
	"/assets/index-kKI3qtpY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2880-1/VqgUZUKAiz6hVY0kUJSq68i3M\"",
		"mtime": "2026-08-14T20:17:40.869Z",
		"size": 665728,
		"path": "../public/assets/index-kKI3qtpY.js"
	},
	"/assets/movies-udgnd_Pw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b8-wuOGOdtv2+haqp4aE7ptnDpqi8M\"",
		"mtime": "2026-08-14T20:17:40.875Z",
		"size": 696,
		"path": "../public/assets/movies-udgnd_Pw.js"
	},
	"/assets/my-list-COkNFw-9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"315-2gwC1eyuagVDeZpSu9Q4QlVxHik\"",
		"mtime": "2026-08-14T20:17:40.875Z",
		"size": 789,
		"path": "../public/assets/my-list-COkNFw-9.js"
	},
	"/assets/react-dom-C6R5BhgJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dd9-Y0fXNgHqxVJtbViym4zPidWUNsI\"",
		"mtime": "2026-08-14T20:17:40.876Z",
		"size": 3545,
		"path": "../public/assets/react-dom-C6R5BhgJ.js"
	},
	"/assets/play-DSqrkrLi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-KsFD5fjDW92m3CdybrchEYBJY4E\"",
		"mtime": "2026-08-14T20:17:40.876Z",
		"size": 190,
		"path": "../public/assets/play-DSqrkrLi.js"
	},
	"/assets/queries-CtLD4OcX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2cd9-KYmCe0SmVAyVHGzoVjUfHH/dkzQ\"",
		"mtime": "2026-08-14T20:17:40.876Z",
		"size": 11481,
		"path": "../public/assets/queries-CtLD4OcX.js"
	},
	"/assets/remote.index-DqRbzAHA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49f-wSIPgvSf8ndwyeew8GwRRiUYhQ4\"",
		"mtime": "2026-08-14T20:17:40.877Z",
		"size": 1183,
		"path": "../public/assets/remote.index-DqRbzAHA.js"
	},
	"/assets/remote._code-CL4K-iiu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"173d-EqbTPbWnfoRSdtinlIRf1Vz+9ZI\"",
		"mtime": "2026-08-14T20:17:40.877Z",
		"size": 5949,
		"path": "../public/assets/remote._code-CL4K-iiu.js"
	},
	"/assets/routes-DusMKX8F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"79a-xpv4EtDjsbYy8CJyRVtD5yYbaLY\"",
		"mtime": "2026-08-14T20:17:40.877Z",
		"size": 1946,
		"path": "../public/assets/routes-DusMKX8F.js"
	},
	"/assets/search-q-LPxeSK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"749-6ce3PQ8dwFG/2RiMOkVqD+BlB/M\"",
		"mtime": "2026-08-14T20:17:40.878Z",
		"size": 1865,
		"path": "../public/assets/search-q-LPxeSK.js"
	},
	"/assets/settings-BBJDppAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c29-A8mfo0zRgGsHZhoS8yVFDLU8QiI\"",
		"mtime": "2026-08-14T20:17:40.878Z",
		"size": 7209,
		"path": "../public/assets/settings-BBJDppAk.js"
	},
	"/assets/show._id-BUrgBVeP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"939-JPvbxDN8f+bsJCFbukOs9AFJ7/o\"",
		"mtime": "2026-08-14T20:17:40.878Z",
		"size": 2361,
		"path": "../public/assets/show._id-BUrgBVeP.js"
	},
	"/assets/shows-DaKALfpe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b6-gQILupO+EUU3g2xcANw3d8rg9qQ\"",
		"mtime": "2026-08-14T20:17:40.878Z",
		"size": 694,
		"path": "../public/assets/shows-DaKALfpe.js"
	},
	"/assets/sources.functions-Bw5xxeBj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b2-TkraggyjD1Sf8wWcnagOHS/SjBQ\"",
		"mtime": "2026-08-14T20:17:40.879Z",
		"size": 690,
		"path": "../public/assets/sources.functions-Bw5xxeBj.js"
	},
	"/assets/styles-DO8Pa6ov.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"16506-Tj+ohgw/1QubRT3rkuEeMy67KLM\"",
		"mtime": "2026-08-14T20:17:40.880Z",
		"size": 91398,
		"path": "../public/assets/styles-DO8Pa6ov.css"
	},
	"/assets/ui-states-CWhXDMBG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da7-wmwIHZiclmFsmChvl7jL+kHqUUs\"",
		"mtime": "2026-08-14T20:17:40.879Z",
		"size": 3495,
		"path": "../public/assets/ui-states-CWhXDMBG.js"
	},
	"/assets/volume-x-CmW94_ri.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e1-5OeSv/mkU5rnnhtZJJZPuguw818\"",
		"mtime": "2026-08-14T20:17:40.879Z",
		"size": 1761,
		"path": "../public/assets/volume-x-CmW94_ri.js"
	},
	"/assets/watch._type._id-C4vAtSeb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"736c-A4Frlf8KmgoHY+nb65vU5j6m0j4\"",
		"mtime": "2026-08-14T20:17:40.879Z",
		"size": 29548,
		"path": "../public/assets/watch._type._id-C4vAtSeb.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_B0GsxF = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_B0GsxF
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
