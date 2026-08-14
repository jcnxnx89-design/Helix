//#region node_modules/.nitro/vite/services/ssr/assets/format-C-wS2g1W.js
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const s = Math.floor(seconds % 60);
	const m = Math.floor(seconds / 60 % 60);
	const h = Math.floor(seconds / 3600);
	const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
	return h > 0 ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}
function formatRuntime(minutes) {
	if (!minutes) return null;
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h ? `${h}h ${m}m` : `${m}m`;
}
//#endregion
export { formatTime as n, formatRuntime as t };
