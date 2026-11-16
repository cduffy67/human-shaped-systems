import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteMode } from "@/lib/mode";

const KEY = "cd-toggle-nudge";

/** Boardroom-only, once-per-visitor hint pointing at the mode toggle. */
export function ToggleNudge() {
  const mode = useSiteMode();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (mode !== "boardroom") return;
    try { if (localStorage.getItem(KEY)) return; } catch { return; }
    const t = window.setTimeout(() => {
      localStorage.setItem(KEY, "1");
      setShow(true);
    }, 5000);
    return () => window.clearTimeout(t);
  }, [mode]);
  useEffect(() => {
    if (!show) return;
    const hide = () => setShow(false);
    const t = window.setTimeout(hide, 6000);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("pointerdown", hide);
    return () => { window.clearTimeout(t); window.removeEventListener("scroll", hide); window.removeEventListener("pointerdown", hide); };
  }, [show]);
  if (!show || mode !== "boardroom") return null;
  const draw = reduce ? { pathLength: 1 } : { pathLength: 0 };
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 top-full z-40 flex items-start gap-1 text-accent">
      <span className="font-hand mt-9 text-xl">try this</span>
      <svg width="60" height="56" viewBox="0 0 60 56" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M8 50 C 22 44, 38 34, 44 6" initial={draw} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }} />
        <motion.path d="M35 13 L 44 5 L 50 16" initial={draw} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 0.15, delay: reduce ? 0 : 0.45 }} />
      </svg>
    </div>
  );
}
