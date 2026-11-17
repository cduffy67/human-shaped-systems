import { useSyncExternalStore } from "react";
import { findEgg } from "@/lib/hunt";

/**
 * "home" easter egg: once someone runs `home` (or `sandymount`) in ⌘K, the
 * Poolbeg chimneys appear beside the name and on the footer line for the rest
 * of the visit (sessionStorage, so a new tab starts fresh).
 */
const KEY = "cd-home";
let built: boolean | null = null;
let builtAt = 0;
const subs = new Set<() => void>();

function read(): boolean {
  if (built === null) {
    try {
      built = sessionStorage.getItem(KEY) === "1";
    } catch {
      built = false;
    }
  }
  return built;
}

export function buildHome() {
  findEgg("home");
  read();
  if (built) return;
  built = true;
  builtAt = Date.now();
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* private mode: keep it in memory */
  }
  subs.forEach((f) => f());
}

export function useHome() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    read,
    () => false,
  );
}

/**
 * Chimneys animate only when they mount right after `home` was run; on later
 * page navigations (or a reload in the same visit) they're simply there.
 */
export function shouldAnimateHome(): boolean {
  return builtAt > 0 && Date.now() - builtAt < 1500;
}
