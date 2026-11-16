import { createServerFn } from "@tanstack/react-start";

type City = { time: string; temp: number; conditions: string };
let cache: { at: number; data: { dublin: City; london: City } } | null = null;
const TTL = 30 * 60 * 1000;

function describe(code: number) {
  if (code === 0) return "clear";
  if (code <= 2) return "partly cloudy";
  if (code === 3) return "overcast";
  if (code <= 48) return "foggy";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "snow";
  if (code <= 82) return "showers";
  return "thunder";
}

async function city(lat: number, lon: number, tz: string): Promise<City> {
  const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
  if (!r.ok) throw new Error("weather");
  const j = (await r.json()) as { current: { temperature_2m: number; weather_code: number } };
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
  return { time, temp: Math.round(j.current.temperature_2m), conditions: describe(j.current.weather_code) };
}

export const getHomeWeather = createServerFn({ method: "GET" }).handler(async () => {
  if (cache && Date.now() - cache.at < TTL) return { ok: true as const, ...cache.data };
  try {
    const [dublin, london] = await Promise.all([city(53.35, -6.26, "Europe/Dublin"), city(51.51, -0.13, "Europe/London")]);
    cache = { at: Date.now(), data: { dublin, london } };
    return { ok: true as const, dublin, london };
  } catch {
    return { ok: false as const };
  }
});
