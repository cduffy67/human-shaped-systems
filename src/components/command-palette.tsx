import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getHomeWeather } from "@/lib/live/weather.functions";
import { setOffClock } from "@/components/easter-eggs";
import { getDuolingoStats, getLetterboxd, getStravaStats } from "@/lib/live/stats.functions";
import { setSiteMode, useSiteMode } from "@/lib/mode";
import { revealGapYear } from "@/lib/gap-year";

const HOUR = 60 * 60 * 1000;
export const EMAIL = "conor_duffy@me.com";
const LETTERBOXD = "https://letterboxd.com/cduffy67/";
const OPEN_EVENT = "cd-palette";
export const openPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** ⌘K: an inline terminal in Engine room, a centred palette in Boardroom. Same command set. */
export function CommandPalette() {
  const mode = useSiteMode();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((v) => !v); }
      else if (e.key === "Escape") setOpen(false);
    };
    const ev = () => setOpen(true);
    window.addEventListener("keydown", key);
    window.addEventListener(OPEN_EVENT, ev);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener(OPEN_EVENT, ev); };
  }, []);
  if (!open) return null;
  return mode === "engine" ? <Terminal close={() => setOpen(false)} /> : <Palette close={() => setOpen(false)} />;
}

function useLive() {
  const s = useQuery({ queryKey: ["strava"], queryFn: () => getStravaStats(), staleTime: HOUR });
  const d = useQuery({ queryKey: ["duolingo"], queryFn: () => getDuolingoStats(), staleTime: HOUR });
  const l = useQuery({ queryKey: ["letterboxd"], queryFn: () => getLetterboxd(), staleTime: HOUR });
  const run = s.data?.data;
  const streak = d.data?.data?.streak;
  const film = l.data?.data?.recent[0]?.title;
  return {
    run: run ? `${run.month_km} km this month${run.year_km != null ? ` · ${run.year_km} km this year` : ""}` : "loading…",
    streak: streak != null ? `${streak.toLocaleString("en-GB")} days` : "loading…",
    film: film ?? "loading…",
  };
}

function useActions() {
  const navigate = useNavigate();
  return {
    go: (to: "/" | "/how-i-work" | "/journey" | "/build-log" | "/case-library" | "/contact", hash?: string) => (hash ? navigate({ to, hash }) : navigate({ to })),
    mail: () => window.setTimeout(() => { window.location.href = `mailto:${EMAIL}`; }, 600),
  };
}

type Line = { kind: "in" | "out"; text: string };

const DEMO = ["it worked five minutes ago, i swear.", "the demo gods have been consulted.", "this is the bit where the wifi drops."];
type EggResult = { text: string; link?: { to: "/build-log"; label: string } };

/** Shared easter-egg commands; same replies in both rooms. Returns null when not an egg. */
async function runEgg(cmd: string, ctx: { streak: string; go: ReturnType<typeof useActions>["go"] }): Promise<EggResult | null> {
  if (cmd.startsWith("sudo ") || cmd === "sudo") return { text: "nice try. this incident has been reported." };
  switch (cmd) {
    case "coffee": window.setTimeout(() => ctx.go("/contact"), 900); return { text: "always up for one. bring a good question." };
    case "dublin": {
      try {
        const w = await getHomeWeather();
        if (!w.ok) throw new Error();
        return { text: `dublin: ${w.dublin.time}, ${w.dublin.temp}°C ${w.dublin.conditions} · london: ${w.london.time}, ${w.london.temp}°C ${w.london.conditions}. home vs here.` };
      } catch { return { text: "weather's unavailable. assume rain." }; }
    }
    case "hola": return { text: `¡hola! llevo ${ctx.streak.replace(/ days$/, "")} días seguidos aprendiendo español.` };
    case "seance": case "séance": return { text: "no séance required. the seams are documented in ~/build-log.", link: { to: "/build-log", label: "~/build-log" } };
    case "nyc": case "gap year": case "fraunces": revealGapYear(); ctx.go("/journey", "gap-year"); return { text: "found it. a year behind the bar, now back on the record." };
    case "demo": return { text: DEMO[Math.floor(Math.random() * DEMO.length)]! };
    case "medal": setOffClock(true); ctx.go("/", "beyond"); return { text: "off the clock. medal earned, pint also earned." };
    default: return null;
  }
}
const RM_FILES = ["./src", "./src/routes", "./src/components", "./public", "./node_modules", "./ideas.txt", "./slides_final_v7.key", "./career", "./coffee_budget.csv", "./pipeline", "./confidence", "./README.md"];

