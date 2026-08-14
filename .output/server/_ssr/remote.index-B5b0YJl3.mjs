import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./router-ChHaMAyj.mjs";
import { u as Smartphone } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B4aWiqRN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/remote.index-B5b0YJl3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RemoteEntry() {
	const [code, setCode] = (0, import_react.useState)("");
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "size-8" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: "Pair your remote"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Enter the code shown on your TV screen, or scan its QR code."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: code,
					onChange: (e) => setCode(e.target.value.toUpperCase()),
					placeholder: "ABCD1234",
					"aria-label": "Pairing code",
					className: "h-14 rounded-2xl text-center font-display text-xl tracking-[0.3em]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-12 w-full text-base",
					disabled: code.trim().length < 4,
					onClick: () => void navigate({
						to: "/remote/$code",
						params: { code: code.trim() }
					}),
					children: "Connect"
				})
			]
		})
	});
}
//#endregion
export { RemoteEntry as component };
