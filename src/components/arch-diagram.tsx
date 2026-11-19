import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Arch, ArchNode } from "@/lib/built";

const TAG: Record<ArchNode["kind"], string | null> = { in: null, out: null, ai: "AI", code: "Code", guard: "Guardrail" };

/** Quiet "how it's wired" fold-out for a Lab project: closed by default, unfurls node by node. */
export function ArchDiagram({ arch, engine }: { arch: Arch; engine: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const step = reduce ? 0 : 0.07;

  return (
    <div className="mt-5">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={id}
        className="mode-mono group inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <motion.span aria-hidden animate={{ rotate: open ? 90 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="inline-block">›</motion.span>
        {engine ? (open ? "close architecture.md" : "cat architecture.md") : open ? "Hide the wiring" : "How it's wired"}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div id={id} key="arch"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden">
            <div className="grid max-w-2xl gap-5 pt-5 md:grid-cols-[1fr_13rem]">
              {/* The flow: a vertical spine, each step drawn in turn */}
              <ol className="relative">
                {arch.flow.map((n, i) => (
                  <motion.li key={n.label}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * step, duration: reduce ? 0 : 0.25 }}
                    className="relative pl-6 pb-3 last:pb-0">
                    {i < arch.flow.length - 1 ? (
                      <motion.span aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                        transition={{ delay: 0.2 + i * step, duration: reduce ? 0 : 0.25 }}
                        className="absolute left-[5px] top-3 h-full w-px origin-top bg-border" />
                    ) : null}
                    <span aria-hidden className={`absolute left-0 top-[0.4rem] h-[11px] w-[11px] ${dot(n.kind)}`} />
                    <Node n={n} />
                  </motion.li>
                ))}
              </ol>

              {/* Evals: what checks the whole thing */}
              <motion.aside initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + arch.flow.length * step, duration: reduce ? 0 : 0.3 }}
                className="self-start rounded-[4px] border border-dashed border-border p-3">
                <p className="no-slash mode-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">{engine ? "// evals" : "Evals"}</p>
                <ul className="mt-2 space-y-1.5">
                  {arch.evals.map((e) => <li key={e} className="no-slash text-xs leading-snug text-ink-soft">{e}</li>)}
                </ul>
              </motion.aside>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function dot(kind: ArchNode["kind"]) {
  if (kind === "ai") return "rounded-full bg-accent";
  if (kind === "code") return "rounded-[2px] bg-foreground";
  if (kind === "guard") return "rotate-45 rounded-[1px] border-2 border-accent bg-background";
  return "rounded-full border border-muted-foreground bg-background";
}

function Node({ n }: { n: ArchNode }) {
  const tag = TAG[n.kind];
  const io = n.kind === "in" || n.kind === "out";
  return (
    <div className={io ? "" : `rounded-[4px] border px-3 py-2 ${n.kind === "ai" ? "border-accent/50" : n.kind === "guard" ? "border-dashed border-accent/60" : "border-border"} bg-card`}>
      <p className={`no-slash text-sm leading-snug ${io ? "italic text-muted-foreground" : "text-foreground"}`}>
        {tag ? <span className="mode-mono mr-2 text-[0.62rem] uppercase tracking-[0.16em] text-accent">{tag}</span> : null}
        {n.label}
      </p>
      {n.note ? <p className="no-slash mt-0.5 text-xs leading-snug text-muted-foreground">{n.note}</p> : null}
    </div>
  );
}
