import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { hideGapYear, revealGapYear, useGapYear } from "@/lib/gap-year";
import { useSiteMode } from "@/lib/mode";

const BODY = "A year behind the bar at Fraunces Tavern, off Wall Street. It's where I learned the importance of showing up with a smile and delivering for customers in all conditions.";
const TAGS = "Service · Pace · Reading a room";
const CMD = "$ git stash pop";
const HINT = "Hang on, a year's missing. 2017–2018";

const PINT = [
  "..FFFFFFF...", ".FWWWWWWWF..", ".FWWWWWWWF..", ".FBBBBBBBFHH",
  ".FBBBbBBBF.H", ".FBBBBBBBF.H", ".FBBBBBbBF.H", ".FBbBBBBBFHH",
  ".FBBBBBBBF..", "..FBBBBBF...", "..FBBbBBF...", "..FBBBBBF...",
  "..FBBBBBF...", "..FBBBBBF...", "..FFFFFFF...", "............",
];
const COLORS: Record<string, string> = { F: "#EFE6D8", H: "#EFE6D8", W: "#FFF4DA", B: "#F5B841", b: "#FFD27A" };
const ROWS = PINT.length;

/** Fill level 0..16 counted from the bottom; glass outline always drawn. */
function PixelPint({ filled, className }: { filled: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 16" shapeRendering="crispEdges" className={className} style={{ imageRendering: "pixelated" }}>
      {PINT.flatMap((row, y) => [...row].map((c, x) => {
        if (c === ".") return null;
        const glass = c === "F" || c === "H";
        if (!glass && y < ROWS - filled) return null;
        return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={COLORS[c]} />;
      }))}
    </svg>
  );
}

/** Steps a fill level toward target, one row per `ms`. */
function usePour(target: number, ms: number, instant: boolean) {
  const [n, setN] = useState(instant ? target : 0);
  useEffect(() => {
    if (instant) { setN(target); return; }
    if (n === target) return;
    const id = window.setTimeout(() => setN((v) => v + (v < target ? 1 : -1)), ms);
    return () => window.clearTimeout(id);
  }, [n, target, ms, instant]);
  return n;
}

function LinePint({ full }: { full: boolean }) {
  const ease = "transform 900ms ease-out";
  return (
    <svg aria-hidden viewBox="0 0 12 16" className="h-4 w-3 overflow-visible">
      <defs><clipPath id="gy-glass"><path d="M1.5 1 L10.5 1 L9 15 L3 15 Z" /></clipPath></defs>
      <g clipPath="url(#gy-glass)">
        <rect x="0" y="4" width="12" height="11" fill="#E9A23B" className="motion-reduce:!transition-none"
          style={{ transformOrigin: "50% 100%", transformBox: "fill-box", transform: `scaleY(${full ? 1 : 0})`, transition: ease }} />
        <rect x="0" y="1" width="12" height="3" fill="#FFF4DA" className="motion-reduce:!transition-none"
          style={{ opacity: full ? 1 : 0, transition: `opacity 250ms ease ${full ? "800ms" : "0ms"}` }} />
      </g>
      <path d="M1.5 1 L10.5 1 L9 15 L3 15 Z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Secret Journey chapter 02.5: a quiet row between KPMG and Deloitte, same shape in both rooms. */
export function GapYear() {
  const open = useGapYear();
  const engine = useSiteMode() === "engine";
  const reduce = !!useReducedMotion();
  const [hot, setHot] = useState(false);
  const full = open || hot;
  const pixels = usePour(full ? ROWS : 0, 55, reduce);
  const hint = engine ? `// ${HINT.charAt(0).toLowerCase()}${HINT.slice(1)}` : HINT;
  const control = engine ? (open ? "[ fold ↑ ]" : "[ unfold ↓ ]") : open ? "Fold ↑" : "Unfold ↓";
  const show = hot && !open;
  const slide = `transition-[opacity,transform] duration-300 motion-reduce:transition-none ${show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1.5"}`;
  const t = reduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" as const };
  return (
    <li id="gap-year" className="border-b border-border py-4">
      <button type="button" aria-expanded={open} aria-label={`${open ? "Fold" : "Unfold"} chapter 02.5. ${HINT}`}
        onClick={() => { (open ? hideGapYear : revealGapYear)(); setHot(false); }}
        onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} onFocus={() => setHot(true)} onBlur={() => setHot(false)}
        className={`grid w-full grid-cols-[auto_auto_1fr_auto] items-center gap-4 rounded-[4px] border border-dashed px-4 py-3 text-left text-sm transition-colors duration-300 focus-visible:outline-none ${full ? "border-accent bg-accent/5" : "border-border"}`}>
        <span className="mode-mono text-xs text-accent">02.5</span>
        {engine ? <PixelPint filled={pixels} className="h-4 w-3" /> : <span className="text-foreground"><LinePint full={full} /></span>}
        <span className={`${open ? "invisible" : ""} ${engine ? "text-[#EFE6D8]" : "text-foreground"} ${slide} motion-reduce:opacity-100 motion-reduce:translate-x-0`}>{hint}</span>
        <span aria-hidden className={`mode-mono text-xs text-accent ${open ? "" : `${slide} motion-reduce:opacity-100 motion-reduce:translate-x-0`}`}>{control}</span>
      </button>
      {open ? (
        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} transition={t} className="overflow-hidden">
          <motion.div initial={reduce ? false : { opacity: 0, y: 16, rotate: engine ? 0 : -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15, ease: "easeOut" }} className="py-9">
            {engine ? <Stash instant={reduce} /> : <Receipt />}
          </motion.div>
        </motion.div>
      ) : null}
    </li>
  );
}

