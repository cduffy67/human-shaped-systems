import { createServerFn } from "@tanstack/react-start";

export type {
  DuolingoStats,
  LetterboxdFilm,
  SpotifyArtist,
  SpotifyStats,
  SpotifyTrack,
  StravaRun,
  StravaStats,
} from "./types";

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

/** Newest saved snapshot for a source — the fallback when a live API call fails. */
async function lastSnapshot<T>(source: string): Promise<T | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("live_stats")
      .select("payload")
      .eq("source", source)
      .order("captured_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data?.payload as T) ?? null;
  } catch {
    return null;
  }
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

export const getStravaStats = createServerFn({ method: "GET" }).handler(async () =>
  cached("strava", async () => {
    const { fetchStrava } = await import("./sources.server");
    const live = await fetchStrava();
    if (live) return live;
    console.error("strava: live fetch failed — serving the last saved snapshot");
    return lastSnapshot<import("./types").StravaStats>("strava");
  }),
);

export const getSpotifyStats = createServerFn({ method: "GET" }).handler(async () =>
  cached("spotify", async () => {
    const { fetchSpotify } = await import("./sources.server");
    const live = await fetchSpotify();
    if (live) return live;
    console.error("spotify: live fetch failed — serving the last saved snapshot");
    return lastSnapshot<import("./types").SpotifyStats>("spotify");
  }),
);

export const getLetterboxd = createServerFn({ method: "GET" }).handler(async () =>
  cached("letterboxd", async () => {
    try {
      const res = await fetch("https://letterboxd.com/cduffy67/rss/", {
        headers: { "User-Agent": "Mozilla/5.0 (personal site)" },
      });
      if (!res.ok) return null;
      const xml = await res.text();
      const films: import("./types").LetterboxdFilm[] = [];
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
