import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { toast } from "sonner";
import { Volume2, VolumeX } from "lucide-react";
import { setSiteMode } from "@/lib/mode";
import { buildHome } from "@/lib/home";
import headshot from "@/assets/headshot.png.asset.json";
import offClockPhoto from "@/assets/marathon_pint.png.asset.json";

/* ---------- tiny stores ---------- */
function store<T>(initial: T) {
  let v = initial;
  const ls = new Set<() => void>();
  return {
    get: () => v,
    set: (n: T) => { v = n; ls.forEach((l) => l()); },
    use: (server: T) => useSyncExternalStore((l) => { ls.add(l); return () => ls.delete(l); }, () => v, () => server),
  };
}
const muted = store(false);
const MUTE_KEY = "cd-muted";
export const offClock = store(false);
export const useOffClock = () => offClock.use(false);
export const setOffClock = (on: boolean) => offClock.set(on);

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- sound (Web Audio, only after a click) ---------- */
let ctx: AudioContext | null = null;
function rainSound(seconds: number) {
  if (muted.get()) return;
  try {
    ctx ??= new AudioContext();
    const c = ctx;
    const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.7;
    const g = c.createGain(); const t = c.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 1.2);
    g.gain.setValueAtTime(0.05, t + seconds - 1.5);
    g.gain.linearRampToValueAtTime(0, t + seconds);
    src.connect(bp).connect(g).connect(c.destination);
    src.start();
  } catch { /* no audio, no problem */ }
}

/* ---------- rain ---------- */
const RAIN_EVENT = "cd-rain";
export function startRain() {
  toast("wet tuesday mode. umbrellas recommended.");
  if (reduced()) return;
  rainSound(6);
  window.dispatchEvent(new Event(RAIN_EVENT));
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#1f4fff";
}

function RainCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => setOn(true);
    window.addEventListener(RAIN_EVENT, go);
    return () => window.removeEventListener(RAIN_EVENT, go);
  }, []);
  useEffect(() => {
    if (!on || !ref.current) return;
    const cv = ref.current; const g = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; g.scale(dpr, dpr);
    const accent = cssVar("--accent");
    type Drop = { x: number; y: number; v: number; s: number };
    type Splash = { x: number; t: number };
    const drops: Drop[] = []; const splashes: Splash[] = [];
    const start = performance.now(); let raf = 0;
    const drawDrop = (x: number, y: number, s: number) => {
      g.save(); g.translate(x, y); g.rotate(-0.35); g.scale(s, s);
      g.beginPath(); g.moveTo(0, -10); g.bezierCurveTo(5, -3, 7, 2, 7, 5); g.arc(0, 5, 7, 0, Math.PI); g.bezierCurveTo(-7, 2, -5, -3, 0, -10);
      g.fillStyle = `color-mix(in srgb, ${accent} 30%, white)`; g.fill();
      g.lineWidth = 1.6; g.strokeStyle = accent; g.stroke();
      g.beginPath(); g.ellipse(-2.5, 4, 1.6, 2.6, 0.3, 0, Math.PI * 2); g.fillStyle = "white"; g.fill();
      g.restore();
    };
    const tick = (now: number) => {
      const el = now - start;
      g.clearRect(0, 0, W, H);
      if (el < 5200) for (let i = 0; i < 2; i++) drops.push({ x: Math.random() * (W + 300) - 100, y: -20, v: 5 + Math.random() * 4, s: 0.7 + Math.random() * 0.6 });
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]!; d.y += d.v; d.x -= d.v * 0.36;
        if (d.y > H - 6) { splashes.push({ x: d.x, t: 0 }); drops.splice(i, 1); continue; }
        drawDrop(d.x, d.y, d.s);
      }
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i]!; s.t += 1;
        g.beginPath(); g.ellipse(s.x, H - 4, 4 + s.t, 1.5 + s.t / 4, 0, 0, Math.PI * 2);
        g.globalAlpha = Math.max(0, 1 - s.t / 18); g.strokeStyle = accent; g.lineWidth = 1.2; g.stroke(); g.globalAlpha = 1;
        if (s.t > 18) splashes.splice(i, 1);
      }
      if (el < 6000 || drops.length) raf = requestAnimationFrame(tick); else setOn(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  if (!on) return null;
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}

