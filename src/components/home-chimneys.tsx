import { useEffect, useMemo, useState } from "react";

import { shouldAnimateHome, useHome } from "@/lib/home";
import { useSiteMode } from "@/lib/mode";

/**
 * The Poolbeg chimneys, seen from Sandymount Strand. Built by the ⌘K `home`
 * command: flat red-and-white chimneys rising in Boardroom, pixel art built
 * row by row in Engine room. Rendered beside the name (sm) and on the footer
 * line (lg); hidden until `home` has been run in this visit.
 */

const RED = "#D9363E";
const PX_RED = "#E5484D";
const PX_WHITE = "#EFE6D8";

// 9×12 pixel map, two chimneys (the right one taller). R = red band, W = white band.
const PIXELS = [
  "......WW.",
  "......RR.",
  "..WW..RR.",
  "..RR..WW.",
  "..RR..WW.",
  "..WW..RR.",
  "..WW..RR.",
  "..RR..WW.",
  "..RR..WW.",
  "..WW..RR.",
  "..WW..RR.",
  "..RR..WW.",
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PixelChimneys({ width, height, animate }: { width: number; height: number; animate: boolean }) {
  // Rows are revealed bottom-up: `shown` counts how many rows from the bottom are visible.
  const [shown, setShown] = useState(animate ? 0 : PIXELS.length);
  useEffect(() => {
    if (!animate) return;
    const timers = PIXELS.map((_, i) => window.setTimeout(() => setShown(i + 1), (i + 1) * 70));
    return () => timers.forEach(clearTimeout);
  }, [animate]);
  return (
    <svg aria-hidden viewBox="0 0 9 12" width={width} height={height} style={{ shapeRendering: "crispEdges" }}>
      {PIXELS.flatMap((row, y) =>
        y < PIXELS.length - shown
          ? []
          : [...row].flatMap((c, x) =>
              c === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c === "R" ? PX_RED : PX_WHITE} />],
            ),
      )}
    </svg>
  );
}

/** One flat chimney: white column, thin ink outline, red bands. */
function Stack({ x, y, w, h, bands, band, stroke, delay, animate }: { x: number; y: number; w: number; h: number; bands: number[]; band: number; stroke: number; delay: number; animate: boolean }) {
  const [up, setUp] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    const t = window.setTimeout(() => setUp(true), 30 + delay);
    return () => clearTimeout(t);
  }, [animate, delay]);
  return (
    <g
      style={{
        transformBox: "fill-box",
        transformOrigin: "bottom",
        transform: up ? "scaleY(1)" : "scaleY(0)",
        transition: animate ? "transform 700ms cubic-bezier(.2,.8,.2,1)" : undefined,
      }}
    >
      <rect x={x} y={y} width={w} height={h} fill="var(--background)" stroke="var(--foreground)" strokeWidth={stroke} />
      {bands.map((by) => (
        <rect key={by} x={x} y={by} width={w} height={band} fill={RED} />
      ))}
    </g>
  );
}

function FlatChimneys({ size, animate }: { size: "sm" | "lg"; animate: boolean }) {
  if (size === "sm") {
    return (
      <svg aria-hidden viewBox="0 0 14 12" width={15} height={13} style={{ overflow: "visible" }}>
        <Stack x={1.5} y={3} w={4} h={9} bands={[4.5, 8.2]} band={1.8} stroke={0.7} delay={0} animate={animate} />
        <Stack x={8} y={0} w={4} h={12} bands={[1.5, 5.2, 8.9]} band={1.8} stroke={0.7} delay={150} animate={animate} />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 28 44" width={28} height={44}>
      <Stack x={3} y={12} w={8} h={32} bands={[15, 25, 35]} band={5} stroke={0.8} delay={0} animate={animate} />
      <Stack x={16} y={2} w={8} h={42} bands={[5, 15, 25, 35]} band={5} stroke={0.8} delay={150} animate={animate} />
    </svg>
  );
}

export function HomeChimneys({ size }: { size: "sm" | "lg" }) {
  const home = useHome();
  const engine = useSiteMode() === "engine";
  // Animate only when the chimneys appear because `home` was just run.
  const animate = useMemo(() => home && shouldAnimateHome() && !prefersReducedMotion(), [home]);
  if (!home) return null;
  const label = "The Poolbeg chimneys, from Sandymount: home";
  return (
    <span role="img" aria-label={label} title="home" className="inline-flex shrink-0">
      {engine ? (
        size === "sm" ? (
          <PixelChimneys width={10} height={13} animate={animate} />
        ) : (
          <PixelChimneys width={30} height={40} animate={animate} />
        )
      ) : (
        <FlatChimneys size={size} animate={animate} />
      )}
    </span>
  );
}
