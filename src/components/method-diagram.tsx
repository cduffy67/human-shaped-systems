import { motion, useReducedMotion } from "framer-motion";
import { useBeatsReady } from "@/components/beats";

// Node 1: wobbly, corners overshoot. Node 2: hand-drawn but nearly straight. Node 3: crisp.
const NODES = [
  { label: "Messy problem", d: "M 4 17 Q 110 6 212 19 M 206 9 Q 214 55 203 98 M 214 92 Q 112 104 8 90 M 16 99 Q 6 55 15 8", rotate: -2 },
  { label: "Mapped system", d: "M 14 15 Q 110 12 206 16 Q 208 53 205 91 Q 110 94 15 90 Q 12 53 14 15 Z", rotate: 0 },
  { label: "Credible solution", d: "M 14 14 H 206 V 92 H 14 Z", rotate: 0 },
];
const ARROW = "M 4 20 Q 22 15 40 21 M 31 13 L 41 21 L 32 28";
const ARROW_V = "M 20 2 Q 15 18 21 34 M 13 26 L 21 35 L 28 27";

export function MethodDiagram() {
  const reduce = useReducedMotion();
  const ready = useBeatsReady();
  const t = (i: number) => ({ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.45, ease: "easeInOut" as const });
  return (
    <motion.div
      className="method-diagram my-14 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"
      role="img"
      aria-label="Messy problem, then mapped system, then credible solution: a wobbly sketch, a neater sketch, then a crisp filled box."
      initial={reduce ? "on" : "off"}
      animate={ready ? "on" : "off"}
    >
      {NODES.map((n, i) => {
        const final = i === 2;
        return (
          <div key={n.label} className="contents">
            {i > 0 ? (
              <svg aria-hidden="true" viewBox="0 0 44 40" className="mx-auto h-10 w-11 fill-none text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
                <motion.path className="hidden sm:block" d={ARROW} variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: t(i * 2 - 1) } }} />
                <motion.path className="sm:hidden" d={ARROW_V} variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: t(i * 2 - 1) } }} />
              </svg>
            ) : null}
            <div className="relative aspect-[220/106] w-full max-w-xs justify-self-center" style={{ transform: `rotate(${n.rotate}deg)` }}>
              <svg aria-hidden="true" viewBox="0 0 220 106" className="h-full w-full fill-none text-accent">
                <motion.path
                  d={n.d}
                  stroke="currentColor"
                  strokeWidth={final ? 2 : 1.8}
                  strokeLinecap="round"
                  className={final ? "fill-accent" : undefined}
                  variants={{
                    off: { pathLength: 0, fillOpacity: 0 },
                    on: { pathLength: 1, fillOpacity: final ? 1 : 0, transition: { ...t(i * 2), fillOpacity: { delay: reduce ? 0 : i * 0.9 + 0.5, duration: reduce ? 0 : 0.4 } } },
                  }}
                />
              </svg>
              <motion.div
                aria-hidden="true"
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${final ? "text-accent-foreground" : ""}`}
                variants={{ off: { opacity: 0 }, on: { opacity: 1, transition: { delay: reduce ? 0 : i * 0.9 + 0.4, duration: reduce ? 0 : 0.4 } } }}
              >
                <span className={`mode-mono text-xs ${final ? "" : "text-accent"}`}>0{i + 1}</span>
                <span className="text-center font-display text-base font-extrabold">{n.label}</span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
