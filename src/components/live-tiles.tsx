import { OffClockPolaroid } from "@/components/easter-eggs";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { siDuolingo, siLetterboxd, siSpotify, siStrava, type SimpleIcon } from "simple-icons";
import {
  getDuolingoHistory,
  getDuolingoStats,
  getLetterboxd,
  getSpotifyStats,
  getStravaStats,
  type LetterboxdFilm,
  type SpotifyArtist,
} from "@/lib/live/stats.functions";
import { useSiteMode } from "@/lib/mode";
import { CountUp } from "@/components/count-up";

const HOUR = 60 * 60 * 1000;
const fmt = (n: number) => n.toLocaleString("en-GB");
const londonToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
const shortDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
function relTime(ms: number) {
  const m = Math.max(0, Math.round((Date.now() - ms) / 60000));
  return m < 1 ? "just now" : m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
}

type Key = "strava" | "letterboxd" | "spotify" | "duolingo";
const APPS: { key: Key; icon: SimpleIcon; color: string; app: string; label: string }[] = [
  { key: "strava", icon: siStrava, color: `#${siStrava.hex}`, app: "Strava", label: "Running" },
  { key: "letterboxd", icon: siLetterboxd, color: "#ff8000", app: "Letterboxd", label: "Watching" },
  { key: "spotify", icon: siSpotify, color: `#${siSpotify.hex}`, app: "Spotify", label: "Listening" },
  { key: "duolingo", icon: siDuolingo, color: `#${siDuolingo.hex}`, app: "Duolingo", label: "Learning" },
];

/* ---------- data hooks ---------- */
const useStrava = () => useQuery({ queryKey: ["strava"], queryFn: () => getStravaStats(), staleTime: HOUR });
const useSpotify = () => useQuery({ queryKey: ["spotify"], queryFn: () => getSpotifyStats(), staleTime: HOUR });
const useLetterboxd = () => useQuery({ queryKey: ["letterboxd"], queryFn: () => getLetterboxd(), staleTime: HOUR });
const useDuolingo = () => useQuery({ queryKey: ["duolingo"], queryFn: () => getDuolingoStats(), staleTime: HOUR });

function useTileMeta(key: Key): { live: boolean; preview: ReactNode } {
  const s = useStrava(), l = useLetterboxd(), sp = useSpotify(), d = useDuolingo();
  switch (key) {
    case "strava":
      return { live: s.data?.data?.source === "strava", preview: s.data?.data ? <><CountUp value={s.data.data.month_km} /> km this month</> : null };
    case "letterboxd": {
      const f = l.data?.data?.recent[0];
      return { live: !!f, preview: f ? `Last watched: ${f.title}` : null };
    }
    case "spotify":
      return { live: sp.data?.data?.source === "spotify", preview: "On repeat this month" };
    case "duolingo":
      return { live: !!d.data?.data, preview: d.data?.data ? <>🔥 <CountUp value={d.data.data.streak} /> days</> : null };
  }
}

/* ---------- small pieces ---------- */
function Chip({ app, size = 40 }: { app: (typeof APPS)[number]; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, background: `color-mix(in oklab, ${app.color} 14%, transparent)` }}
    >
      <svg aria-hidden viewBox="0 0 24 24" width={size / 2} height={size / 2} style={{ fill: app.color }}>
        <path d={app.icon.path} />
      </svg>
    </span>
  );
}

function Badge({ live }: { live: boolean }) {
  return live ? (
    <span className="mode-mono flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="live-dot" aria-hidden /> Live
    </span>
  ) : (
    <span className="mode-mono flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
      <span className="soon-dot" aria-hidden /> Soon
    </span>
  );
}

const Figure = ({ children }: { children: ReactNode }) => (
  <p className="mode-mono font-display text-4xl leading-tight sm:text-5xl">{children}</p>
);
const Detail = ({ children }: { children: ReactNode }) => (
  <p className="mode-mono mt-2 text-sm text-muted-foreground">{children}</p>
);
const SubHead = ({ children }: { children: ReactNode }) => (
  <p className="mode-mono mb-3 text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{children}</p>
);
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="quiet-link text-sm text-link">{children}</a>
);
const Skeleton = () => <div className="h-40 animate-pulse rounded bg-secondary/60" aria-hidden />;
function Updated({ at }: { at?: number | undefined }) {
  const engine = useSiteMode() === "engine";
  if (!engine || !at) return null;
  return <p className="mode-mono mt-6 text-xs text-muted-foreground">updated {relTime(at)}</p>;
}

