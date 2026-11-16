import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Divider, Page, PageHeader } from "@/components/site";
import { useSiteMode } from "@/lib/mode";

type Entry = {
  version: string;
  title: string;
  status: "shipped" | "ongoing";
  summary: string;
  ai_did: string;
  i_decided: string;
};

export const ENTRIES: Entry[] = [
  { version: "v0", title: "Blank page, vague idea", status: "shipped" as const, summary: "Scaffolded in Lovable in an evening. No copy, no plan, just a URL and some nerve.", ai_did: "Scaffolded the whole site from one prompt.", i_decided: "To ship it anyway." },
  { version: "v1", title: "Worked out what it's for", status: "shipped" as const, summary: "Decided this is a digital garden, not a CV. Cut the pages that were only there out of habit.", ai_did: "Generated the standard portfolio pages.", i_decided: "Most of them didn't need to exist." },
  { version: "v2", title: "Found the voice", status: "shipped" as const, summary: "Rewrote everything so it sounds like me on a good day, rather than a landing page on any day.", ai_did: "Drafted copy in a polite, generic voice.", i_decided: "To rewrite it until it sounded like me." },
  { version: "v3", title: "Added the real story", status: "shipped" as const, summary: "The journey, a few honest photos, and the parts of the work that can be told publicly.", ai_did: "Laid out the timeline and photo sections.", i_decided: "What's public and what stays private." },
  { version: "v4", title: "Second pass with AI in the loop", status: "shipped" as const, summary: "Claude Code on the structure, me on the judgement calls. Faster, and noticeably less sloppy.", ai_did: "Restructured the pages and components.", i_decided: "What to cut. Most of it." },
  { version: "v5", title: "Warmer, more crafted", status: "shipped" as const, summary: "New palette, images pulled up the page, and a proper visual rhythm instead of stacked sections.", ai_did: "Tried palettes and layouts on request.", i_decided: "Warmer, and people before paragraphs." },
  { version: "v6", title: "De-templated", status: "shipped" as const, summary: "Took the cards, pills and squiggles out. Parchment, espresso ink, hairlines and whitespace instead. Closer to a book than a landing page.", ai_did: "Re-styled everything to the new palette.", i_decided: "Book, not landing page." },
  { version: "v7", title: "Two rooms", status: "shipped" as const, summary: "One site, two audiences. Flip between Boardroom and Engine room at the top.", ai_did: "Built the theme switch and swapped the copy.", i_decided: "Which story each room actually needs to hear." },
  { version: "v8", title: "Plugged into real life", status: "shipped" as const, summary: "Live tiles for what I'm watching, learning, and soon running and listening. Data refreshes on a schedule, and the site keeps its own history.", ai_did: "Wired up Letterboxd and Duolingo, caching and fallbacks.", i_decided: "What's worth showing, and that a broken streak should be a joke, not an error." },
  { version: "v9", title: "Out in the world, still unfinished", status: "ongoing" as const, summary: "Versioned, published, and tweaked whenever something bugs me. That's the whole point.", ai_did: "Whatever I ask it next.", i_decided: "It's never finished." }
];

const NEWEST_FIRST = [...ENTRIES].reverse();
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const Route = createFileRoute("/build-log")({
  head: () => ({
    meta: [
      { title: "Build Log — Conor Duffy" },
      {
        name: "description",
        content:
          "A running log of how this site gets built, version by version: fast to ship, AI-assisted, versioned, and tweaked slowly in public.",
      },
      { property: "og:title", content: "Build Log — Conor Duffy" },
      {
        property: "og:description",
        content:
          "How this site gets built, version by version — a small learning project in public.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/build-log" }],
  }),
  component: BuildLog,
});

export function BuildLog() {
  const engine = useSiteMode() === "engine";
  return (
    <Page>
      <PageHeader
        opener="buildlog"
        eyebrow="Working in public"
        title="Build Log"
        intro="Built quickly, refined with AI, versioned over time, tweaked slowly. This page is the receipts."
      />

      <p className="mt-8 text-sm italic text-muted-foreground">
        Built quickly · refined with AI · versioned · learning in public · tweaked slowly
      </p>

      {engine ? <EngineLog /> : <BoardroomLog />}

      <div className="py-16">
        <Divider />
      </div>

      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        The goal was never the most complex site possible. It was to build something real, ship it
        before it was ready, and keep improving it where people can see.
      </p>
    </Page>
  );
}

