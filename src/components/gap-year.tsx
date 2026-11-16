import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { revealGapYear, useGapYear } from "@/lib/gap-year";
import { useSiteMode } from "@/lib/mode";

const BODY = "A year behind the bar at Fraunces Tavern, off Wall Street. It's where I learned the importance of showing up with a smile and delivering for customers in all conditions.";
const TAGS = "Service · Pace · Reading a room";
const CMD = "$ git stash pop";

/** Secret Journey chapter 02.5 behind a seam between KPMG and Deloitte. */
export function GapYear() {
  const open = useGapYear();
  const mode = useSiteMode();
  const reduce = useReducedMotion();
  if (!open) {
    return (
      <li id="gap-year" className="flex justify-center py-3">
        <button type="button" aria-label="Reveal hidden chapter" onClick={revealGapYear}
          className="group relative flex items-center gap-2 rounded-sm px-2 py-1 text-xs text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span aria-hidden className="w-10 border-t border-dashed border-border" />
          <span aria-hidden>{mode === "engine" ? "# 1 stashed change" : "⋯"}</span>
          <span aria-hidden className="w-10 border-t border-dashed border-border" />
          <span role="tooltip" className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-border bg-card px-2 py-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">hang on, a year's missing.</span>
        </button>
      </li>
    );
  }
  const t = reduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" as const };
  return (
    <motion.li id="gap-year" initial={{ height: 0 }} animate={{ height: "auto" }} transition={t} className="overflow-hidden border-b border-border">
      <motion.div initial={reduce ? false : { opacity: 0, y: 16, rotate: mode === "engine" ? 0 : -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, delay: 0.15, ease: "easeOut" }} className="py-9">
        {mode === "engine" ? <Stash instant={!!reduce} /> : <Receipt />}
      </motion.div>
    </motion.li>
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
  return (
    <div className="text-sm">
      <div className="text-accent">{CMD.slice(0, n)}</div>
      {done ? (
        <div className="mt-2" style={{ color: "#F5B841" }}>
          <div className="whitespace-pre">d4c1783  2017  nyc: gap year, behind the bar at fraunces tavern</div>
          <div className="mt-2 pl-6 text-muted-foreground">
            <div className="text-xs">02.5 · The gap year · New York · May 2017 – Sep 2018</div>
            <p className="no-slash mt-2 max-w-2xl">{BODY}</p>
            <div className="mt-2 text-xs">{TAGS}</div>
          </div>
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
