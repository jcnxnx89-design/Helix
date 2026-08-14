import { n as createServerFn } from "./server-D4-2jtEm.mjs";
import { E as createSsrRpc } from "./router-ChHaMAyj.mjs";
import { a as enumType, c as stringType, i as booleanType, o as numberType, r as arrayType, s as objectType } from "../_libs/tanstack__zod-adapter+zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sources.functions-BB9ryYGP.js
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
/** Public read of the owner-authorized source library for one title. */
var getSources = createServerFn({ method: "GET" }).inputValidator(objectType({
	mediaType: enumType(["movie", "tv"]),
	metadataId: stringType().max(40),
	seasonNumber: numberType().nullable().optional(),
	episodeNumber: numberType().nullable().optional()
})).handler(createSsrRpc("8c293122a8d8300feca715769bb90b138a5fe692f97cdf282104a22eb8bd4268"));
var listAllSources = createServerFn({ method: "POST" }).inputValidator(objectType({ passcode: stringType().max(200) })).handler(createSsrRpc("a7a723e3d190aadd428f55633bb971bf6642780c4932326462f4d3cc141ea2fa"));
var addSource = createServerFn({ method: "POST" }).inputValidator(sourceInput).handler(createSsrRpc("5f4377733139abd63120ae85cec730fa7cc25f368c28c21aa3e2d75e4eefddb3"));
var setSourceEnabled = createServerFn({ method: "POST" }).inputValidator(objectType({
	passcode: stringType().max(200),
	id: stringType().uuid(),
	enabled: booleanType()
})).handler(createSsrRpc("9cde307a460ee4d41c8dd59853246c7dcdb5f6c315081fefaf0fc8610b37bae7"));
var deleteSource = createServerFn({ method: "POST" }).inputValidator(objectType({
	passcode: stringType().max(200),
	id: stringType().uuid()
})).handler(createSsrRpc("602ad87387ec09d9dd03484dc8a2b3e59c675eab61c4f2a5a3c9cb4f7bda9094"));
createServerFn({ method: "POST" }).inputValidator(objectType({ passcode: stringType().max(200) })).handler(createSsrRpc("1e6e969269610049ee323268b0e1b961411db469885dc1a93448205119da23ea"));
//#endregion
export { setSourceEnabled as a, listAllSources as i, deleteSource as n, getSources as r, addSource as t };
