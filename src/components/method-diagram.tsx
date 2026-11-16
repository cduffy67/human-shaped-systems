import { motion, useReducedMotion } from "framer-motion";

const rough = "M 16 15 Q 112 2 204 18 Q 219 55 205 91 Q 110 106 15 91 Q 2 55 16 15 Z";
const crisp = "M 16 15 Q 110 15 204 15 Q 204 53 204 91 Q 110 91 16 91 Q 16 53 16 15 Z";

export function MethodDiagram() {
  const reduce = useReducedMotion();
  return (
    <div className="method-diagram my-14 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]" role="img" aria-label="Messy problem, then mapped system, then credible solution. Three hand-drawn nodes resolve into clean outlines.">
      {["Messy problem", "Mapped system", "Credible solution"].map((label, i) => (
        <div key={label} className="contents">
          {i > 0 ? <motion.span aria-hidden="true" className="text-center text-2xl text-accent" initial={{ opacity: reduce ? 1 : 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: reduce ? 0 : i * 0.35 }}> <span className="hidden sm:inline">→</span><span className="sm:hidden">↓</span> </motion.span> : null}
          <div className="relative aspect-[220/106] w-full max-w-xs justify-self-center">
            <svg aria-hidden="true" viewBox="0 0 220 106" className="h-full w-full fill-none text-accent">
              <motion.path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" initial={{ d: reduce ? crisp : rough, pathLength: reduce ? 1 : 0 }} whileInView={{ d: crisp, pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ d: { delay: i * 0.35 + 0.8, duration: reduce ? 0 : 0.8 }, pathLength: { delay: i * 0.35, duration: reduce ? 0 : 0.9 } }} />
            </svg>
            <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-2"><span className="mode-mono text-xs text-accent">0{i + 1}</span><span className="text-center font-display text-base font-extrabold">{label}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}