function Terminal({ close }: { close: () => void }) {
  const live = useLive();
  const { go } = useActions();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "type 'help' for commands · esc to close" }]);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => input.current?.focus(), []);
  useEffect(() => end.current?.scrollIntoView({ block: "nearest" }), [lines]);

  const run = (raw: string): string | null => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    switch (cmd) {
      case "": return null;
      case "help": return "help whoami cases method journey stats films run streak contact coffee dublin hola seance demo medal boardroom clear";
      case "whoami": return "conor duffy · principal solutions engineer @ slack · london / ireland";
      case "cases": go("/case-library"); return "→ ~/cases";
      case "method": go("/how-i-work"); return "→ ~/how-i-work";
      case "journey": go("/journey"); return "→ ~/journey";
      case "stats": go("/", "beyond"); return "→ ~/home#beyond";
      case "films": return `last_watched: ${live.film} · ${LETTERBOXD}`;
      case "run": return `strava: ${live.run}`;
      case "streak": return `duolingo es_ES streak: ${live.streak}`;
      case "contact": go("/contact"); return `→ ~/contact · ${EMAIL}`;
      case "boardroom": setSiteMode("boardroom"); return "switching to boardroom…";
      default: return `command not found: ${cmd}. try 'help'`;
    }
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === "clear") { setLines([]); setValue(""); return; }
    const cmd = value.trim().toLowerCase().replace(/\s+/g, " ");
    const push = (text: string) => setLines((l) => [...l, { kind: "out", text }]);
    setLines((l) => [...l, { kind: "in", text: value }]);
    setValue("");
    if (cmd === "rm -rf /" || cmd === "sudo rm -rf /") {
      RM_FILES.forEach((f, i) => window.setTimeout(() => push(`deleting ${f}…`), (i + 1) * 40));
      window.setTimeout(() => push("just kidding. everything's versioned."), (RM_FILES.length + 1) * 40 + 300);
      return;
    }
    void runEgg(cmd, { streak: live.streak, go }).then((egg) => {
      const out = egg ? egg.text : run(cmd);
      if (out) push(out);
    });
  };
  return (
    <div role="dialog" aria-label="Terminal" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background text-sm shadow-[0_-12px_30px_-20px_rgb(0_0_0/0.8)]">
      <div className="mx-auto flex max-h-[40vh] w-full max-w-5xl flex-col px-5 py-4 sm:px-8">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground"><span>conor@site: ~</span><button type="button" onClick={close} className="hover:text-foreground">[ esc ]</button></div>
        <div className="overflow-y-auto" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={l.kind === "in" ? "text-foreground" : "text-muted-foreground"}>{l.kind === "in" ? <><span className="text-accent">$ </span>{l.text}</> : l.text}</div>
          ))}
          <div ref={end} />
        </div>
        <form onSubmit={submit} className="mt-2 flex items-center gap-2">
          <span className="text-accent">$</span>
          <input ref={input} value={value} onChange={(e) => setValue(e.target.value)} aria-label="Command" autoComplete="off" spellCheck={false} className="flex-1 bg-transparent text-foreground caret-accent outline-none" />
        </form>
      </div>
    </div>
  );
}

function Palette({ close }: { close: () => void }) {
  const live = useLive();
  const { go } = useActions();
  const [q, setQ] = useState("");
  const [card, setCard] = useState<EggResult | null>(null);
  const [sel, setSel] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const done = (fn: () => void) => () => { fn(); close(); };
  const items = useMemo(() => [
    { group: "Sections", label: "Home", run: done(() => go("/")) },
    { group: "Sections", label: "How I Work", run: done(() => go("/how-i-work")) },
    { group: "Sections", label: "Journey", run: done(() => go("/journey")) },
    { group: "Sections", label: "Build Log", run: done(() => go("/build-log")) },
    { group: "Sections", label: "Case Library", run: done(() => go("/case-library")) },
    { group: "Right now", label: "Films", hint: `Last watched: ${live.film}`, run: done(() => window.open(LETTERBOXD, "_blank", "noopener")) },
    { group: "Right now", label: "Run", hint: live.run, run: done(() => go("/", "beyond")) },
    { group: "Right now", label: "Streak", hint: `🔥 ${live.streak}`, run: done(() => go("/", "beyond")) },
    { group: "Do", label: "Contact", run: done(() => go("/contact")) },
    { group: "Do", label: "Switch to Engine room", run: done(() => setSiteMode("engine")) },
    { group: "Do", label: "Copy email", hint: EMAIL, run: () => { void navigator.clipboard?.writeText(EMAIL); setNote("Email copied ✓"); } },
    ...["coffee", "dublin", "hola", "seance", "demo", "medal"].map((c) => ({ group: "Try", label: c, run: () => void runEgg(c, { streak: live.streak, go }).then((r) => r && setCard(r)) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [live.film, live.run, live.streak]);
  useEffect(() => setCard(null), [q]);
  const shown = items.filter((i) => `${i.label} ${i.group}`.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => setSel(0), [q]);
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, shown.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") {
      const cmd = q.trim().toLowerCase();
      if (cmd.startsWith("sudo") || !shown.length) void runEgg(cmd, { streak: live.streak, go }).then((r) => setCard(r ?? { text: "nothing matches that." }));
      else shown[sel]?.run();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/10 px-4 pt-[15vh]" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-label="Command palette" className="w-full max-w-lg overflow-hidden rounded-[6px] border border-border bg-card shadow-[0_24px_60px_-30px_rgb(17_17_17/0.45)]">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} placeholder="Jump to, or try ‘coffee’…" aria-label="Search commands" className="w-full border-b border-border bg-transparent px-4 py-3.5 text-base outline-none placeholder:text-muted-foreground" />
        <ul role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {shown.map((item, i) => (
            <li key={item.label} role="option" aria-selected={i === sel}>
              <button type="button" onMouseEnter={() => setSel(i)} onClick={item.run} className={`flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm ${i === sel ? "bg-accent/10 text-foreground" : "text-ink-soft"}`}>
                <span>{item.label}</span>
                <span className="mode-mono truncate text-xs text-muted-foreground">{item.hint ?? item.group}</span>
              </button>
            </li>
          ))}
          {shown.length === 0 ? <li className="px-4 py-3 text-sm text-muted-foreground">Nothing matches that.</li> : null}
        </ul>
        {card ? (
          <div role="status" className="m-3 rounded-[4px] border border-border bg-background px-4 py-3 text-sm">
            <p>{card.text}</p>
            {card.link ? <button type="button" onClick={() => { go(card.link!.to); close(); }} className="quiet-link mt-2 text-xs text-link">{card.link.label} →</button> : null}
          </div>
        ) : null}
        {note ? <p className="border-t border-border px-4 py-2 text-xs text-accent">{note}</p> : null}
      </div>
    </div>
  );
}
