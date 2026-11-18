import { useSyncExternalStore } from "react";

/**
 * Easter egg hunt. Every egg calls findEgg(id) when it fires. Progress lives in
 * localStorage; the clock only runs while the tab is visible, so "time to three"
 * is time spent hunting, not time since a first visit weeks ago.
 */
export const EGGS = [
  { id: "rain", name: "Wet Tuesday", hint: "It's always a wet Tuesday somewhere." },
  { id: "snail", name: "The snail", hint: "Built quickly, tweaked…" },
  { id: "headshot", name: "Five taps", hint: "Persistence on the home page pays off." },
  { id: "offclock", name: "Off the clock", hint: "Work hard. Then what?" },
  { id: "home", name: "The chimneys", hint: "Where it all started. One letter will do." },
  { id: "route", name: "The long way round", hint: "How did he end up in London?" },
  { id: "gapyear", name: "The missing year", hint: "⌘K: there's a year missing from the journey." },
  { id: "coffee", name: "Coffee", hint: "⌘K: what is he always up for?" },
  { id: "dublin", name: "Home vs here", hint: "⌘K: check in on the home town." },
  { id: "hola", name: "¡Hola!", hint: "⌘K: say hi, en español." },
  { id: "seance", name: "No séance", hint: "⌘K: no need to talk to the dead." },
  { id: "demo", name: "Demo gods", hint: "⌘K: what does every SE get asked for?" },
  { id: "sudo", name: "Nice try", hint: "⌘K: ask for admin rights." },
  { id: "rmrf", name: "Everything's versioned", hint: "Under the hood, in the terminal: delete everything." },
] as const;
export type EggId = (typeof EGGS)[number]["id"];
export const TOTAL = EGGS.length;
export const TARGET = 3;

export type Entry = { id: string; token: string; name: string };
type State = { found: Partial<Record<EggId, number>>; played: number; at3?: number; entry?: Entry; skipped?: boolean };
type Pop = { n: number; x: number; y: number; id: EggId; key: number };

const KEY = "cd-hunt";
let state: State | null = null;
let pop: Pop | null = null;
let panel: "closed" | "submit" | "board" = "closed";
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function load(): State {
  if (state) return state;
  try { state = JSON.parse(localStorage.getItem(KEY) ?? "") as State; } catch { state = null; }
  if (!state || typeof state !== "object" || !state.found) state = { found: {}, played: 0 };
  return state;
}
function save(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: memory only */ }
  emit();
}
const count = (s: State) => Object.keys(s.found).length;

/* ---------- clock: visible time only, frozen once three are found ---------- */
let ticking = false;
export function startHuntClock() {
  if (ticking || typeof window === "undefined") return;
  ticking = true;
  let last = Date.now();
  window.setInterval(() => {
    const now = Date.now();
    const s = load();
    if (document.visibilityState === "visible" && s.at3 == null) {
      s.played += Math.min(now - last, 5000);
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
    }
    last = now;
  }, 1000);
}

/* ---------- where the last click happened, so +1 pops next to it ---------- */
let lastPointer = { x: 0, y: 0, t: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", (e) => { lastPointer = { x: e.clientX, y: e.clientY, t: Date.now() }; }, { capture: true, passive: true });
}

/* ---------- ding: soft bell in Boardroom, coin blip in Engine room ---------- */
let ctx: AudioContext | null = null;
function ding() {
  try {
    if (localStorage.getItem("cd-muted") === "1") return;
    ctx ??= new AudioContext();
    const c = ctx;
    const engine = document.documentElement.dataset["mode"] === "engine";
    const notes = engine ? [988, 1319] : [1319, 1976];
    notes.forEach((f, i) => {
      const t = c.currentTime + i * (engine ? 0.08 : 0.11);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = engine ? "square" : "sine";
      o.frequency.value = f;
      const peak = engine ? 0.04 : 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (engine ? 0.18 : 0.6));
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 0.7);
    });
  } catch { /* no audio, no problem */ }
}

/** Call from any egg. Idempotent: only the first find of each egg scores. */
export function findEgg(id: EggId) {
  if (typeof window === "undefined") return;
  const s = load();
  if (s.found[id]) return;
  const next: State = { ...s, found: { ...s.found, [id]: Date.now() } };
  const n = count(next);
  if (n === TARGET && next.at3 == null) next.at3 = next.played;
  save(next);
  ding();
  const fresh = Date.now() - lastPointer.t < 1500;
  pop = { n, id, key: Date.now(), x: fresh ? lastPointer.x : window.innerWidth / 2, y: fresh ? lastPointer.y : window.innerHeight * 0.35 };
  emit();
  if (n === TARGET && !next.entry && !next.skipped) window.setTimeout(() => openHunt("submit"), 1500);
  else if (next.entry) window.dispatchEvent(new CustomEvent("cd-hunt-sync", { detail: n }));
}

export function openHunt(which: "submit" | "board" = "board") {
  const s = load();
  panel = which === "submit" && s.at3 != null && !s.entry ? "submit" : "board";
  emit();
}
export function closeHunt(skip = false) {
  panel = "closed";
  if (skip) save({ ...load(), skipped: true });
  else emit();
}
export function saveEntry(entry: Entry) { save({ ...load(), entry }); }

export function useHunt() {
  const snap = useSyncExternalStore(
    (f) => { subs.add(f); return () => subs.delete(f); },
    () => `${count(load())}|${load().at3 ?? ""}|${load().entry?.id ?? ""}|${pop?.key ?? ""}|${panel}`,
    () => "",
  );
  const s = snap ? load() : ({ found: {}, played: 0 } as State);
  return { found: s.found, count: count(s), at3: s.at3, entry: s.entry, pop: snap ? pop : null, panel: snap ? panel : "closed" };
}

export function formatTime(ms: number) {
  const sec = Math.round(ms / 1000);
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
