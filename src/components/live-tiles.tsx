import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { siDuolingo, siLetterboxd, siSpotify, siStrava, type SimpleIcon } from "simple-icons";
import { getDuolingoStats, getStravaStats } from "@/lib/live/stats.functions";
import { useSiteMode } from "@/lib/mode";

const HOUR = 60 * 60 * 1000;
const fmt = (n: number) => n.toLocaleString("en-GB");
const londonToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

function Logo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" width={20} height={20} className="fill-foreground">
      <path d={icon.path} />
    </svg>
  );
}

function stop(e: React.SyntheticEvent) {
  e.stopPropagation();
}
function CardLink({ href, children, external = true }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      onClick={stop}
      onKeyDown={stop}
      className="quiet-link mt-3 inline-block text-sm text-accent"
    >
      {children}
    </a>
  );
}

function Figure({ children }: { children: ReactNode }) {
  return <p className="mode-mono font-display text-3xl leading-tight">{children}</p>;
}
function Detail({ children }: { children: ReactNode }) {
  return <p className="mode-mono mt-2 text-sm text-muted-foreground">{children}</p>;
}

type CardProps = {
  icon: SimpleIcon;
  label: string;
  teaser: string;
  back: ReactNode;
  index: number;
  hinted: boolean;
};

function FlipCard({ icon, label, teaser, back, index, hinted }: CardProps) {
  const engine = useSiteMode() === "engine";
  const [flipped, setFlipped] = useState(false);
  const showBack = engine || flipped;
  const toggle = () => !engine && setFlipped((f) => !f);

  const header = (
    <div className="flex items-center gap-3">
      <Logo icon={icon} />
      <span className="mode-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={engine ? -1 : 0}
      aria-pressed={showBack}
      aria-label={`${label}: ${teaser}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`flip-card ${engine ? "" : "cursor-pointer"} ${hinted ? "flip-hint" : ""}`}
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <div className={`flip-inner ${showBack ? "is-flipped" : ""}`}>
        <div className="flip-face flip-front paper-card" aria-hidden={showBack}>
          {header}
          <p className="mt-6 font-display text-2xl italic leading-snug">{teaser}</p>
          <span className="absolute bottom-4 right-5 text-xs text-muted-foreground">tap to flip ↻</span>
        </div>
        <div className="flip-face flip-back paper-card" aria-hidden={!showBack}>
          {header}
          <div className="mt-5">{back}</div>
        </div>
      </div>
    </div>
  );
}

function RunningBack() {
  const engine = useSiteMode() === "engine";
  const { data, isLoading } = useQuery({ queryKey: ["strava"], queryFn: () => getStravaStats(), staleTime: HOUR });
  if (isLoading) return <Detail>loading…</Detail>;
  if (!data) return <Detail>Out for a run. Back soon.</Detail>;
  const l = data.latest;
  const via = l.device_name ? ` via ${l.device_name}` : "";
  const link = data.source !== "stub" && l.url ? l.url : null;
  return (
    <>
      {engine ? (
        <Figure>month_km: {data.month_km}</Figure>
      ) : (
        <Figure>{data.month_km} km this month</Figure>
      )}
      <Detail>
        {engine
          ? `last: ${l.distance_km}km @ ${l.pace_min_per_km}/km · ${l.weekday}${via}`
          : `Last run: ${l.distance_km} km on ${l.weekday} · ${l.pace_min_per_km}/km${via}`}
      </Detail>
      {link && <CardLink href={link}>View on Strava</CardLink>}
    </>
  );
}

function LearningBack() {
  const engine = useSiteMode() === "engine";
  const { data, isLoading } = useQuery({ queryKey: ["duolingo"], queryFn: () => getDuolingoStats(), staleTime: HOUR });
  if (isLoading) return <Detail>loading…</Detail>;
  if (!data) return <Detail>Practising quietly. Check back later.</Detail>;
  const done = !data.endDate || data.endDate >= londonToday();
  const joinYear = data.creationDate ? new Date(data.creationDate * 1000).getFullYear() : null;
  return (
    <>
      <Figure>{engine ? `streak: ${fmt(data.streak)}d` : `🔥 ${fmt(data.streak)} days`}</Figure>
      <Detail>
        {engine
          ? `es_ES · xp: ${fmt(data.totalXp)}`
          : data.streak === 0
            ? "Learning Spanish · streak resetting, as streaks do"
            : `Learning Spanish${joinYear ? ` · since ${joinYear}` : ""}`}
      </Detail>
      <Detail>today's lesson: {done ? "done ✓" : "pending"}</Detail>
      <CardLink href="https://www.duolingo.com/profile/ConorDuffy575519">Duolingo profile</CardLink>
    </>
  );
}

function ComingSoon({ what }: { what: string }) {
  return (
    <>
      <Figure>Soon.</Figure>
      <Detail>{what} isn't connected yet.</Detail>
    </>
  );
}

export function LiveTiles() {
  const ref = useRef<HTMLDivElement>(null);
  const [hinted, setHinted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setHinted(true);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cards = [
    { icon: siStrava, label: "Running", teaser: "How far this month?", back: <RunningBack /> },
    { icon: siLetterboxd, label: "Watching", teaser: "What did I watch last?", back: <ComingSoon what="Letterboxd" /> },
    { icon: siSpotify, label: "Listening", teaser: "What's on repeat?", back: <ComingSoon what="Spotify" /> },
    { icon: siDuolingo, label: "Learning", teaser: "How many days in a row?", back: <LearningBack /> },
  ];
  return (
    <div ref={ref} className="mb-12 grid gap-5 sm:grid-cols-2">
      {cards.map((c, i) => (
        <FlipCard key={c.label} {...c} index={i} hinted={hinted} />
      ))}
    </div>
  );
}
