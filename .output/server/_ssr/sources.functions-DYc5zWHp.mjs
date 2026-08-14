import { n as createServerFn } from "./server-D4-2jtEm.mjs";
import { a as enumType, c as stringType, i as booleanType, o as numberType, r as arrayType, s as objectType } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { t as createServerRpc } from "./createServerRpc-PeZKVqZb.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/sources.functions-DYc5zWHp.js
function toSource(row) {
	return {
		id: row.id,
		mediaId: row.metadata_id,
		mediaType: row.media_type,
		seasonNumber: row.season_number,
		episodeNumber: row.episode_number,
		name: row.name,
		kind: row.kind,
		url: row.url,
		mimeType: row.mime_type,
		subtitles: Array.isArray(row.subtitles) ? row.subtitles : [],
		enabled: row.enabled,
		origin: "library",
		authorizationStatus: "owner-authorized"
	};
}
var urlSchema = stringType().max(2e3).refine((v) => /^https:\/\//i.test(v), "Sources must be served over HTTPS.");
var sourceInput = objectType({
	passcode: stringType().max(200),
	mediaType: enumType(["movie", "tv"]),
	metadataId: stringType().max(40),
	seasonNumber: numberType().nullable(),
	episodeNumber: numberType().nullable(),
	name: stringType().max(120),
	kind: enumType([
		"mp4",
		"hls",
		"dash",
		"iframe"
	]),
	url: urlSchema,
	mimeType: stringType().max(120).nullable(),
	subtitles: arrayType(objectType({
		label: stringType().max(60),
		lang: stringType().max(10),
		url: urlSchema
	})).max(10)
});
function assertAdmin(passcode) {
	const expected = processModule.env["HELIX_ADMIN_PASSCODE"];
	if (!expected) throw new Error("Admin access is not configured.");
	if (passcode !== expected) throw new Error("Incorrect passcode.");
}
/** Public read of the owner-authorized source library for one title. */
var getSources_createServerFn_handler = createServerRpc({
	id: "8c293122a8d8300feca715769bb90b138a5fe692f97cdf282104a22eb8bd4268",
	name: "getSources",
	filename: "src/lib/sources.functions.ts"
}, (opts) => getSources.__executeServer(opts));
var getSources = createServerFn({ method: "GET" }).inputValidator(objectType({
	mediaType: enumType(["movie", "tv"]),
	metadataId: stringType().max(40),
	seasonNumber: numberType().nullable().optional(),
	episodeNumber: numberType().nullable().optional()
})).handler(getSources_createServerFn_handler, async ({ data }) => {
	const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"];
	const client = createClient(processModule.env["SUPABASE_URL"], key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	});
	if (data.mediaType === "movie") {
		console.log("[getSources] Movie query:", { metadataId: data.metadataId });
		const { data: rows, error } = await client.from("media_sources").select("*").eq("enabled", true).eq("media_type", "movie").eq("metadata_id", "0").is("season_number", null).is("episode_number", null).order("created_at", { ascending: true });
		console.log("[getSources] Movie wildcard result:", {
			rowCount: rows?.length,
			error
		});
		if (error) return [];
		return rows.map((row) => {
			let url = row.url;
			url = url.replace("{id}", data.metadataId);
			console.log("[getSources] Movie source:", {
				name: row.name,
				url
			});
			return {
				...toSource(row),
				url
			};
		});
	}
	console.log("[getSources] TV query:", {
		metadataId: data.metadataId,
		season: data.seasonNumber,
		episode: data.episodeNumber
	});
	let query = client.from("media_sources").select("*").eq("enabled", true).eq("media_type", "tv").eq("metadata_id", data.metadataId);
	if (data.seasonNumber != null && data.episodeNumber != null) {
		query = query.eq("season_number", data.seasonNumber).eq("episode_number", data.episodeNumber);
		console.log("[getSources] TV exact match query for S" + data.seasonNumber + "E" + data.episodeNumber);
	}
	let { data: rows, error } = await query.order("created_at", { ascending: true });
	console.log("[getSources] TV exact match result:", {
		rowCount: rows?.length,
		error
	});
	if (!error && (!rows || rows.length === 0)) {
		console.log("[getSources] TV trying wildcard...");
		const wildcardResult = await client.from("media_sources").select("*").eq("enabled", true).eq("media_type", "tv").eq("metadata_id", "0").is("season_number", null).is("episode_number", null).order("created_at", { ascending: true });
		console.log("[getSources] TV wildcard result:", {
			rowCount: wildcardResult.data?.length,
			error: wildcardResult.error
		});
		if (!wildcardResult.error) rows = wildcardResult.data;
	}
	if (error) return [];
	return rows.map((row) => {
		let url = row.url;
		url = url.replace("{id}", data.metadataId);
		url = url.replace("{season}", String(data.seasonNumber ?? 1));
		url = url.replace("{episode}", String(data.episodeNumber ?? 1));
		console.log("[getSources] TV source:", {
			name: row.name,
			url
		});
		return {
			...toSource(row),
			url
		};
	});
});
var listAllSources_createServerFn_handler = createServerRpc({
	id: "a7a723e3d190aadd428f55633bb971bf6642780c4932326462f4d3cc141ea2fa",
	name: "listAllSources",
	filename: "src/lib/sources.functions.ts"
}, (opts) => listAllSources.__executeServer(opts));
var listAllSources = createServerFn({ method: "POST" }).inputValidator(objectType({ passcode: stringType().max(200) })).handler(listAllSources_createServerFn_handler, async ({ data }) => {
	assertAdmin(data.passcode);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: rows, error } = await supabaseAdmin.from("media_sources").select("*").order("created_at", { ascending: false });
	if (error) throw new Error("Could not load the source library.");
	return rows.map(toSource);
});
var addSource_createServerFn_handler = createServerRpc({
	id: "5f4377733139abd63120ae85cec730fa7cc25f368c28c21aa3e2d75e4eefddb3",
	name: "addSource",
	filename: "src/lib/sources.functions.ts"
}, (opts) => addSource.__executeServer(opts));
var addSource = createServerFn({ method: "POST" }).inputValidator(sourceInput).handler(addSource_createServerFn_handler, async ({ data }) => {
	assertAdmin(data.passcode);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("media_sources").insert({
		media_type: data.mediaType,
		metadata_id: data.metadataId,
		season_number: data.seasonNumber,
		episode_number: data.episodeNumber,
		name: data.name,
		kind: data.kind,
		url: data.url,
		mime_type: data.mimeType,
		subtitles: data.subtitles
	});
	if (error) throw new Error("Could not save that source.");
	return { ok: true };
});
var setSourceEnabled_createServerFn_handler = createServerRpc({
	id: "9cde307a460ee4d41c8dd59853246c7dcdb5f6c315081fefaf0fc8610b37bae7",
	name: "setSourceEnabled",
	filename: "src/lib/sources.functions.ts"
}, (opts) => setSourceEnabled.__executeServer(opts));
var setSourceEnabled = createServerFn({ method: "POST" }).inputValidator(objectType({
	passcode: stringType().max(200),
	id: stringType().uuid(),
	enabled: booleanType()
})).handler(setSourceEnabled_createServerFn_handler, async ({ data }) => {
	assertAdmin(data.passcode);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("media_sources").update({ enabled: data.enabled }).eq("id", data.id);
	if (error) throw new Error("Could not update that source.");
	return { ok: true };
});
var deleteSource_createServerFn_handler = createServerRpc({
	id: "602ad87387ec09d9dd03484dc8a2b3e59c675eab61c4f2a5a3c9cb4f7bda9094",
	name: "deleteSource",
	filename: "src/lib/sources.functions.ts"
}, (opts) => deleteSource.__executeServer(opts));
var deleteSource = createServerFn({ method: "POST" }).inputValidator(objectType({
	passcode: stringType().max(200),
	id: stringType().uuid()
})).handler(deleteSource_createServerFn_handler, async ({ data }) => {
	assertAdmin(data.passcode);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.from("media_sources").delete().eq("id", data.id);
	if (error) throw new Error("Could not remove that source.");
	return { ok: true };
});
var verifyPasscode_createServerFn_handler = createServerRpc({
	id: "1e6e969269610049ee323268b0e1b961411db469885dc1a93448205119da23ea",
	name: "verifyPasscode",
	filename: "src/lib/sources.functions.ts"
}, (opts) => verifyPasscode.__executeServer(opts));
var verifyPasscode = createServerFn({ method: "POST" }).inputValidator(objectType({ passcode: stringType().max(200) })).handler(verifyPasscode_createServerFn_handler, async ({ data }) => {
	assertAdmin(data.passcode);
	return { ok: true };
});
//#endregion
export { addSource_createServerFn_handler, deleteSource_createServerFn_handler, getSources_createServerFn_handler, listAllSources_createServerFn_handler, setSourceEnabled_createServerFn_handler, verifyPasscode_createServerFn_handler };