function BoardroomLog() {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();
  return (
    <ol className="mt-14 border-t border-border">
      {NEWEST_FIRST.map((e) => {
        const isOpen = open === e.version;
        return (
          <li key={e.version} className="border-b border-border">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`how-${e.version}`}
              onClick={() => setOpen(isOpen ? null : e.version)}
              className="row-warm grid w-full gap-x-8 gap-y-2 px-1 py-6 text-left sm:grid-cols-[6rem_1fr_auto] sm:px-3"
            >
              <span className="flex items-baseline gap-3 sm:flex-col sm:gap-1">
                <span className="mode-mono text-lg text-accent">{e.version}</span>
                <span className={`text-[0.62rem] uppercase tracking-[0.2em] ${e.status === "ongoing" ? "text-tobacco" : "text-muted-foreground"}`}>
                  {e.status}
                </span>
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-snug">{e.title}</span>
                <span className="mt-1.5 block max-w-2xl leading-relaxed text-ink-soft">{e.summary}</span>
              </span>
              <span
                aria-hidden
                className="hidden self-start pt-1 text-xl leading-none text-muted-foreground transition-transform duration-200 sm:block"
                style={{ transform: isOpen ? "rotate(45deg)" : undefined }}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`how-${e.version}`}
                  key="how"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-1 pb-6 sm:ml-[8rem] sm:px-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">How it was made</p>
                    <p className="mt-2 text-ink-soft">🤖 AI did: {e.ai_did}</p>
                    <p className="mt-1 text-ink-soft">🧠 I decided: {e.i_decided}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

// Versions already typed out this visit — replay instantly afterwards.
const played = new Set<string>();

function terminalLines(e: Entry): [string, string][] {
  return [
    ["$", ` ./explain ${e.version}`],
    ["> title:     ", ` ${e.title.toLowerCase()}`],
    ["> summary:   ", ` ${e.summary.toLowerCase()}`],
    ["> ai_did:    ", ` ${e.ai_did.toLowerCase()}`],
    ["> i_decided: ", ` ${e.i_decided.toLowerCase()}`],
    ["> status:    ", e.status === "shipped" ? " ✓ shipped" : " … ongoing"],
  ];
}

function EngineLog() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ol className="mode-mono mt-14 border-t border-border text-sm">
      {NEWEST_FIRST.map((e) => {
        const isOpen = open === e.version;
        return (
          <li key={e.version} className="border-b border-border">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : e.version)}
              className="row-warm flex w-full flex-wrap gap-x-4 px-2 py-3 text-left"
            >
              <span className="text-accent">{e.version}</span>
              <span className="min-w-0 flex-1 break-all">{kebab(e.title)}</span>
              <span className={e.status === "ongoing" ? "text-tobacco" : "text-muted-foreground"}>[{e.status}]</span>
            </button>
            {isOpen && <Terminal entry={e} />}
          </li>
        );
      })}
    </ol>
  );
}

function Terminal({ entry }: { entry: Entry }) {
  const reduce = useReducedMotion();
  const lines = terminalLines(entry);
  const full = lines.map(([k, v]) => k + v);
  const total = full.reduce((n, l) => n + l.length, 0);
  const [instant] = useState(() => reduce || played.has(entry.version));
  const [chars, setChars] = useState(instant ? total : 0);
  const done = chars >= total;

  useEffect(() => {
    played.add(entry.version);
    if (instant) return;
    let n = 0;
    let line = 0;
    let inLine = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (n >= total) return;
      n++;
      inLine++;
      setChars(n);
      let delay = 20;
      if (inLine >= (full[line]?.length ?? 0)) {
        line++;
        inLine = 0;
        delay = 150;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let left = chars;
  return (
    <div
      className="mx-2 mb-4 cursor-text rounded-md border border-border bg-background/60 p-4 leading-relaxed"
      onClick={() => setChars(total)}
    >
      <div className="sr-only">{full.join("\n")}</div>
      <div aria-hidden aria-live="off">
        {lines.map(([k, v], i) => {
          if (left <= 0) return null;
          const shown = (k + v).slice(0, left);
          left -= k.length + v.length;
          return (
            <div key={i} className="whitespace-pre-wrap">
              <span className="text-accent">{shown.slice(0, k.length)}</span>
              <span className="text-foreground">{shown.slice(k.length)}</span>
            </div>
          );
        })}
        {done && (
          <div>
            <span className="text-accent">$</span> <span className="block-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
