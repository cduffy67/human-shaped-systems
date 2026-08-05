import type { ReactNode } from "react";

export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 py-14 sm:px-8 sm:py-20 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="rise max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h1>
      {intro ? <p className="mt-5 text-lg text-ink-soft">{intro}</p> : null}
    </header>
  );
}

export function SectionHeading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h2 className="text-2xl sm:text-[1.7rem]">{children}</h2>
      <Squiggle />
      {note ? <span className="text-sm text-muted-foreground">{note}</span> : null}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card-lift rounded-2xl border border-border bg-card p-5 shadow-[0_1px_0_0_var(--color-border)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Small hand-drawn-feel underline squiggle. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 8"
      className={`h-2 w-16 flex-none text-accent/70 ${className}`}
      fill="none"
    >
      <path
        d="M1 5c8-4 14 2 22-1s14-4 22-1 14 5 22 2 14-4 22-1 14 4 30 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Warm abstract blob used where an image would be too much. */
export function Blob({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="none">
      <path
        fill="currentColor"
        d="M45 -60C58 -49 66 -32 70 -14c4 18 4 37 -6 51S32 60 13 66C-6 72 -28 68 -46 56c-18 -12 -32 -32 -35 -53 -3 -21 5 -43 20 -58 15 -15 37 -23 58 -21 21 2 35 15 48 16Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/** Thin editorial divider with a small centred mark. */
export function Divider({ mark = "✳" }: { mark?: string }) {
  return (
    <div aria-hidden="true" className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 sm:px-8">
      <span className="hairline h-px flex-1" />
      <span className="font-display text-sm text-accent/70">{mark}</span>
      <span className="hairline h-px flex-1" />
    </div>
  );
}

/** Monochrome text badge used as a logo-style marker. */
export function BrandPill({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-foreground/25 px-2 py-0.5 font-display text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground/70 ${className}`}
    >
      {label}
    </span>
  );
}

/** Pinned photo with a handwritten-feel caption. */
export function Polaroid({
  src,
  alt,
  caption,
  tilt = 0,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  tilt?: number;
  className?: string;
}) {
  return (
    <figure
      className={`card-lift tape rounded-xl border border-border bg-paper p-2.5 pb-3 shadow-[0_12px_30px_-22px_var(--foreground)] ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-40 w-full rounded-lg object-cover sm:h-44"
      />
      <figcaption className="mt-2.5 px-1 text-sm text-ink-soft">{caption}</figcaption>
    </figure>
  );
}
