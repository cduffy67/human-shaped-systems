import { useSyncExternalStore } from "react";

/** Hidden Journey chapter 02.5: open state lives in memory so it stays open until reload. */
let revealed = false;
const subs = new Set<() => void>();
export function revealGapYear() { revealed = true; subs.forEach((f) => f()); }
export function useGapYear() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => revealed, () => false);
}
