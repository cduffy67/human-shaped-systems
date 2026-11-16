import { motion, useReducedMotion } from "framer-motion";
import { useSiteMode } from "@/lib/mode";

const NOTES = [
  { x: 39, y: 35, angle: -12 },
  { x: 127, y: 21, angle: 8 },
  { x: 202, y: 47, angle: -8 },
  { x: 61, y: 111, angle: 9 },
  { x: 149, y: 104, angle: -7 },
  { x: 226, y: 119, angle: 12 },
];

/** Phase artwork stays local to How I Work; all strokes draw once per visit. */
export function PhaseIllustration({ phase }: { phase: number }) {
  const reduce = useReducedMotion();
  const mode = useSiteMode();
  const stroke = {
    hidden: { strokeDashoffset: 1 },
    visible: { strokeDashoffset: 0, transition: { duration: reduce ? 0 : 0.9, ease: "easeInOut" as const } },
  };
  const line = (d: string, key?: string) => (
    <motion.path key={key ?? d} d={d} pathLength={1} strokeDasharray="1 1" variants={stroke} />
  );
  const labels = [
    "Six overlapping sticky notes, scribbles and a question mark: a messy problem.",
    "Four boxes connected by arrows, with a dashed dependency held together with hope: a mapped system.",
    "A crisp accent-filled card with a tick: a credible solution.",
  ];

  return (
    <motion.svg
      role="img"
      aria-label={labels[phase]}
      viewBox="0 0 360 220"
      className={`phase-illustration mx-auto h-[200px] w-full max-w-[360px] fill-none ${mode === "engine" ? "text-foreground" : "text-accent"}`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {phase === 0 ? <>
        {NOTES.map(({ x, y, angle }, i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${angle} 43 35)`}>
            {line("M 1 3 Q 40 0 85 2 L 87 70 Q 43 73 0 69 Z")}
            {line("M 14 20 Q 28 16 43 20 T 72 19 M 13 32 Q 31 35 48 31 T 71 33 M 15 46 Q 29 43 49 47")}
          </g>
        ))}
        {line("M 309 30 C 304 15 327 13 329 27 C 331 38 318 37 317 47 M 317 56 L 317 57")}
      </> : null}
      {phase === 1 ? <>
        {line("M 13 35 Q 46 32 80 35 L 81 87 Q 44 90 12 86 Z")}
        {line("M 139 35 Q 174 33 206 36 L 207 89 Q 173 87 138 90 Z")}
        {line("M 267 35 Q 304 32 338 36 L 337 88 Q 303 91 268 87 Z")}
        {line("M 268 154 Q 303 151 337 155 L 338 204 Q 304 207 267 203 Z")}
        {line("M 90 61 Q 110 58 128 61 M 120 54 L 129 61 L 120 68")}
        {line("M 217 61 Q 237 64 258 61 M 249 54 L 258 61 L 249 68")}
        {line("M 303 101 Q 300 119 303 143 M 296 135 L 303 144 L 310 135")}
        <motion.path d="M 16 148 Q 111 145 220 149 L 219 198 Q 117 201 15 198 Z" pathLength={1} strokeDasharray="0.018 0.018" variants={stroke} />
        {line("M 172 101 Q 176 121 163 136 M 157 129 L 163 137 L 171 131")}
        <motion.text x="118" y="179" textAnchor="middle" stroke="none" fill="currentColor" className="font-[cursive] text-[16px] italic" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: reduce ? 0 : 0.9 } } }}>held together with hope</motion.text>
      </> : null}
      {phase === 2 ? <>
        <motion.path d="M 100 30 H 260 V 190 H 100 Z" className="fill-accent stroke-accent" pathLength={1} strokeDasharray="1 1" variants={{ hidden: { strokeDashoffset: 1, fillOpacity: 0 }, visible: { strokeDashoffset: 0, fillOpacity: 1, transition: { duration: reduce ? 0 : 0.9, ease: "easeInOut" } } }} />
        <g className={mode === "engine" ? "text-foreground" : "text-accent-foreground"} strokeWidth="5">
          {line("M 143 111 L 169 137 L 219 84")}
        </g>
      </> : null}
    </motion.svg>
  );
}