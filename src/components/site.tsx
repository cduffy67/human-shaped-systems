import deloitteLogo from "@/assets/logos/deloitte.svg.asset.json";
import salesforceLogo from "@/assets/logos/salesforce.svg.asset.json";
import slackLogo from "@/assets/logos/slack.svg.asset.json";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Beats, BeatHeading } from "@/components/beats";
import type { OpenerKey } from "@/lib/motion";

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
      className={`mode-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent ${className}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  opener,
  openerText,
  children,
}: {
  openerText?: string | undefined;
  eyebrow: string;
  title: string;
  intro?: string;
  opener?: OpenerKey | undefined;
  /** Further content lines (mark them `.beat`) that belong to the page's opening section. */
  children?: ReactNode;
}) {
  return (
    <Beats id={`page-${title}`} opener={opener} openerText={openerText} heading={title} as="div">
      <header className="max-w-2xl">
        <BeatHeading as="h1" text={title} className="text-4xl leading-[1.08] sm:text-[3.25rem]" />
        <Label className="beat mt-4 block">{eyebrow}</Label>
        {intro ? <p className="beat mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p> : null}
      </header>
      {children}
    </Beats>
  );
}

/** Section heading: label, rule, optional aside. Editorial, not boxed. */
export function SectionHeading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border pb-3">
      <h2 className="text-2xl sm:text-[1.65rem]">{children}</h2>
      {note ? (
        <span className="text-sm italic font-medium text-accent">{note}</span>
      ) : null}
    </div>
  );
}

/** A section entering with the shared beats: optional opener, typed/risen heading, `.beat` content. */
export function BeatSection({ id, opener, openerText, title, note, className = "", children }: { id: string; opener?: OpenerKey | undefined; openerText?: string | undefined; title: string; note?: string; className?: string; children: ReactNode }) {
  return (
    <Beats id={id} opener={opener} openerText={openerText} heading={title} className={className}>
      <div className="mb-8 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border pb-3">
        <BeatHeading text={title} className="text-2xl sm:text-[1.65rem]" />
        {note ? <span className="beat text-sm italic font-medium text-accent">{note}</span> : null}
      </div>
      {children}
    </Beats>
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
      className={`card-lift rounded-[4px] border border-card-border bg-card p-6 ${className}`}
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
const BRAND_LOGOS: { match: (l: string) => boolean; src: string; wordmark: boolean; h: string }[] = [
  { match: (l) => l === "Deloitte", src: deloitteLogo.url, wordmark: true, h: "h-3" },
  { match: (l) => l === "Salesforce", src: salesforceLogo.url, wordmark: true, h: "h-7 -my-1.5" },
  { match: (l) => l.startsWith("Slack"), src: slackLogo.url, wordmark: false, h: "h-3.5" },
  { match: (l) => l === "UCD", src: "/logos/ucd-crest.png", wordmark: false, h: "h-5 -my-1" },
  { match: (l) => l === "Cambridge", src: "/logos/cambridge-crest.png", wordmark: false, h: "h-5 -my-1" },
];

export function BrandPill({ label, className = "" }: { label: string; className?: string }) {
  const logo = BRAND_LOGOS.find((b) => b.match(label));
  return (
    <span
      className={`brand-pill ${label === "KPMG" ? "brand-pill--kpmg " : ""}inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-3 py-1 font-display text-[0.72rem] uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:border-card-border-hover hover:text-foreground ${className}`}
    >
      {logo ? <img src={logo.src} alt={logo.wordmark ? label : ""} className={`${logo.h} w-auto`} /> : null}
      {label === "KPMG" ? (
        <span className="font-sans text-[0.85rem] font-extrabold normal-case tracking-tight" style={{ color: "var(--kpmg-ink, #00338D)" }}>KPMG</span>
      ) : logo?.wordmark ? null : label}
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
    <figure className={`group relative ${className}`}>
      <span aria-hidden="true" className="magnet" />
      <div
        className={`relative overflow-hidden rounded-[4px] bg-secondary ring-1 ring-border transition-shadow duration-500 ease-out group-hover:shadow-[0_18px_44px_-26px_color-mix(in_oklab,var(--foreground)_60%,transparent)] ${ratio}`}
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
        {caption ? <span className="cap-line block">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

/** Pull quote: heavy type, short marker line down the left instead of a rule. */
export function PullQuote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <blockquote className={`pull-quote ${className}`}>
      <span aria-hidden="true" className="pull-mark" />
      <p>{children}</p>
    </blockquote>
  );
}


/** The big "where next" link at the foot of a page: Home → Journey → Work → Contact. */
export function NextStep({ to, kicker, label }: { to: "/" | "/lab" | "/journey" | "/contact"; kicker: string; label: string }) {
  return (
    <div className="beat mt-20 border-t border-border pt-12">
      <p className="no-slash mode-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{kicker}</p>
      <Link to={to} className="case-cta mt-3 inline-block max-w-full font-display text-3xl font-extrabold leading-tight sm:text-4xl">{label}</Link>
    </div>
  );
}
