// Shared live-data shapes. Client-safe: no server code in here.

export type DuolingoStats = {
  streak: number;
  totalXp: number;
  course: { title: string; xp: number; learningLanguage: string } | null;
  endDate: string | null;
  creationDate: number | null;
};

export type StravaRun = { date: string; distance_km: number; pace_min_per_km: string };

export type StravaStats = {
  source: "stub" | "strava";
  month_km: number;
  year_km: number | null;
  latest: {
    distance_km: number;
    pace_min_per_km: string;
    weekday: string;
    device_name: string | null;
    url: string | null;
  } | null;
  runs: StravaRun[];
  recent_runs: StravaRun[];
  weekly_km: { week_start: string; km: number }[];
};

export type SpotifyTrack = { title: string; artist: string; art: string | null; url: string | null };
export type SpotifyArtist = { name: string; url: string | null; image: string | null };

export type SpotifyStats = {
  source: "stub" | "spotify";
  tracks: SpotifyTrack[];
  artists: string[];
  top_track: SpotifyTrack | null;
  top_tracks: SpotifyTrack[];
  top_artists: SpotifyArtist[];
};

export type LetterboxdFilm = {
  title: string;
  year: string | null;
  rating: number | null;
  liked: boolean;
  watchedDate: string | null;
  poster: string | null;
  url: string;
};
