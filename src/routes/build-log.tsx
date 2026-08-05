import { createFileRoute } from "@tanstack/react-router";

import { Divider, Page, PageHeader } from "@/components/site";

const ENTRIES = [
  {
    version: "v0",
    status: "shipped",
    title: "Blank page, vague idea",
    body: "Scaffolded in Lovable in an evening. No copy, no plan, just a URL and some nerve.",
  },
  {
    version: "v1",
    status: "shipped",
    title: "Worked out what it's for",
    body: "Decided this is a digital garden, not a CV. Cut the pages that were only there out of habit.",
  },
  {
    version: "v2",
    status: "shipped",
    title: "Found the voice",
    body: "Rewrote everything so it sounds like me on a good day, rather than a landing page on any day.",
  },
  {
    version: "v3",
    status: "shipped",
    title: "Added the real story",
    body: "The journey, a few honest photos, and the parts of the work that can be told publicly.",
  },
  {
    version: "v4",
    status: "shipped",
    title: "Second pass with AI in the loop",
    body: "Claude Code on the structure, me on the judgement calls. Faster, and noticeably less sloppy.",
  },
  {
    version: "v5",
    status: "shipped",
    title: "Warmer, more crafted",
    body: "New palette, images pulled up the page, and a proper visual rhythm instead of stacked sections.",
  },
  {
    version: "v6",
    status: "shipped",
    title: "De-templated",
    body: "Took the cards, pills and squiggles out. Parchment, espresso ink, hairlines and whitespace instead — closer to a book than a landing page.",
  },
  {
    version: "v7",
    status: "ongoing",
    title: "Out in the world, still unfinished",
    body: "Versioned, published, and tweaked whenever something bugs me. That's the whole point.",
  },
];

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
  return (
    <Page>
      <PageHeader
        eyebrow="Working in public"
        title="Build Log"
        intro="Built quickly, refined with AI, versioned over time, tweaked slowly. This page is the receipts."
      />

      <p className="mt-8 text-sm italic text-muted-foreground">
        Built quickly · refined with AI · versioned · learning in public · tweaked slowly
      </p>

      <ol className="mt-14 border-t border-border">
        {ENTRIES.map((entry) => (
          <li
            key={entry.version}
            className="row-warm grid gap-x-8 gap-y-2 border-b border-border px-1 py-6 sm:grid-cols-[6rem_1fr] sm:px-3"
          >
            <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1">
              <span className="font-display text-lg text-accent">{entry.version}</span>
              <span
                className={`text-[0.62rem] uppercase tracking-[0.2em] ${
                  entry.status === "ongoing" ? "text-tobacco" : "text-muted-foreground"
                }`}
              >
                {entry.status}
              </span>
            </div>
            <div>
              <h2 className="text-lg leading-snug">{entry.title}</h2>
              <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-soft">{entry.body}</p>
            </div>
          </li>
        ))}
      </ol>

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