/* ---------- triggers ---------- */
export function WetTrigger({ children }: { children: ReactNode }) {
  return (
    <button type="button" onClick={startRain} aria-label={`${String(children)}: make it rain`} className="egg-trigger">
      {children}<span aria-hidden="true" className="ml-0.5 text-[0.7em] opacity-60">☂</span>
    </button>
  );
}

/** Wrap one phrase inside a plain string with a trigger. */
export function withWet(text: string | undefined, phrase: string): ReactNode {
  if (!text) return text;
  const i = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<WetTrigger>{text.slice(i, i + phrase.length)}</WetTrigger>{text.slice(i + phrase.length)}</>;
}

export function SnailFooterLine() {
  const [run, setRun] = useState(0);
  const [slow, setSlow] = useState(false);
  const start = () => { toast("tweaking in progress."); if (!reduced()) { setSlow(false); setRun((r) => r + 1); } };
  return (
    <p className="relative italic">
      Built quickly, tweaked{" "}
      <button type="button" onClick={start} aria-label="slowly: release the snail" className="egg-trigger italic">slowly</button>.
      {run ? (
        <button key={run} type="button" aria-label="Slow the snail down" onClick={() => setSlow(true)}
          onAnimationEnd={() => setRun(0)}
          className="snail" style={{ animationDuration: slow ? "16s" : "8s" }}>🐌</button>
      ) : null}
    </p>
  );
}

export function MuteToggle() {
  const m = muted.use(false);
  useEffect(() => { muted.set(localStorage.getItem(MUTE_KEY) === "1"); }, []);
  const flip = () => { const n = !m; muted.set(n); localStorage.setItem(MUTE_KEY, n ? "1" : "0"); };
  return (
    <button type="button" onClick={flip} aria-label={m ? "Unmute sounds" : "Mute sounds"} aria-pressed={m} className="inline-flex items-center gap-1 hover:text-foreground">
      {m ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}

/* ---------- global listeners: konami, E, console ---------- */
const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
export function EasterEggs() {
  useEffect(() => {
    console.log(
      "%c  ____ ____  \n / ___|  _ \\ \n| |   | | | |\n| |___| |_| |\n \\____|____/ \n\nlooking under the hood? you'd like the engine room. press E.",
      "color:#5bf870;background:#1c1714;font-family:monospace;padding:8px 12px;line-height:1.2",
    );
    let seq: string[] = [];
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      seq = [...seq, k].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) { seq = []; startRain(); return; }
      if (!e.metaKey && !e.ctrlKey && !e.altKey) { if (k === "e") setSiteMode("engine"); else if (k === "b" && seq.at(-2) !== "arrowright") setSiteMode("boardroom"); else if (k === "s") buildHome(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return <RainCanvas />;
}

export const OFF_CLOCK_CAPTION = "Work hard. Celebrate the wins.";
export const OFF_CLOCK_SRC = offClockPhoto.url;

/** Quiet on/off-the-clock photo swap for Beyond work panels. */
export function OffClockPolaroid() {
  const on = useOffClock();
  return (
    <figure id="off-clock" className="mx-auto w-full max-w-[200px] scroll-mt-24">
      <div className="relative aspect-square overflow-hidden rounded-[4px] bg-secondary">
        {[{ src: headshot.url, alt: "Conor at work", show: !on }, { src: offClockPhoto.url, alt: "Conor off the clock", show: on }].map((f) => (
          <img key={f.src} src={f.src} alt={f.alt} aria-hidden={!f.show}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-[400ms] motion-reduce:transition-none ${f.show ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
      <figcaption className="mt-2 min-h-[1.4em] text-xs text-muted-foreground">{on ? OFF_CLOCK_CAPTION : ""}</figcaption>
      <button type="button" onClick={() => setOffClock(!on)}
        className="mode-mono mt-1 rounded-sm text-[0.68rem] text-muted-foreground/70 transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {on ? "↻ on the clock" : "↻ off the clock"}
      </button>
    </figure>
  );
}
