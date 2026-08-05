import type { ReactNode } from "react";

export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24 ${className}`}>
      {children}
    </div>
  );
}

/** Small typographic label — the workhorse of the whole site. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent ${className}`}
    >
      {children}
    </span>
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
      <Label>{eyebrow}</Label>
      <h1 className="mt-4 text-4xl leading-[1.08] sm:text-[3.25rem]">{title}</h1>
      {intro ? <p className="mt-6 text-lg leading-relaxed text-ink-soft">{intro}</p> : null}
    </header>
  );
}

/** Section heading: label, rule, optional aside. Editorial, not boxed. */
export function SectionHeading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border pb-3">
      <h2 className="text-2xl sm:text-[1.65rem]">{children}</h2>
      {note ? (
        <span className="text-sm italic text-muted-foreground">{note}</span>
      ) : null}
    </div>
  );
}

/** Restrained container. Used sparingly — most content sits on the page itself. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-border bg-card p-6 ${className}`}>{children}</div>
  );
}

/** Thin warm rule with optional breathing room. */
export function Divider({ className = "" }: { className?: string; mark?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}
    >
      <span className="hairline block h-px w-full" />
    </div>
  );
}

/** Career-stage marker: small caps type, no chrome. */
export function BrandPill({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/70 ${className}`}
    >
      {label}
    </span>
  );
}

/** Photograph as it would sit in a book: clean crop, quiet caption. */
export function Plate({
  src,
  alt,
  caption,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <figure className={`group ${className}`}>
      <div className={`overflow-hidden rounded-sm bg-secondary ${ratio}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{caption}</figcaption>
    </figure>
  );
}
