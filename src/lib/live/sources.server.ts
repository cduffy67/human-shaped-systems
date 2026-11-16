// Server-only fetchers shared by server functions and the snapshot jobs.
import { getAccessToken } from "./tokens.server";
import type { DuolingoStats, SpotifyArtist, SpotifyStats, SpotifyTrack, StravaRun, StravaStats } from "./types";

export async function fetchDuolingo(): Promise<DuolingoStats | null> {
  try {
    const res = await fetch("https://www.duolingo.com/2017-06-30/users?username=conorduffy575519", {
      headers: { "User-Agent": "Mozilla/5.0 (personal site)" },
    });
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
}

/* ---------------- date helpers (Europe/London) ---------------- */

const LONDON = "Europe/London";
const isoDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: LONDON }).format(d);
const weekdayName = (d: Date) => new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: LONDON }).format(d);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Monday-start ISO week containing an ISO day. */
const weekStart = (dayIso: string) => {
  const d = new Date(`${dayIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};
const addDays = (dayIso: string, n: number) => {
  const d = new Date(`${dayIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** m:ss pace per km from moving seconds and distance in km. */
const pace = (seconds: number, km: number) => {
  const total = km > 0 ? Math.round(seconds / km) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

/* ---------------- Strava ---------------- */

type Activity = {
  id: number;
  sport_type: string;
  start_date: string;
  distance: number;
  moving_time: number;
};

const isRun = (a: Activity) => a.sport_type === "Run" || a.sport_type === "TrailRun";

/** Activities since `after` (unix seconds), newest first. Null if the first page fails. */
async function stravaActivities(token: string, after: number): Promise<Activity[] | null> {
  const out: Activity[] = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      console.error(`strava activities failed`, res.status);
      return out.length ? out : null;
    }
    const batch = (await res.json()) as Activity[];
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out.sort((a, b) => (a.start_date < b.start_date ? 1 : -1));
}

export async function fetchStrava(): Promise<StravaStats | null> {
  const token = await getAccessToken("strava");
  if (!token) return null;

  const now = new Date();
  const today = isoDay(now);
  const eightWeeksAgo = Math.floor((now.getTime() - 56 * 86_400_000) / 1000);

  const activities = await stravaActivities(token, eightWeeksAgo);
  if (!activities) return null;

  const runs = activities.filter((a) => isRun(a) && a.distance / 1000 >= 0.1);
  const km = (a: Activity) => a.distance / 1000;
  const day = (a: Activity) => isoDay(new Date(a.start_date));

  const monthStart = today.slice(0, 8) + "01";
  const month_km = round1(runs.filter((a) => day(a) >= monthStart).reduce((s, a) => s + km(a), 0));

  // One extra call back to 1 Jan for the year total.
  const yearStart = Math.floor(new Date(`${today.slice(0, 4)}-01-01T00:00:00Z`).getTime() / 1000);
  const yearActivities = await stravaActivities(token, yearStart);
  const year_km = yearActivities ? round1(yearActivities.filter(isRun).reduce((s, a) => s + km(a), 0)) : null;

  const runRow = (a: Activity): StravaRun => ({
    date: day(a),
    distance_km: round1(km(a)),
    pace_min_per_km: pace(a.moving_time, km(a)),
  });
  const recent_runs = runs.slice(0, 5).map(runRow);

  const thisWeek = weekStart(today);
  const weekly_km = Array.from({ length: 8 }, (_, i) => {
    const week_start = addDays(thisWeek, (i - 7) * 7);
    return { week_start, km: round1(runs.filter((a) => weekStart(day(a)) === week_start).reduce((s, a) => s + km(a), 0)) };
  });

  // device_name only comes back on the single-activity call.
  let latest: StravaStats["latest"] = null;
  const last = runs[0];
  if (last) {
    let device_name: string | null = null;
    try {
      const res = await fetch(`https://www.strava.com/api/v3/activities/${last.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) device_name = ((await res.json()) as { device_name?: string | null }).device_name ?? null;
    } catch {
      /* headline figures still stand without the device name */
    }
    latest = {
      distance_km: round1(km(last)),
      pace_min_per_km: pace(last.moving_time, km(last)),
      weekday: weekdayName(new Date(last.start_date)),
      device_name,
      url: `https://www.strava.com/activities/${last.id}`,
    };
  }

  // Maps, polylines, coordinates and location names are deliberately never copied out.
  return { source: "strava", month_km, year_km, latest, runs: recent_runs, recent_runs, weekly_km };
}

/* ---------------- Spotify ---------------- */

type Art = { url: string; width?: number | null; height?: number | null }[] | undefined;
/** The image closest to 300px. */
const pickArt = (images: Art) => {
  if (!images?.length) return null;
  return [...images].sort((a, b) => Math.abs((a.width ?? 0) - 300) - Math.abs((b.width ?? 0) - 300))[0]?.url ?? null;
};

export async function fetchSpotify(): Promise<SpotifyStats | null> {
  const token = await getAccessToken("spotify");
  if (!token) return null;

  const get = async (path: string): Promise<any | null> => {
    const res = await fetch(`https://api.spotify.com/v1${path}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error(`spotify ${path} failed`, res.status);
      return null;
    }
    return res.json();
  };

  const trackData = await get("/me/top/tracks?time_range=short_term&limit=5");
  const artistData = await get("/me/top/artists?time_range=short_term&limit=3");
  if (!trackData && !artistData) return null;

  const top_tracks: SpotifyTrack[] = (trackData?.items ?? []).map((t: any) => ({
    title: t.name,
    artist: t.artists?.[0]?.name ?? "",
    art: pickArt(t.album?.images),
    url: t.external_urls?.spotify ?? null,
  }));
  const top_artists: SpotifyArtist[] = (artistData?.items ?? []).map((a: any) => ({
    name: a.name,
    url: a.external_urls?.spotify ?? null,
    image: pickArt(a.images),
  }));

  return {
    source: "spotify",
    tracks: top_tracks,
    artists: top_artists.map((a) => a.name),
    top_track: top_tracks[0] ?? null,
    top_tracks,
    top_artists,
  };
}
