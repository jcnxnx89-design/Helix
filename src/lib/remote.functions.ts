import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 6;

function randomCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

/** The TV/browser host opens a pairing window and receives a secret channel id. */
export const createPairing = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    
    if (!url || !key) {
      throw new Error(`Missing env: url=${!!url}, key=${!!key}`);
    }

    // Clean up expired sessions first
    await fetch(`${url}/rest/v1/remote_sessions?expires_at=lt.${new Date().toISOString()}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${key}`,
        "apikey": key,
      },
    }).catch(() => {}); // Ignore errors

    const code = randomCode();
    const expiresAt = new Date(Date.now() + TTL_MS).toISOString();

    // Insert new pairing session
    const response = await fetch(`${url}/rest/v1/remote_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        "apikey": key,
      },
      body: JSON.stringify({
        pair_code: code,
        expires_at: expiresAt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${response.status} ${error}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned from insert");
    }

    const row = data[0];
    return { sessionId: row.id as string, code: row.pair_code as string, expiresAt };
  } catch (err) {
    console.error("createPairing error:", err);
    throw new Error(`Could not start a pairing session: ${err instanceof Error ? err.message : String(err)}`);
  }
});

/** The phone exchanges the short-lived code from the QR for the session channel. */
export const claimPairing = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code: z.string().max(16) }))
  .handler(async ({ data }) => {
    const code = data.code.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,16}$/.test(code)) {
      return { ok: false as const, reason: "invalid" as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("remote_sessions")
      .select("id, expires_at, claimed_at, attempts")
      .eq("pair_code", code)
      .maybeSingle();

    if (!row) return { ok: false as const, reason: "invalid" as const };

    const attempts = (row.attempts as number) + 1;
    await supabaseAdmin.from("remote_sessions").update({ attempts }).eq("id", row.id);

    if (attempts > MAX_ATTEMPTS) {
      await supabaseAdmin.from("remote_sessions").delete().eq("id", row.id);
      return { ok: false as const, reason: "rate-limited" as const };
    }
    if (new Date(row.expires_at as string).getTime() < Date.now()) {
      await supabaseAdmin.from("remote_sessions").delete().eq("id", row.id);
      return { ok: false as const, reason: "expired" as const };
    }
    if (row.claimed_at) return { ok: false as const, reason: "already-used" as const };

    // Single-use: the code is invalidated the moment it is exchanged.
    await supabaseAdmin
      .from("remote_sessions")
      .update({ claimed_at: new Date().toISOString(), pair_code: `used-${row.id}` })
      .eq("id", row.id);

    return { ok: true as const, sessionId: row.id as string };
  });

/** Host ends the session: the pairing record is destroyed. */
export const endPairing = createServerFn({ method: "POST" })
  .inputValidator(z.object({ sessionId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("remote_sessions").delete().eq("id", data.sessionId);
    return { ok: true };
  });
