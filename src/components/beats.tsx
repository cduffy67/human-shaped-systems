import { Fragment, createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useSiteMode } from "@/lib/mode";
import { HEADING_CHAR_MS, HEADING_WORD_STAGGER_MS, LINE_STAGGER_MS, OPENERS, OPENER_CHAR_MS, planSection, type OpenerKey } from "@/lib/motion";

/* Fast-scroll detector: more than one viewport in under 300ms flushes every section in view. */
const FLUSH = "cd-beats-flush";
let samples: { t: number; y: number }[] = [];
if (typeof window !== "undefined") {
  window.addEventListener("scroll", () => {
    const t = performance.now();
    samples = [...samples.filter((s) => t - s.t < 300), { t, y: window.scrollY }];
    if (Math.abs(samples[samples.length - 1]!.y - samples[0]!.y) > window.innerHeight) { samples = []; window.dispatchEvent(new Event(FLUSH)); }
  }, { passive: true });
}

type State = "idle" | "play" | "done" | "instant";
type Ctx = { state: State; ready: boolean; headStart: number; opener?: OpenerKey | undefined; openerText?: string | undefined };
const BeatsCtx = createContext<Ctx>({ state: "instant", ready: true, headStart: 0 });
const InstantCtx = createContext(false);

/** Wrap a subtree (e.g. the print view) to show every section fully, without motion. */
export const BeatsInstant = ({ children }: { children: ReactNode }) => <InstantCtx.Provider value>{children}</InstantCtx.Provider>;
/** True once a section's three beats have finished: illustrations start drawing then. */
export const useBeatsReady = () => useContext(BeatsCtx).ready;

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;
const SEEN = "cd-beats";
const seen = (): string[] => { try { return JSON.parse(sessionStorage.getItem(SEEN) ?? "[]"); } catch { return []; } };
const markSeen = (id: string) => { try { sessionStorage.setItem(SEEN, JSON.stringify([...new Set([...seen(), id])])); } catch { /* private mode */ } };

/**
 * One section entrance: opener (typed or drawn) → heading (typed or word rise) → `.beat` lines.
 * Once per session per id; click to finish; reduced motion shows everything at once.
 */