function Stash({ instant }: { instant: boolean }) {
  const [n, setN] = useState(instant ? CMD.length : 0);
  useEffect(() => {
    if (n >= CMD.length) return;
    const id = window.setTimeout(() => setN((v) => v + 1), 45);
    return () => window.clearTimeout(id);
  }, [n]);
  const done = n >= CMD.length;
  const poured = usePour(done ? ROWS : 0, 90, instant);
  return (
    <div className="text-sm">
      <div className="text-accent">{CMD.slice(0, n)}</div>
      {done ? (
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div style={{ color: "#F5B841" }}>
            <div className="whitespace-pre-wrap">d4c1783  2017  nyc: gap year, behind the bar at fraunces tavern</div>
            <div className="mt-2 pl-6 text-muted-foreground">
              <div className="text-xs">02.5 · The gap year · New York · May 2017 – Sep 2018</div>
              <p className="no-slash mt-2 max-w-2xl">{BODY}</p>
              <div className="mt-2 text-xs">{TAGS}</div>
            </div>
          </div>
          <PixelPint filled={poured} className="h-[72px] w-[54px] shrink-0" />
        </div>
      ) : null}
    </div>
  );
}

function Receipt() {
  const zig = Array.from({ length: 41 }, (_, i) => `${100 - i * 2.5}% ${i % 2 ? "100%" : "calc(100% - 10px)"}`).join(", ");
  return (
    <div className="grid gap-x-10 gap-y-3 md:grid-cols-[10rem_1fr]">
      <div className="flex flex-col gap-1.5">
        <span className="mode-mono text-sm text-accent">02.5</span>
        <span className="text-sm text-muted-foreground">New York · May 2017 – Sep 2018</span>
      </div>
      <div className="relative max-w-md -rotate-[1.5deg] bg-card px-6 pb-10 pt-6 shadow-[0_10px_30px_-18px_rgb(17_17_17/0.35)]"
        style={{ clipPath: `polygon(0 0, 100% 0, ${zig})` }}>
        <svg aria-hidden viewBox="0 0 40 52" className="absolute right-4 top-4 h-12 w-10 fill-none stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6 Q20 3 34 6 L30 48 Q20 50 10 48 Z" />
          <path d="M7 14 Q20 11 33 14" />
          <path d="M6 6 q4 -4 9 -1 q5 -4 10 0 q5 -3 9 1" />
          <path d="M14 22 l1 18" />
        </svg>
        <p className="no-slash mode-mono text-[11px] tracking-wide text-muted-foreground">FRAUNCES TAVERN · 54 PEARL ST · NEW YORK</p>
        <div className="my-3 border-t border-dashed border-border" />
        <h2 className="text-2xl leading-snug">The gap year</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">{BODY}</p>
        <p className="mt-3 text-sm italic text-muted-foreground">{TAGS}</p>
        <div className="my-3 border-t border-dashed border-border" />
        <p className="no-slash mode-mono text-center text-xs tracking-widest">TIP: SMILE. ALWAYS.</p>
      </div>
    </div>
  );
}
