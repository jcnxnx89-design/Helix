import { n as createServerFn } from "./server-D4-2jtEm.mjs";
import { c as stringType, s as objectType } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { t as createServerRpc } from "./createServerRpc-PeZKVqZb.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/remote.functions-BO6k--pn.js
var CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var CODE_LENGTH = 8;
var TTL_MS = 3e5;
var MAX_ATTEMPTS = 6;
function randomCode() {
	const bytes = new Uint8Array(CODE_LENGTH);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => CODE_ALPHABET[b % 32]).join("");
}
/** The TV/browser host opens a pairing window and receives a secret channel id. */
var createPairing_createServerFn_handler = createServerRpc({
	id: "6277a8ae0b63ff51d6a0a87985fb51f2940ba35346f6b29ba0455993ef2794b7",
	name: "createPairing",
	filename: "src/lib/remote.functions.ts"
}, (opts) => createPairing.__executeServer(opts));
var createPairing = createServerFn({ method: "POST" }).handler(createPairing_createServerFn_handler, async () => {
	try {
		const url = processModule.env["SUPABASE_URL"];
		const key = processModule.env["SUPABASE_SERVICE_ROLE_KEY"];
		if (!url || !key) throw new Error(`Missing env: url=${!!url}, key=${!!key}`);
		try {
			await (await fetch(`${url}/rest/v1/remote_sessions?expires_at=lt.${(/* @__PURE__ */ new Date()).toISOString()}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${key}`,
					"apikey": key
				}
			})).text();
		} catch (e) {
			console.debug("Cleanup error (ignored):", e);
		}
		const code = randomCode();
		const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
		const response = await fetch(`${url}/rest/v1/remote_sessions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${key}`,
				"apikey": key,
				"Prefer": "return=representation"
			},
			body: JSON.stringify({
				pair_code: code,
				expires_at: expiresAt
			})
		});
		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Supabase error: ${response.status} ${error}`);
		}
		let data;
		const responseText = await response.text();
		if (!responseText) throw new Error("Empty response from insert");
		try {
			data = JSON.parse(responseText);
		} catch (e) {
			throw new Error(`Failed to parse response: ${responseText}`);
		}
		if (!Array.isArray(data) || data.length === 0) throw new Error("No data returned from insert");
		const row = data[0];
		return {
			sessionId: row.id,
			code: row.pair_code,
			expiresAt
		};
	} catch (err) {
		console.error("createPairing error:", err);
		throw new Error(`Could not start a pairing session: ${err instanceof Error ? err.message : String(err)}`);
	}
});
var claimPairing_createServerFn_handler = createServerRpc({
	id: "0c37dc2982aa151e5efa760e2abc68b71b8b4065822babef504954a7d464b9df",
	name: "claimPairing",
	filename: "src/lib/remote.functions.ts"
}, (opts) => claimPairing.__executeServer(opts));
var claimPairing = createServerFn({ method: "POST" }).inputValidator(objectType({ code: stringType().max(16) })).handler(claimPairing_createServerFn_handler, async ({ data }) => {
	const code = data.code.trim().toUpperCase();
	if (!/^[A-Z0-9]{4,16}$/.test(code)) return {
		ok: false,
		reason: "invalid"
	};
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: row } = await supabaseAdmin.from("remote_sessions").select("id, expires_at, claimed_at, attempts").eq("pair_code", code).maybeSingle();
	if (!row) return {
		ok: false,
		reason: "invalid"
	};
	const attempts = row.attempts + 1;
	await supabaseAdmin.from("remote_sessions").update({ attempts }).eq("id", row.id);
	if (attempts > MAX_ATTEMPTS) {
		await supabaseAdmin.from("remote_sessions").delete().eq("id", row.id);
		return {
			ok: false,
			reason: "rate-limited"
		};
	}
	if (new Date(row.expires_at).getTime() < Date.now()) {
		await supabaseAdmin.from("remote_sessions").delete().eq("id", row.id);
		return {
			ok: false,
			reason: "expired"
		};
	}
	if (row.claimed_at) return {
		ok: false,
		reason: "already-used"
	};
	await supabaseAdmin.from("remote_sessions").update({
		claimed_at: (/* @__PURE__ */ new Date()).toISOString(),
		pair_code: `used-${row.id}`
	}).eq("id", row.id);
	return {
		ok: true,
		sessionId: row.id
	};
});
var endPairing_createServerFn_handler = createServerRpc({
	id: "ad45109c0254ffca4f921c13697ff96dda6af1d9bf2c18dd4ec4abbf041a0689",
	name: "endPairing",
	filename: "src/lib/remote.functions.ts"
}, (opts) => endPairing.__executeServer(opts));
var endPairing = createServerFn({ method: "POST" }).inputValidator(objectType({ sessionId: stringType().uuid() })).handler(endPairing_createServerFn_handler, async ({ data }) => {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	await supabaseAdmin.from("remote_sessions").delete().eq("id", data.sessionId);
	return { ok: true };
});
//#endregion
export { claimPairing_createServerFn_handler, createPairing_createServerFn_handler, endPairing_createServerFn_handler };
