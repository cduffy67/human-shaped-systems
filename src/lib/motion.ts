/** Shared entrance timing for both rooms. Every section: opener → heading → content. */
export const OPENER_CHAR_MS = 45;
export const HEADING_CHAR_MS = 38;
export const HEADING_WORD_STAGGER_MS = 60;
export const LINE_STAGGER_MS = 110;
export const BEAT_GAP_MS = 200;
export const MAX_SECTION_MS = 2000;
/** Boardroom marker label draw-in, and per-word/line fade length. */
export const OPENER_DRAW_MS = 400;
export const FADE_MS = 400;

export const OPENERS = {
  hero: { engine: "$ whoami", boardroom: "CONOR DUFFY · LONDON / IRELAND" },
  exploring: { engine: "$ ls ./exploring", boardroom: "ON MY DESK" },
  tiles: { engine: "$ curl -s conor.dev/api/stats", boardroom: "LIVE · UPDATED" },
  about: { engine: "$ cat about.txt", boardroom: "OFF THE CLOCK" },
  cta: { engine: "$ cd ~/cases", boardroom: "THE PROOF" },
  what: { engine: "$ ls ./capabilities", boardroom: "IN SHORT" },
  how: { engine: "$ ./method --run", boardroom: "OPERATING MODEL" },
  journey: { engine: "$ git log --oneline career", boardroom: "THE WINDING VERSION" },
  buildlog: { engine: "$ git log --stat", boardroom: "BUILT IN PUBLIC" },
  cases: { engine: "$ cd ~/lab", boardroom: "SIDE PROJECTS" },
  contact: { engine: "$ mail conor", boardroom: "NEXT STEPS" },
} as const;
export type OpenerKey = keyof typeof OPENERS;

export type BeatMode = "engine" | "boardroom";

/** Both rooms type their opener letter by letter. `text` overrides the default (e.g. live timestamps). */
export function openerMs(key: OpenerKey | undefined, mode: BeatMode, text?: string) {
  if (!key) return 0;
  return [...(text ?? OPENERS[key][mode])].length * OPENER_CHAR_MS;
}

export function headingMs(text: string, mode: BeatMode) {
  const clean = text.replace(/\|/g, " ");
  if (mode === "engine") return clean.length * HEADING_CHAR_MS;
  const words = clean.split(/\s+/).filter(Boolean).length;
  return Math.max(words - 1, 0) * HEADING_WORD_STAGGER_MS + FADE_MS;
}

/** Delay plan for one section; `scale` compresses everything to fit MAX_SECTION_MS. */
export function planSection(opts: { opener?: OpenerKey | undefined; openerText?: string | undefined; heading?: string | undefined; lines: number; mode: BeatMode }) {
  const o = openerMs(opts.opener, opts.mode, opts.openerText);
  const headStart = o ? o + BEAT_GAP_MS : 0;
  const h = opts.heading ? headingMs(opts.heading, opts.mode) : 0;
  const contentStart = h ? headStart + h + BEAT_GAP_MS : headStart;
  const lastLine = contentStart + Math.max(opts.lines - 1, 0) * LINE_STAGGER_MS;
  const raw = lastLine + FADE_MS;
  const scale = raw > MAX_SECTION_MS ? (MAX_SECTION_MS - FADE_MS) / (raw - FADE_MS) : 1;
  return { headStart, contentStart, lastLine, scale, total: Math.min(raw, MAX_SECTION_MS) };
}
