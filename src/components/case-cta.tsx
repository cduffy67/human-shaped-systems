import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

/** CTA whose hand-drawn underline draws in once on view, sized to the measured text width. */
export function CaseCTA({ children }: { children: string }) {
  const reduce = useReducedMotion();
  const text = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = text.current;
    if (!el) return;
    const measure = () => {
      // Full rendered width of the text (all lines).
      setW(el.getBoundingClientRect().width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement ?? el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [children]);
  return (
    <div className="border-t border-border pt-12">
      <Link to="/case-library" className="case-cta relative inline-block max-w-full pb-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        <span ref={text}>{children} <span className="whitespace-nowrap">→ Case Library</span></span>
        <svg aria-hidden="true" viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-3 fill-none text-accent" style={{ width: w ? `${w}px` : "100%" }}>
          <motion.path
            d="M 2 7 Q 60 3 120 6 T 230 5 Q 270 4 298 8"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: "easeOut" }}
          />
        </svg>
      </Link>
    </div>
  );
}
