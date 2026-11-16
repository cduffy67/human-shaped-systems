import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getDuolingoStats, getStravaStats } from "@/lib/live/stats.functions";
import { useSiteMode } from "@/lib/mode";

const HOUR = 60 * 60 * 1000;
const fmt = (n: number) => n.toLocaleString("en-GB");

function londonToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
}

function Tile({ label, href, children }: { label: string; href?: string | undefined; children: ReactNode }) {
  const body = (
    <>
      <p className="mode-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <div className="mt-3">{children}</div>
    </>
  );
  const cls = "block h-full border-[0.5px] border-border bg-card p-5 transition-colors";
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls + " hover:bg-secondary/40"}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function Placeholder() {
  return <div className="h-36 animate-pulse border-[0.5px] border-border bg-secondary/50" aria-hidden />;
}

function Headline({ children }: { children: ReactNode }) {
  return <p className="mode-mono font-display text-2xl leading-tight">{children}</p>;
}
function Detail({ children }: { children: ReactNode }) {
  return <p className="mode-mono mt-2 text-sm text-muted-foreground">{children}</p>;
}

export function LearningTile() {
  const mode = useSiteMode();
  const { data, isLoading } = useQuery({ queryKey: ["duolingo"], queryFn: () => getDuolingoStats(), staleTime: HOUR });
  if (isLoading) return <Placeholder />;
  if (!data) return null;
  const done = !data.endDate || data.endDate >= londonToday();
  const joinYear = data.creationDate ? new Date(data.creationDate * 1000).getFullYear() : null;
  return (
    <Tile label="Learning" href="https://www.duolingo.com/profile/ConorDuffy575519">
      {mode === "engine" ? (
        <Headline>es_ES · streak: {fmt(data.streak)}d · xp: {fmt(data.totalXp)}</Headline>
      ) : (
        <Headline>🔥 {fmt(data.streak)} days</Headline>
      )}
      {mode !== "engine" && (
        <Detail>
          {data.streak === 0
            ? "Learning Spanish · streak resetting, as streaks do"
            : `Learning Spanish${joinYear ? ` · since ${joinYear}` : ""}`}
        </Detail>
      )}
      <Detail>today's lesson: {done ? "done ✓" : "pending"}</Detail>
    </Tile>
  );
}

export function RunningTile() {
  const mode = useSiteMode();
  const { data, isLoading } = useQuery({ queryKey: ["strava"], queryFn: () => getStravaStats(), staleTime: HOUR });
  if (isLoading) return <Placeholder />;
  if (!data) return null;
  const l = data.latest;
  const via = l.device_name ? ` via ${l.device_name}` : "";
  const link = data.source !== "stub" && l.url ? l.url : undefined;
  return (
    <Tile label="Running" href={link}>
      {mode === "engine" ? (
        <Headline>month_km: {data.month_km} · last: {l.distance_km}km @ {l.pace_min_per_km}/km · {l.weekday}{via}</Headline>
      ) : (
        <>
          <Headline>{data.month_km} km this month</Headline>
          <Detail>Last run: {l.distance_km} km on {l.weekday} · {l.pace_min_per_km}/km{via}</Detail>
        </>
      )}
      {link && <Detail>View on Strava</Detail>}
    </Tile>
  );
}

export function LiveTiles() {
  return (
    <div className="mb-12 grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
      <RunningTile />
      <LearningTile />
    </div>
  );
}