/* ---------- tile (resting) ---------- */
function Tile({ app, onOpen, btnRef }: { app: (typeof APPS)[number]; onOpen: () => void; btnRef: (el: HTMLButtonElement | null) => void }) {
  const { live, preview } = useTileMeta(app.key);
  return (
    <motion.button
      ref={btnRef}
      layoutId={`tile-${app.key}`}
      type="button"
      aria-expanded={false}
      aria-label={`${app.label} — ${app.app}`}
      onClick={onOpen}
      className="paper-card group relative flex aspect-square flex-col items-center justify-center gap-3 text-center"
      transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
    >
      <span className="absolute right-3 top-3"><Badge live={live} /></span>
      <motion.span layoutId={`chip-${app.key}`}><Chip app={app} size={52} /></motion.span>
      <span>
        <span className="mode-mono block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{app.label}</span>
        <span className="block font-display text-base">{app.app}</span>
      </span>
      {preview ? (
        <span role="tooltip" className="tile-tip mode-mono pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background">
          {preview}
        </span>
      ) : null}
    </motion.button>
  );
}

/* ---------- panel contents ---------- */
function StravaPanel() {
  const engine = useSiteMode() === "engine";
  const { data } = useStrava();
  if (!data) return <Skeleton />;
  const s = data.data;
  if (!s) return <Detail>Couldn't reach Strava just now.</Detail>;
  const runs = s.recent_runs ?? s.runs;
  const weeks = s.weekly_km ?? [];
  const max = Math.max(...weeks.map((w) => w.km), 1);
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
      <div>
        <Figure>{engine ? <>month_km: <CountUp value={s.month_km} /></> : <><CountUp value={s.month_km} /> km</>}</Figure>
        <Detail>{engine ? "// this month" : "this month, so far"}</Detail>
        {s.year_km !== null && (
          <div className="mt-4">
            <Figure>{engine ? <>year_km: <CountUp value={s.year_km} /></> : <><CountUp value={s.year_km} /> km</>}</Figure>
            <Detail>{engine ? "// so far this year" : "so far this year"}</Detail>
          </div>
        )}
        {s.latest?.device_name && (
          <div className="mt-4">
            <Detail>last run logged on {s.latest.device_name}</Detail>
          </div>
        )}
        <div className="mt-6">
          <SubHead>Weekly km</SubHead>
          <div className="flex h-24 items-end gap-2 rounded border border-border p-3" aria-label="Weekly kilometres">
            {weeks.map((w) => (
              <span
                key={w.week_start}
                className="flex-1 rounded-sm bg-secondary"
                style={{ height: `${Math.max((w.km / max) * 100, 2)}%` }}
                title={`${w.km} km`}
              />
            ))}
          </div>
          <div className="flex gap-2 px-3 pt-1">
            {weeks.map((w) => (
              <span key={w.week_start} className="mode-mono flex-1 text-center text-[0.6rem] text-muted-foreground">
                {shortDate(w.week_start)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div>
        <SubHead>Last 5 runs</SubHead>
        <ul className="border-t border-border">
          {runs.map((r, i) => (
            <li key={`${r.date}-${i}`} className="mode-mono grid grid-cols-3 border-b border-border py-2.5 text-sm">
              <span className="text-muted-foreground">{engine ? r.date : shortDate(r.date)}</span>
              <span>{r.distance_km} km</span>
              <span className="text-right text-muted-foreground">{r.pace_min_per_km}/km</span>
            </li>
          ))}
        </ul>
        {s.latest?.url && <Ext href={s.latest.url}>View on Strava →</Ext>}
      </div>
      <div className="md:col-span-2"><Updated at={data.fetchedAt} /></div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: "#00a828" }} aria-label={`${rating} stars`}>
      {"★".repeat(Math.floor(rating))}{rating % 1 ? "½" : ""}
    </span>
  );
}
function Poster({ f, wide = false }: { f: LetterboxdFilm; wide?: boolean }) {
  return (
    <a href={f.url} target="_blank" rel="noreferrer" className="poster group block" title={f.watchedDate ? `Watched ${shortDate(f.watchedDate)}` : f.title}>
      <span className="relative block overflow-hidden ring-1 ring-border" style={{ borderRadius: 4 }}>
        {f.poster ? (
          <img src={f.poster} alt={`${f.title} poster`} loading="lazy" className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : <span className="block aspect-[2/3] bg-secondary" />}
        {f.watchedDate ? (
          <span className="mode-mono absolute inset-x-0 bottom-0 bg-foreground/80 px-1.5 py-1 text-[0.65rem] text-background opacity-0 transition-opacity group-hover:opacity-100">
            {shortDate(f.watchedDate)}
          </span>
        ) : null}
      </span>
      <span className={`mt-1.5 block truncate ${wide ? "text-sm" : "text-xs"}`}>{f.title}</span>
      <span className="flex items-center gap-1.5 text-xs">
        {f.rating ? <Stars rating={f.rating} /> : null}
        {f.liked ? <span className="text-accent" aria-label="liked">♥</span> : null}
      </span>
    </a>
  );
}
function LetterboxdPanel() {
  const { data } = useLetterboxd();
  if (!data) return <Skeleton />;
  if (!data.data) return <Detail>Couldn't reach Letterboxd just now.</Detail>;
  const { recent, top } = data.data;
  return (
    <div className="grid gap-10">
      <div>
        <SubHead>Recently watched</SubHead>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {recent.map((f) => <Poster key={f.url + f.watchedDate} f={f} />)}
        </div>
      </div>
      {top.length ? (
        <div>
          <SubHead>Top 5</SubHead>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {top.map((f) => <Poster key={f.url} f={f} />)}
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <Ext href="https://letterboxd.com/cduffy67/films/">All films on Letterboxd →</Ext>
        <Updated at={data.fetchedAt} />
      </div>
    </div>
  );
}

function SpotifyPanel() {
  const { data } = useSpotify();
  if (!data) return <Skeleton />;
  const s = data.data;
  if (!s) return <Detail>Couldn't reach Spotify just now.</Detail>;
  const tracks = s.top_tracks?.length ? s.top_tracks : s.tracks;
  const artists: SpotifyArtist[] = s.top_artists?.length
    ? s.top_artists
    : s.artists.map((name) => ({ name, url: null, image: null }));
  return (
    <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <SubHead>On repeat this month</SubHead>
        <ol className="border-t border-border">
          {tracks.map((t, i) => (
            <li key={`${t.title}-${i}`} className="flex items-center gap-3 border-b border-border py-2.5">
              <span className="mode-mono w-5 text-xs text-muted-foreground">{i + 1}</span>
              {t.art ? <img src={t.art} alt="" className="h-10 w-10 rounded" /> : <span className="h-10 w-10 rounded bg-secondary" aria-hidden />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{t.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{t.artist}</span>
              </span>
              {t.url && (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mode-mono shrink-0 text-[0.65rem] uppercase tracking-[0.15em] text-accent"
                >
                  Play
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <SubHead>Top artists</SubHead>
        <ul className="grid gap-3">
          {artists.map((a, i) => (
            <li key={a.name} className="flex items-center gap-3">
              {a.image ? (
                <img src={a.image} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              ) : (
                <span className="h-12 w-12 shrink-0 rounded-full bg-secondary" aria-hidden />
              )}
              <span className="min-w-0">
                <span className="mode-mono font-display block truncate text-lg">
                  {i + 1}. {a.name}
                </span>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mode-mono text-[0.65rem] uppercase tracking-[0.15em] text-accent"
                  >
                    on Spotify →
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2"><Updated at={data.fetchedAt} /></div>
    </div>
  );
}

function StreakCalendar({ days }: { days: string[] }) {
  const set = new Set(days);
  const todayIso = londonToday();
  const y = Number(todayIso.slice(0, 4));
  const m = Number(todayIso.slice(5, 7));
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: ({ iso: string; day: number } | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ iso: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, day: d });
  }
  const label = first.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <div className="max-w-xs">
      <SubHead>{label}</SubHead>
      <div className="mode-mono grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        {cells.map((c, i) =>
          c ? (
            <span
              key={c.iso}
              title={c.iso}
              className="flex aspect-square items-center justify-center rounded-[4px]"
              style={{
                background: c.iso > todayIso ? "transparent" : set.has(c.iso) ? `#${siDuolingo.hex}` : "var(--secondary)",
                color: set.has(c.iso) ? "#fff" : undefined,
                outline: c.iso === todayIso ? "1px solid currentColor" : undefined,
              }}
            >
              {c.day}
            </span>
          ) : <span key={`e${i}`} />,
        )}
      </div>
    </div>
  );
}

function DuolingoPanel() {
  const engine = useSiteMode() === "engine";
  const { data } = useDuolingo();
  const hist = useQuery({ queryKey: ["duolingo-history"], queryFn: () => getDuolingoHistory(), staleTime: HOUR });
  if (!data) return <Skeleton />;
  const d = data.data;
  if (!d) return <Detail>Duolingo isn't answering right now.</Detail>;
  const done = !d.endDate || d.endDate >= londonToday();
  const joinYear = d.creationDate ? new Date(d.creationDate * 1000).getFullYear() : null;
  return (
    <div className="grid gap-8">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-end">
        <Figure>{engine ? <>streak: <CountUp value={d.streak} />d</> : <>🔥 <CountUp value={d.streak} /> days</>}</Figure>
        <div className="mode-mono grid grid-cols-3 gap-4 text-sm">
          <div><SubHead>Course</SubHead>{engine ? "es_ES" : "Spanish"}</div>
          <div><SubHead>Total XP</SubHead>{fmt(d.totalXp)}</div>
          <div><SubHead>Since</SubHead>{joinYear ?? "—"}</div>
        </div>
      </div>
      <Detail>
        {d.streak === 0 ? "streak resetting, as streaks do · " : ""}today's lesson: {done ? "done ✓" : "pending"}
      </Detail>
      <div>
        <SubHead>Streak calendar</SubHead>
        <StreakCalendar days={hist.data?.data ?? []} />
        <p className="mt-3 text-sm italic text-muted-foreground">
          history my site has been keeping since Nov 2026 — the API doesn't keep it for me
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Ext href="https://www.duolingo.com/profile/ConorDuffy575519">Duolingo profile →</Ext>
        <Updated at={data.fetchedAt} />
      </div>
    </div>
  );
}

const PANELS: Record<Key, () => ReactNode> = {
  strava: StravaPanel,
  letterboxd: LetterboxdPanel,
  spotify: SpotifyPanel,
  duolingo: DuolingoPanel,
};

/* ---------- panel shell ---------- */
function Panel({ active, onSwitch, onClose }: { active: Key; onSwitch: (k: Key) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const app = APPS.find((a) => a.key === active)!;
  const { live } = useTileMeta(active);
  const Body = PANELS[active];
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      role="region"
      aria-label={`${app.label} — ${app.app}`}
      {...(reduce ? {} : { layoutId: `tile-${active}` })}
      transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
      className="paper-card !transform-none outline-none"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <motion.span {...(reduce ? {} : { layoutId: `chip-${active}` })}><Chip app={app} size={44} /></motion.span>
        <div className="mr-auto leading-tight">
          <p className="mode-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{app.label}</p>
          <p className="font-display text-xl">{app.app}</p>
        </div>
        <Badge live={live} />
        <div className="flex items-center gap-1.5" role="group" aria-label="Switch app">
          {APPS.map((a) => (
            <motion.button
              key={a.key}
              type="button"
              {...(a.key !== active && !reduce ? { layoutId: `tile-${a.key}` } : {})}
              aria-label={a.key === active ? `Close ${a.app}` : `Show ${a.app}`}
              aria-pressed={a.key === active}
              onClick={() => (a.key === active ? onClose() : onSwitch(a.key))}
              className={`rounded-xl p-0.5 transition-opacity ${a.key === active ? "ring-1 ring-foreground/30" : "opacity-60 hover:opacity-100"}`}
            >
              <Chip app={a} size={30} />
            </motion.button>
          ))}
        </div>
        <button type="button" onClick={onClose} aria-label="Close panel" className="ml-1 grid h-8 w-8 place-items-center rounded-full text-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
          ✕
        </button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className="pt-6"
        >
          <div className="grid gap-8 md:grid-cols-[1fr_200px] md:items-start">
            <div className="min-w-0"><Body /></div>
            <OffClockPolaroid />
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/** Newest fetch time across the live sources, for the "LIVE · UPDATED …" eyebrow. */
export function useLiveUpdatedLabel() {
  const times = [useStrava().data, useSpotify().data, useLetterboxd().data, useDuolingo().data]
    .map((d) => (d as { fetchedAt?: number } | undefined)?.fetchedAt ?? 0);
  const at = Math.max(...times);
  return at ? `LIVE · UPDATED ${relTime(at).toUpperCase()}` : undefined;
}

export function LiveTiles() {
  const [open, setOpen] = useState<Key | null>(null);
  const tileRefs = useRef<Partial<Record<Key, HTMLButtonElement | null>>>({});
  const lastOpened = useRef<Key | null>(null);
  const reduce = useReducedMotion();

  const close = () => {
    const k = lastOpened.current;
    setOpen(null);
    requestAnimationFrame(() => k && tileRefs.current[k]?.focus({ preventScroll: true }));
  };
  const openKey = (k: Key) => {
    lastOpened.current = k;
    setOpen(k);
  };

  useEffect(() => {
    const onOpen = () => openKey("strava");
    window.addEventListener("cd-open-tile", onOpen);
    return () => window.removeEventListener("cd-open-tile", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <LayoutGroup>
      <motion.div id="live-tiles" layout={!reduce} className="mb-12 scroll-mt-24" transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}>
        {open ? (
          <Panel active={open} onSwitch={openKey} onClose={close} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {APPS.map((a) => (
              <Tile key={a.key} app={a} onOpen={() => openKey(a.key)} btnRef={(el) => (tileRefs.current[a.key] = el)} />
            ))}
          </div>
        )}
      </motion.div>
    </LayoutGroup>
  );
}
