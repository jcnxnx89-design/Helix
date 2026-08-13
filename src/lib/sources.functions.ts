import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { MediaType, SubtitleTrack, VideoSource } from "./types";

interface SourceRow {
  id: string;
  media_type: string;
  metadata_id: string;
  season_number: number | null;
  episode_number: number | null;
  name: string;
  kind: string;
  url: string;
  mime_type: string | null;
  subtitles: unknown;
  enabled: boolean;
  created_at: string;
}

function toSource(row: SourceRow): VideoSource {
  return {
    id: row.id,
    mediaId: row.metadata_id,
    mediaType: row.media_type as MediaType,
    seasonNumber: row.season_number,
    episodeNumber: row.episode_number,
    name: row.name,
    kind: row.kind as VideoSource["kind"],
    url: row.url,
    mimeType: row.mime_type,
    subtitles: Array.isArray(row.subtitles) ? (row.subtitles as SubtitleTrack[]) : [],
    enabled: row.enabled,
    origin: "library",
    authorizationStatus: "owner-authorized",
  };
}

const urlSchema = z
  .string()
  .max(2000)
  .refine((v) => /^https:\/\//i.test(v), "Sources must be served over HTTPS.");

const sourceInput = z.object({
  passcode: z.string().max(200),
  mediaType: z.enum(["movie", "tv"]),
  metadataId: z.string().max(40),
  seasonNumber: z.number().nullable(),
  episodeNumber: z.number().nullable(),
  name: z.string().max(120),
  kind: z.enum(["mp4", "hls", "dash", "iframe"]),
  url: urlSchema,
  mimeType: z.string().max(120).nullable(),
  subtitles: z
    .array(z.object({ label: z.string().max(60), lang: z.string().max(10), url: urlSchema }))
    .max(10),
});

function assertAdmin(passcode: string) {
  const expected = process.env["HELIX_ADMIN_PASSCODE"];
  if (!expected) throw new Error("Admin access is not configured.");
  if (passcode !== expected) throw new Error("Incorrect passcode.");
}

/** Public read of the owner-authorized source library for one title. */
export const getSources = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      mediaType: z.enum(["movie", "tv"]),
      metadataId: z.string().max(40),
      seasonNumber: z.number().nullable().optional(),
      episodeNumber: z.number().nullable().optional(),
    }),
  )
  .handler(async ({ data }): Promise<VideoSource[]> => {
    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    // First, try exact match
    let query = client
      .from("media_sources")
      .select("*")
      .eq("enabled", true)
      .eq("media_type", data.mediaType)
      .eq("metadata_id", data.metadataId);

    if (data.mediaType === "tv" && data.seasonNumber != null && data.episodeNumber != null) {
      query = query.eq("season_number", data.seasonNumber).eq("episode_number", data.episodeNumber);
    }

    let { data: rows, error } = await query.order("created_at", { ascending: true });
    
    // If no exact match, try wildcard sources (metadata_id = '0')
    if (!error && (!rows || rows.length === 0)) {
      let wildcardQuery = client
        .from("media_sources")
        .select("*")
        .eq("enabled", true)
        .eq("media_type", data.mediaType)
        .eq("metadata_id", "0");

      if (data.mediaType === "tv") {
        wildcardQuery = wildcardQuery.isNull("season_number").isNull("episode_number");
      }

      const wildcardResult = await wildcardQuery.order("created_at", { ascending: true });
      if (!wildcardResult.error) {
        rows = wildcardResult.data;
      }
    }
    
    if (error) return [];
    return (rows as SourceRow[]).map((row) => {
      // Replace placeholders in URL
      let url = row.url;
      url = url.replace("{id}", data.metadataId);
      url = url.replace("{season}", String(data.seasonNumber ?? 1));
      url = url.replace("{episode}", String(data.episodeNumber ?? 1));
      
      return {
        ...toSource(row),
        url,
      };
    });
  });

export const listAllSources = createServerFn({ method: "POST" })
  .inputValidator(z.object({ passcode: z.string().max(200) }))
  .handler(async ({ data }): Promise<VideoSource[]> => {
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("media_sources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load the source library.");
    return (rows as SourceRow[]).map(toSource);
  });

export const addSource = createServerFn({ method: "POST" })
  .inputValidator(sourceInput)
  .handler(async ({ data }) => {
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("media_sources").insert({
      media_type: data.mediaType,
      metadata_id: data.metadataId,
      season_number: data.seasonNumber,
      episode_number: data.episodeNumber,
      name: data.name,
      kind: data.kind,
      url: data.url,
      mime_type: data.mimeType,
      subtitles: data.subtitles,
    });
    if (error) throw new Error("Could not save that source.");
    return { ok: true };
  });

export const setSourceEnabled = createServerFn({ method: "POST" })
  .inputValidator(z.object({ passcode: z.string().max(200), id: z.string().uuid(), enabled: z.boolean() }))
  .handler(async ({ data }) => {
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("media_sources")
      .update({ enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error("Could not update that source.");
    return { ok: true };
  });

export const deleteSource = createServerFn({ method: "POST" })
  .inputValidator(z.object({ passcode: z.string().max(200), id: z.string().uuid() }))
  .handler(async ({ data }) => {
    assertAdmin(data.passcode);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("media_sources").delete().eq("id", data.id);
    if (error) throw new Error("Could not remove that source.");
    return { ok: true };
  });

export const verifyPasscode = createServerFn({ method: "POST" })
  .inputValidator(z.object({ passcode: z.string().max(200) }))
  .handler(async ({ data }) => {
    assertAdmin(data.passcode);
    return { ok: true };
  });
