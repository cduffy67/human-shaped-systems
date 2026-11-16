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
      className={`mode-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent ${className}`}
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
    <div
      className={`card-lift rounded-2xl border border-border bg-card p-6 shadow-[0_1px_0_color-mix(in_oklab,var(--foreground)_7%,transparent)] ${className}`}
    >
      {children}
    </div>
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
      className={`inline-flex items-center rounded-full border border-border bg-card px-3 py-1 font-display text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:border-accent/50 hover:text-foreground ${className}`}
    >
      {label}
    </span>
  );
}

/** Sleek editorial plate: clean crop, hairline ring, quiet caption. */
export function Plate({
  src,
  alt,
  title,
  caption,
  className = "",
  ratio = "aspect-[4/3]",
  position = "object-center",
}: {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  className?: string;
  ratio?: string;
  position?: string;
}) {
  return (
    <figure className={`group ${className}`}>
      <div
        className={`relative overflow-hidden rounded-xl bg-secondary ring-1 ring-border transition-shadow duration-500 ease-out group-hover:shadow-[0_18px_44px_-26px_color-mix(in_oklab,var(--foreground)_60%,transparent)] ${ratio}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover ${position} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
        />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">
        {title ? (
          <span className="block font-display text-base text-foreground">{title}</span>
        ) : null}
        {caption ? <span className="block">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

