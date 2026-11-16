import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

/** CTA whose hand-drawn underline draws in once when it scrolls into view. */
export function CaseCTA({ children }: { children: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="border-t border-border pt-12">
      <Link to="/case-library" className="case-cta relative inline-block max-w-full pb-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        {children} <span className="whitespace-nowrap">→ Case Library</span>
        <svg aria-hidden="true" viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-3 w-full fill-none text-accent">
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
