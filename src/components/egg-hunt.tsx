import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSiteMode } from "@/lib/mode";
import { EGGS, TARGET, closeHunt, formatTime, openHunt, saveEntry, startHuntClock, useHunt } from "@/lib/hunt";
import { getLeaderboard, submitScore, syncEggs } from "@/lib/hunt.functions";

/** +1 pops, the egg counter pill, and the submit / leaderboard panel. Mounted once in EasterEggs. */
export function EggHunt() {
  const h = useHunt();
  useEffect(() => { startHuntClock(); }, []);

  // Keep the leaderboard row's egg count in step once someone's on it.
  useEffect(() => {
    const sync = (e: Event) => {
      const entry = h.entry;
      if (entry) void syncEggs({ data: { id: entry.id, token: entry.token, eggs: (e as CustomEvent<number>).detail } });
    };
    window.addEventListener("cd-hunt-sync", sync);
    return () => window.removeEventListener("cd-hunt-sync", sync);
  }, [h.entry]);

  return (
    <>
      {h.pop ? <PlusOne key={h.pop.key} x={h.pop.x} y={h.pop.y} n={h.pop.n} /> : null}
      {h.count > 0 && h.panel === "closed" ? <Pill count={h.count} /> : null}
      {h.panel !== "closed" ? <Panel which={h.panel} /> : null}
    </>
  );
}

function PlusOne({ x, y, n }: { x: number; y: number; n: number }) {
  const engine = useSiteMode() === "engine";
  const [gone, setGone] = useState(false);
  if (gone) return null;
  const left = Math.min(Math.max(x, 80), (typeof window !== "undefined" ? window.innerWidth : 800) - 80);
  return (
    <div aria-live="polite" className="pointer-events-none fixed z-[70] -translate-x-1/2 text-center" style={{ left, top: y - 24 }}>
      <div className="egg-pop" onAnimationEnd={() => setGone(true)}>
      <div className="font-display text-3xl font-semibold leading-none text-accent">+1</div>
      <div className="mode-mono mt-1 whitespace-nowrap text-[0.7rem] text-muted-foreground">
        {engine ? `egg #${n}` : `Easter egg #${n}`}
      </div>
    </div>
    </div>
  );
}

function Pill({ count }: { count: number }) {
  const engine = useSiteMode() === "engine";
  return (
    <button type="button" onClick={() => openHunt()} aria-label={`Easter egg hunt: ${count} found. Open the leaderboard`}
      className="mode-mono fixed bottom-4 left-4 z-40 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {engine ? `[eggs: ${count}]` : `🥚 ${count}`}
    </button>
  );
}

