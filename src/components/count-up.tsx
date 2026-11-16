import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** One-shot count from 0 to value (900ms ease-out) when first in view. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);
  const decimals = Number.isInteger(value) ? 0 : 1;
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setN(value);
    const c = animate(0, value, { duration: 0.9, ease: "easeOut", onUpdate: setN });
    return () => c.stop();
  }, [inView, reduce, value]);
  return <span ref={ref}>{n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}
