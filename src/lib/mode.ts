import { useSyncExternalStore } from "react";

export type SiteMode = "boardroom" | "engine";
const KEY = "cd-mode";
let current: SiteMode = "boardroom";
const listeners = new Set<() => void>();

function apply(mode: SiteMode) {
  current = mode;
  if (typeof document !== "undefined") document.documentElement.dataset["mode"] = mode;
  listeners.forEach((l) => l());
}

/** Call once after hydration: URL (?mode=engine) wins, then localStorage. */
export function initSiteMode() {
  const param = new URLSearchParams(window.location.search).get("mode");
  const fromUrl = param === "engine" || param === "boardroom" ? param : null;
  const stored = localStorage.getItem(KEY);
  const mode: SiteMode = fromUrl ?? (stored === "engine" ? "engine" : "boardroom");
  if (fromUrl) localStorage.setItem(KEY, fromUrl);
  apply(mode);
}

export function setSiteMode(mode: SiteMode) {
  localStorage.setItem(KEY, mode);
  const url = new URL(window.location.href);
  if (mode === "engine") url.searchParams.set("mode", "engine");
  else url.searchParams.delete("mode");
  window.history.replaceState(window.history.state, "", url);
  apply(mode);
}

export function useSiteMode(): SiteMode {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => "boardroom",
  );
}