function Panel({ which }: { which: "submit" | "board" }) {
  const engine = useSiteMode() === "engine";
  const h = useHunt();
  const qc = useQueryClient();
  const board = useQuery({ queryKey: ["egg-board"], queryFn: () => getLeaderboard(), staleTime: 30_000 });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [hint, setHint] = useState(() => Math.floor(Math.random() * 100));
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") closeHunt(which === "submit"); };
    window.addEventListener("keydown", esc);
    if (which === "submit") input.current?.focus();
    return () => window.removeEventListener("keydown", esc);
  }, [which]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || h.at3 == null) return;
    setBusy(true); setError(null);
    try {
      const r = await submitScore({ data: { name, ms: Math.round(h.at3), eggs: h.count } });
      if (!r.ok) { setError(r.error); return; }
      saveEntry({ id: r.id, token: r.token, name: r.name });
      setRank(r.rank);
      await qc.invalidateQueries({ queryKey: ["egg-board"] });
      openHunt("board");
    } catch {
      setError("Couldn't reach the leaderboard. Try again in a bit.");
    } finally { setBusy(false); }
  };

  const unfound = EGGS.filter((egg) => !h.found[egg.id]);
  const rows = board.data?.rows ?? [];
  const mine = h.entry?.id;

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center bg-foreground/10 px-4 pt-[12vh]" onMouseDown={(e) => e.target === e.currentTarget && closeHunt(which === "submit")}>
      <div role="dialog" aria-modal="true" aria-label={which === "submit" ? "Join the leaderboard" : "Easter egg leaderboard"}
        className="max-h-[76vh] w-full max-w-md overflow-y-auto rounded-[6px] border border-border bg-card p-5 text-sm shadow-[0_24px_60px_-30px_rgb(17_17_17/0.45)]">
        {which === "submit" ? (
          <form onSubmit={submit}>
            <p className="no-slash mode-mono text-xs uppercase tracking-[0.2em] text-accent">{engine ? "$ achievement_unlocked" : "Three down"}</p>
            <h2 className="mt-2 font-display text-xl text-foreground">
              {engine ? `3 eggs in ${formatTime(h.at3 ?? 0)}` : `You found 3 easter eggs in ${formatTime(h.at3 ?? 0)}.`}
            </h2>
            <p className="no-slash mt-1 text-muted-foreground">{engine ? "write your name to the leaderboard?" : "Want your name on the leaderboard?"}</p>
            <input ref={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder={engine ? "handle" : "Your name or a nickname"} aria-label="Name for the leaderboard"
              className="mt-4 w-full rounded-[4px] border border-border bg-background px-3 py-2 text-base text-foreground caret-accent outline-none focus:border-accent" />
            {error ? <p className="no-slash mt-2 text-xs text-destructive">{error}</p> : null}
            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={busy || !name.trim()} className="rounded-[4px] bg-accent px-4 py-2 font-medium text-accent-foreground disabled:opacity-50">
                {busy ? (engine ? "writing…" : "Adding…") : engine ? "git push" : "Add me"}
              </button>
              <button type="button" onClick={() => closeHunt(true)} className="text-muted-foreground hover:text-foreground">{engine ? "skip" : "Not now"}</button>
            </div>
            <p className="no-slash mt-4 text-xs text-muted-foreground">Only your name and time are saved. Plenty more hiding.</p>
          </form>
        ) : (
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="no-slash mode-mono text-xs uppercase tracking-[0.2em] text-accent">{engine ? "$ cat leaderboard.txt" : "Easter egg hunt"}</p>
              <button type="button" onClick={() => closeHunt()} className="mode-mono text-xs text-muted-foreground hover:text-foreground">{engine ? "[ esc ]" : "Close"}</button>
            </div>
            {rank ? <p className="no-slash mt-3 font-display text-lg text-foreground">{engine ? `rank #${rank}. nice.` : `You're #${rank}. Nice work.`}</p> : null}
            <p className="no-slash mt-2 text-xs text-muted-foreground">Fastest to find {TARGET}, counting only time spent on the site.</p>
            <ol className="mode-mono mt-3 divide-y divide-border border-y border-border">
              {board.isLoading ? <li className="py-2 text-muted-foreground">loading…</li> : null}
              {!board.isLoading && rows.length === 0 ? <li className="py-2 text-muted-foreground">{board.data?.ok === false ? "leaderboard's napping. try later." : "No one yet. Be first."}</li> : null}
              {rows.map((r, i) => (
                <li key={r.id} className={`flex items-baseline gap-3 py-1.5 ${r.id === mine ? "text-accent" : "text-foreground"}`}>
                  <span className="w-6 text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{r.name}{r.id === mine ? (engine ? "  <- you" : " (you)") : ""}</span>
                  <span className="text-xs text-muted-foreground">{r.eggs} eggs</span>
                  <span className="w-16 text-right">{formatTime(r.ms)}</span>
                </li>
              ))}
            </ol>
            {h.count < TARGET ? <p className="no-slash mt-3 text-xs text-muted-foreground">Find {TARGET - h.count} more to get on the board.</p> : null}
            {h.count >= TARGET && !h.entry ? <button type="button" onClick={() => openHunt("submit")} className="quiet-link mt-3 text-xs text-link">Add my name →</button> : null}

            <p className="no-slash mode-mono mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">{engine ? `found: ${h.count}` : `Your finds · ${h.count}`}</p>
            <ul className="mt-2 space-y-1.5">
              {EGGS.filter((egg) => h.found[egg.id]).map((egg) => (
                <li key={egg.id} className="flex gap-2"><span aria-hidden className="text-accent">✓</span><span className="text-foreground">{egg.name}</span></li>
              ))}
            </ul>
            {unfound.length ? (
              <div className="mt-4 rounded-[4px] border border-dashed border-border px-3 py-2">
                <p className="no-slash text-xs text-muted-foreground">{engine ? "// hint: " : "Stuck? "}<span className="text-foreground">{unfound[hint % unfound.length]!.hint}</span></p>
                {unfound.length > 1 ? <button type="button" onClick={() => setHint((x) => x + 1)} className="mode-mono mt-1 text-[0.7rem] text-muted-foreground hover:text-accent">{engine ? "[ another ]" : "Another hint ↻"}</button> : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
