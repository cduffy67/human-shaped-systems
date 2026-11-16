import { createServerFn } from "@tanstack/react-start";

const TTL = 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();
async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.data as T;
  const data = await fn();
  if (data !== null) cache.set(key, { at: Date.now(), data });
  return data;
}

export type DuolingoStats = {
  streak: number;
  totalXp: number;
  course: { title: string; xp: number; learningLanguage: string } | null;
  endDate: string | null;
  creationDate: number | null;
};

export const getDuolingoStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<DuolingoStats | null> =>
    cached("duolingo", async () => {
      try {
        const res = await fetch(
          "https://www.duolingo.com/2017-06-30/users?username=conorduffy575519",
          { headers: { "User-Agent": "Mozilla/5.0 (personal site)" } },
        );
        if (!res.ok) return null;
        const json = (await res.json()) as { users?: any[] };
        const u = json.users?.[0];
        if (!u || typeof u.streak !== "number") return null;
        const es = (u.courses ?? []).find((c: any) => c.learningLanguage === "es");
        return {
          streak: u.streak,
          totalXp: typeof u.totalXp === "number" ? u.totalXp : 0,
          course: es ? { title: es.title, xp: es.xp, learningLanguage: es.learningLanguage } : null,
          endDate: u.streakData?.currentStreak?.endDate ?? null,
          creationDate: typeof u.creationDate === "number" ? u.creationDate : null,
        };
      } catch {
        return null;
      }
    }),
);

export type StravaStats = {
  source: "stub" | "strava";
  month_km: number;
  latest: {
    distance_km: number;
    pace_min_per_km: string;
    weekday: string;
    device_name: string | null;
    url: string | null;
  };
};

// Stub: replace internals with the real Strava API later, keep the same shape.
export const getStravaStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<StravaStats | null> =>
    cached("strava", async () => ({
      source: "stub" as const,
      month_km: 42.0,
      latest: { distance_km: 8.4, pace_min_per_km: "5:12", weekday: "Sunday", device_name: null, url: null },
    })),
);
