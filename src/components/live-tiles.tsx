import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { siDuolingo, siLetterboxd, siSpotify, siStrava, type SimpleIcon } from "simple-icons";
import { getDuolingoStats, getLetterboxdLatest, getStravaStats } from "@/lib/live/stats.functions";
import { useSiteMode } from "@/lib/mode";

const HOUR = 60 * 60 * 1000;
const fmt = (n: number) => n.toLocaleString("en-GB");
const londonToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

function BrandMark({ icon, color }: { icon: SimpleIcon; color?: string }) {
  const c = color ?? `#${icon.hex}`;
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
      style={{ background: `color-mix(in oklab, ${c} 14%, transparent)` }}
    >
      <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={20} height={20} style={{ fill: c }}>
        <path d={icon.path} />
      </svg>
    </span>
  );
}

function LiveBadge({ on }: { on: boolean }) {
  return on ? (
    <span className="mode-mono flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="live-dot" aria-hidden /> Live
    </span>
  ) : (
    <span className="mode-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/70">Soon</span>
  );
}

function Card({
  icon, color, app, label, live, children, footer,
}: {
  icon: SimpleIcon; color?: string; app: string; label: string; live: boolean; children: ReactNode; footer?: ReactNode;
}) {
  return (
    <article className="paper-card flex min-h-[12.5rem] flex-col">
      <header className="flex items-center gap-3">
        <BrandMark icon={icon} {...(color ? { color } : {})} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="mode-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
          <p className="font-display text-base">{app}</p>
        </div>
        <LiveBadge on={live} />
      </header>
      <div className="mt-5 flex-1">{children}</div>
      {footer ? <div className="mt-4 border-t border-border pt-3 text-sm">{footer}</div> : null}
    </article>
  );
}

const Figure = ({ children }: { children: ReactNode }) => (
  <p className="mode-mono font-display text-3xl leading-tight">{children}</p>
);
const Detail = ({ children }: { children: ReactNode }) => (
  <p className="mode-mono mt-2 text-sm text-muted-foreground">{children}</p>
);
const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="quiet-link text-accent">{children}</a>
);
const Skeleton = () => <div className="h-16 animate-pulse rounded bg-secondary/60" aria-hidden />;

function RunningCard() {
  const engine = useSiteMode() === "engine";
  const { data, isLoading } = useQuery({ queryKey: ["strava"], queryFn: () => getStravaStats(), staleTime: HOUR });
  if (!isLoading && !data) return null;
  const l = data?.latest;
  const via = l?.device_name ? ` via ${l.device_name}` : "";
  const link = data && data.source !== "stub" && l?.url ? l.url : null;
  return (
    <Card icon={siStrava} app="Strava" label="Running" live={data?.source === "strava"}
      footer={link ? <Ext href={link}>View on Strava</Ext> : undefined}>
      {!data || !l ? <Skeleton /> : (
        <>
          <Figure>{engine ? `month_km: ${data.month_km}` : `${data.month_km} km this month`}</Figure>
          <Detail>{engine
            ? `last: ${l.distance_km}km @ ${l.pace_min_per_km}/km · ${l.weekday}${via}`
            : `Last run: ${l.distance_km} km on ${l.weekday} · ${l.pace_min_per_km}/km${via}`}</Detail>
        </>
      )}
    </Card>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="tracking-tight" style={{ color: "#00a828" }} aria-label={`${rating} stars`}>
      {"★".repeat(full)}{rating % 1 ? "½" : ""}
    </span>
  );
}

function WatchingCard() {
  const engine = useSiteMode() === "engine";
  const { data, isLoading } = useQuery({ queryKey: ["letterboxd"], queryFn: () => getLetterboxdLatest(), staleTime: HOUR });
  if (!isLoading && !data) return null;
  const date = data?.watchedDate
    ? new Date(data.watchedDate + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : null;
  return (
    <Card icon={siLetterboxd} color="#ff8000" app="Letterboxd" label="Watching" live={!!data}
      footer={<Ext href="https://letterboxd.com/cduffy67/films/">See all films →</Ext>}>
      {!data ? <Skeleton /> : (
        <a href={data.url} target="_blank" rel="noreferrer" className="group flex gap-4">
          {data.poster ? (
            <img src={data.poster} alt={`${data.title} poster`} loading="lazy"
              className="aspect-[2/3] w-16 shrink-0 rounded object-cover ring-1 ring-border" style={{ borderRadius: 4 }} />
          ) : null}
          <div className="min-w-0">
            <p className="mode-mono font-display text-xl leading-snug group-hover:text-accent">
              {data.title}{data.year ? <span className="text-muted-foreground"> {engine ? `(${data.year})` : data.year}</span> : null}
            </p>
            {data.rating ? <p className="mt-1 text-lg"><Stars rating={data.rating} /></p> : null}
            {date ? <Detail>{engine ? `watched: ${data.watchedDate}` : `Watched ${date}`}</Detail> : null}
          </div>
        </a>
      )}
    </Card>
  );
}

function ListeningCard() {
  return (
    <Card icon={siSpotify} app="Spotify" label="Listening" live={false}>
      <p className="font-display text-xl italic text-muted-foreground">What's on repeat?</p>
      <Detail>Not connected yet.</Detail>
    </Card>
  );
}

function LearningCard() {
  const engine = useSiteMode() === "engine";
  const { data, isLoading } = useQuery({ queryKey: ["duolingo"], queryFn: () => getDuolingoStats(), staleTime: HOUR });
  if (!isLoading && !data) return null;
  const done = data ? !data.endDate || data.endDate >= londonToday() : false;
  const joinYear = data?.creationDate ? new Date(data.creationDate * 1000).getFullYear() : null;
  return (
    <Card icon={siDuolingo} app="Duolingo" label="Learning" live={!!data}
      footer={<Ext href="https://www.duolingo.com/profile/ConorDuffy575519">Duolingo profile →</Ext>}>
      {!data ? <Skeleton /> : (
        <>
          <Figure>{engine ? `streak: ${fmt(data.streak)}d` : `🔥 ${fmt(data.streak)} days`}</Figure>
          <Detail>{engine
            ? `es_ES · xp: ${fmt(data.totalXp)}`
            : data.streak === 0
              ? "Learning Spanish · streak resetting, as streaks do"
              : `Learning Spanish${joinYear ? ` · since ${joinYear}` : ""}`}</Detail>
          <Detail>today's lesson: {done ? "done ✓" : "pending"}</Detail>
        </>
      )}
    </Card>
  );
}

export function LiveTiles() {
  return (
    <div className="mb-12 grid gap-5 sm:grid-cols-2">
      <RunningCard />
      <WatchingCard />
      <ListeningCard />
      <LearningCard />
    </div>
  );
}
