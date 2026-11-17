import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Easter egg leaderboard. Table `egg_hunt` is RLS-locked with no policies, so it
 * is only reachable through these server functions (service role). The edit
 * token never leaves the server except to the person who created the row.
 */
const TABLE = "egg_hunt";
const MIN_MS = 3_000;
const MAX_MS = 24 * 60 * 60 * 1000;
const BLOCK = /(fuck|shit|cunt|nigg|fag|bitch|wank|twat|dick|cock|pussy|slut|whore|nazi|hitler|rape)/i;

type Row = { id: string; name: string; ms: number; eggs: number; created_at: string };

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // egg_hunt is newer than the generated types; keep the cast local.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabaseAdmin as any).from(TABLE);
}

const cleanName = (raw: string) => raw.replace(/\s+/g, " ").trim();

export const getLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const t = await db();
    const { data, error } = await t
      .select("id,name,ms,eggs,created_at")
      .eq("hidden", false)
      .order("ms", { ascending: true })
      .limit(10);
    if (error) throw error;
    return { ok: true as const, rows: (data ?? []) as Row[] };
  } catch {
    return { ok: false as const, rows: [] as Row[] };
  }
});

const SubmitInput = z.object({
  name: z.string().max(40),
  ms: z.number().int(),
  eggs: z.number().int().min(3).max(50),
});

export const submitScore = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SubmitInput.parse(d))
  .handler(async ({ data }) => {
    const name = cleanName(data.name);
    if (!name || name.length > 20 || !/^[\p{L}\p{N} .'_-]+$/u.test(name)) return { ok: false as const, error: "Letters, numbers and spaces only, up to 20 characters." };
    if (BLOCK.test(name.replace(/[^a-z]/gi, ""))) return { ok: false as const, error: "Let's keep it clean." };
    if (data.ms < MIN_MS || data.ms > MAX_MS) return { ok: false as const, error: "That time doesn't look right." };
    try {
      const t = await db();
      const { data: row, error } = await t.insert({ name, ms: data.ms, eggs: data.eggs }).select("id,token").single();
      if (error) throw error;
      const t2 = await db();
      const { count } = await t2.select("id", { count: "exact", head: true }).eq("hidden", false).lt("ms", data.ms);
      return { ok: true as const, id: row.id as string, token: row.token as string, name, rank: (count ?? 0) + 1 };
    } catch {
      return { ok: false as const, error: "Couldn't reach the leaderboard. Try again in a bit." };
    }
  });

const SyncInput = z.object({ id: z.string().uuid(), token: z.string().uuid(), eggs: z.number().int().min(3).max(50) });

/** Bumps the egg count on your own row as you keep finding them. Time to three never changes. */
export const syncEggs = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SyncInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const t = await db();
      await t.update({ eggs: data.eggs }).eq("id", data.id).eq("token", data.token).lt("eggs", data.eggs);
      return { ok: true as const };
    } catch {
      return { ok: false as const };
    }
  });
