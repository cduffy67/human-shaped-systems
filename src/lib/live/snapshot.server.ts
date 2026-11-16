// Server-only: save one snapshot of a live source. On any API error the previous
// live_stats row is kept and the failure is logged.
import type { DuolingoStats, SpotifyStats, StravaStats } from "./types";

export type SnapshotSource = "duolingo" | "strava" | "spotify";

export async function runSnapshot(source: SnapshotSource): Promise<{ ok: boolean }> {
  const { fetchDuolingo, fetchStrava, fetchSpotify } = await import("./sources.server");
  const payload: DuolingoStats | StravaStats | SpotifyStats | null =
    source === "duolingo" ? await fetchDuolingo() : source === "strava" ? await fetchStrava() : await fetchSpotify();

  if (!payload) {
    console.error(`snapshot ${source}: no data — keeping the previous live_stats row`);
    return { ok: false };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("live_stats").insert({ source, payload });
  if (error) {
    console.error(`snapshot ${source} save failed`, error.message);
    return { ok: false };
  }
  return { ok: true };
}
