// Server-only fetchers shared by server functions and the hourly snapshot job.
export type DuolingoStats = {
  streak: number;
  totalXp: number;
  course: { title: string; xp: number; learningLanguage: string } | null;
  endDate: string | null;
  creationDate: number | null;
};

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