export function Beats({ id, opener, openerText, heading, as: Tag = "section", className = "", placeOpener = true, children }: { id: string; opener?: OpenerKey | undefined; /** Overrides the opener text (e.g. a live timestamp). */ openerText?: string | undefined; heading?: string | undefined; as?: ElementType; className?: string; /** false: render <BeatOpener /> yourself (e.g. inside a grid column). */ placeOpener?: boolean; children: ReactNode }) {
  const mode = useSiteMode();
  const instantAll = useContext(InstantCtx);
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("idle");
  const plan = useRef(planSection({ opener, openerText, heading, lines: 0, mode }));

  useIso(() => {
    if (instantAll || seen().includes(id) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) setState("instant");
  }, [id, instantAll]);

  // Assign content delays in DOM order; the hero circle (data-beat-last) goes after everything.
  useIso(() => {
    const root = ref.current;
    if (!root) return;
    const lines = [...root.querySelectorAll<HTMLElement>(".beat")].filter((el) => el.closest("[data-beats]") === root);
    const p = planSection({ opener, openerText, heading, lines: lines.length, mode });
    plan.current = p;
    lines.forEach((el, i) => el.style.setProperty("--d", String(p.contentStart + i * LINE_STAGGER_MS)));
    root.querySelectorAll<HTMLElement>("[data-beat-last]").forEach((el) => el.style.setProperty("--d", String(p.lastLine + LINE_STAGGER_MS)));
    root.style.setProperty("--k", String(p.scale));
  }, [mode, opener, openerText, heading, children]);

  useEffect(() => {
    if (state !== "idle" || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      markSeen(id);
      setState("play");
    }, { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [state, id]);

  // Never leave a section half-shown: finish it if it scrolls off the top, or on a fast scroll while in view.
  useEffect(() => {
    if (state === "done" || state === "instant") return;
    const el = ref.current;
    if (!el) return;
    const finish = () => { markSeen(id); setState("instant"); };
    const onScroll = () => { if (el.getBoundingClientRect().bottom < 0) finish(); };
    const onFlush = () => { const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) finish(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(FLUSH, onFlush);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener(FLUSH, onFlush); };
  }, [state, id]);

  useEffect(() => {
    if (state !== "play") return;
    const t = window.setTimeout(() => setState("done"), plan.current.total + 500);
    return () => window.clearTimeout(t);
  }, [state]);

  const ready = state === "done" || state === "instant";
  return (
    <BeatsCtx.Provider value={{ state, ready, headStart: plan.current.headStart, opener, openerText }}>
      <Tag ref={ref} data-beats="" data-state={state} className={className} onClick={() => state === "play" && setState("instant")}>
        {opener && placeOpener ? <Opener k={opener} text={openerText} /> : null}
        {children}
      </Tag>
    </BeatsCtx.Provider>
  );
}

export function BeatOpener() {
  const { opener, openerText } = useContext(BeatsCtx);
  return opener ? <Opener k={opener} text={openerText} /> : null;
}

/** Typed letter by letter in both rooms: a green command in Engine room, a blue mono eyebrow in Boardroom. */
function Opener({ k, text: override }: { k: OpenerKey; text?: string | undefined }) {
  const mode = useSiteMode();
  const text = (mode === "boardroom" ? override : undefined) ?? OPENERS[k][mode];
  const cls = mode === "engine"
    ? "beat-opener no-slash mb-4 text-sm font-medium text-accent"
    : "beat-opener no-slash mode-mono mb-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-accent";
  return (
    <p className={cls} aria-label={text}>
      <span aria-hidden="true">{[...text].map((c, i) => <span key={i} className="beat-char" style={{ "--d": i * OPENER_CHAR_MS } as CSSProperties}>{c}</span>)}</span>
    </p>
  );
}

/** Heading beat: types per character in Engine room, rises word by word in Boardroom. `|` = line break. */
export function BeatHeading({ text, as: Tag = "h2", className = "", circle, cursor }: { text: string; as?: ElementType; className?: string; circle?: string; cursor?: boolean }) {
  const mode = useSiteMode();
  const { headStart } = useContext(BeatsCtx);
  const lines = text.split("|");
  let ci = 0, wi = 0;
  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span key={li}>
            {line.split(" ").filter(Boolean).map((word, w, arr) => {
              const delayWord = headStart + wi++ * HEADING_WORD_STAGGER_MS;
              const bare = word.replace(/[.,]$/, "");
              const inner = mode === "engine"
                ? [...word].map((c, i) => <span key={i} className="beat-char" style={{ "--d": headStart + ci++ * HEADING_CHAR_MS } as CSSProperties}>{c}</span>)
                : word;
              if (mode === "engine") ci++; // the space
              const node = circle && bare === circle && mode === "boardroom" ? (
                <span className="relative inline-block">
                  {inner}
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="beat-circle pointer-events-none absolute -inset-x-[6%] -inset-y-[18%] h-[136%] w-[112%] fill-none text-accent" data-beat-last="">
                    <path d="M 120 6 C 60 2 6 12 5 31 C 4 50 60 58 110 56 C 165 54 196 44 195 28 C 194 12 160 4 98 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" pathLength={1} />
                  </svg>
                </span>
              ) : inner;
              return (
                <Fragment key={w}>
                  <span className={mode === "engine" ? "whitespace-nowrap" : "beat-word"} style={mode === "engine" ? undefined : ({ "--d": delayWord } as CSSProperties)}>{node}</span>
                  {w < arr.length - 1 ? " " : null}
                </Fragment>
              );
            })}
            {li < lines.length - 1 ? <br /> : null}
          </span>
        ))}
        {cursor && mode === "engine" ? <span className="block-cursor" style={{ "--d": headStart + ci * HEADING_CHAR_MS } as CSSProperties} /> : null}
      </span>
    </Tag>
  );
}
