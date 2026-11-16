import { createServerFn } from "@tanstack/react-start";
import type { DuolingoStats } from "./sources.server";

export type { DuolingoStats };

const TTL = 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();
async function cached<T>(key: string, fn: () => Promise<T>): Promise<{ data: T; fetchedAt: number }> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return { data: hit.data as T, fetchedAt: hit.at };
  const data = await fn();
  const at = Date.now();
  if (data !== null) cache.set(key, { at, data });
  return { data, fetchedAt: at };
}

export const getDuolingoStats = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchDuolingo } = await import("./sources.server");
  return cached("duolingo", fetchDuolingo);
});

/** Days (Europe/London) on which a snapshot showed the streak was extended. */
export const getDuolingoHistory = createServerFn({ method: "GET" }).handler(async () =>
  cached("duolingo-history", async () => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data } = await supabaseAdmin
        .from("live_stats")
        .select("payload, captured_at")
        .eq("source", "duolingo")
        .order("captured_at", { ascending: true })
        .limit(5000);
      const days = new Set<string>();
      for (const row of data ?? []) {
        const end = (row.payload as { endDate?: string | null })?.endDate;
        if (end) days.add(end);
      }
      return [...days];
    } catch {
      return [] as string[];
    }
  }),
);

export type StravaRun = { date: string; distance_km: number; pace_min_per_km: string };
export type StravaStats = {
  source: "stub" | "strava";
  month_km: number;
  latest: { distance_km: number; pace_min_per_km: string; weekday: string; device_name: string | null; url: string | null };
  runs: StravaRun[];
};

// Stub: replace internals with the real Strava API later, keep the same shape.
export const getStravaStats = createServerFn({ method: "GET" }).handler(async () =>
  cached("strava", async (): Promise<StravaStats> => ({
    source: "stub",
    month_km: 42.0,
    latest: { distance_km: 8.4, pace_min_per_km: "5:12", weekday: "Sunday", device_name: null, url: null },
    runs: [
      { date: "2026-11-15", distance_km: 8.4, pace_min_per_km: "5:12" },
      { date: "2026-11-12", distance_km: 6.1, pace_min_per_km: "5:20" },
      { date: "2026-11-09", distance_km: 10.2, pace_min_per_km: "5:31" },
      { date: "2026-11-06", distance_km: 5.0, pace_min_per_km: "5:05" },
      { date: "2026-11-03", distance_km: 12.3, pace_min_per_km: "5:40" },
    ],
  })),
);

export type SpotifyStats = {
  source: "stub" | "spotify";
  tracks: { title: string; artist: string; art: string | null }[];
  artists: string[];
};

// Stub: Spotify isn't connected yet.
export const getSpotifyStats = createServerFn({ method: "GET" }).handler(async () =>
  cached("spotify", async (): Promise<SpotifyStats> => ({
    source: "stub",
    tracks: [
      { title: "Track one", artist: "Artist", art: null },
      { title: "Track two", artist: "Artist", art: null },
      { title: "Track three", artist: "Artist", art: null },
      { title: "Track four", artist: "Artist", art: null },
      { title: "Track five", artist: "Artist", art: null },
    ],
    artists: ["Artist one", "Artist two", "Artist three"],
  })),
);

export type LetterboxdFilm = {
  title: string;
  year: string | null;
  rating: number | null;
  liked: boolean;
  watchedDate: string | null;
  poster: string | null;
  url: string;
};

export const getLetterboxd = createServerFn({ method: "GET" }).handler(async () =>
  cached("letterboxd", async () => {
    try {
      const res = await fetch("https://letterboxd.com/cduffy67/rss/", {
        headers: { "User-Agent": "Mozilla/5.0 (personal site)" },
      });
      if (!res.ok) return null;
      const xml = await res.text();
      const films: LetterboxdFilm[] = [];
      for (const item of xml.split("<item>").slice(1)) {
        const tag = (t: string) => item.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`))?.[1]?.trim() ?? null;
        const title = tag("letterboxd:filmTitle");
        if (!title) continue;
        const rating = tag("letterboxd:memberRating");
        films.push({
          title: title.replace(/&amp;/g, "&").replace(/&#039;|&apos;/g, "'"),
          year: tag("letterboxd:filmYear"),
          rating: rating ? Number(rating) : null,
          liked: tag("letterboxd:memberLike") === "Yes",
          watchedDate: tag("letterboxd:watchedDate"),
          poster: item.match(/<img src="([^"]+)"/)?.[1] ?? null,
          url: tag("link") ?? "https://letterboxd.com/cduffy67/",
        });
      }
      if (!films.length) return null;
      const seen = new Set<string>();
      const top = [...films]
        .filter((f) => f.rating && !seen.has(f.title) && seen.add(f.title))
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || Number(b.liked) - Number(a.liked))
        .slice(0, 5);
      return { recent: films.slice(0, 5), top };
    } catch {
      return null;
    }
  }),
);
