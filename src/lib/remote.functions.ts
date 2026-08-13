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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Debug: log what we have
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    console.log("Supabase config check:", {
      url: url ? "✓" : "✗",
      key: key ? `✓ (${key.length} chars)` : "✗",
    });
    
    await supabaseAdmin.from("remote_sessions").delete().lt("expires_at", new Date().toISOString());

    const code = randomCode();
    const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
    const { data, error } = await supabaseAdmin
      .from("remote_sessions")
      .insert({ pair_code: code, expires_at: expiresAt })
      .select("id, pair_code, expires_at")
      .single();

    if (error) {
      console.error("Insert error:", error);
      throw new Error(`Database error: ${error.message}`);
    }
    if (!data) throw new Error("No data returned from insert.");
    
    return { sessionId: data.id as string, code: data.pair_code as string, expiresAt };
  } catch (err) {
    console.error("createPairing error:", err);
    throw new Error("Could not start a pairing session.");
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
