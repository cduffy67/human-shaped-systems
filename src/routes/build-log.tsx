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
        content: "How this site gets built, version by version — a small learning project in public.",
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

      <div className="mt-10 flex flex-wrap gap-2">
        {["Built quickly", "Refined with AI", "Versioned", "Learning in public", "Tweaked slowly"].map(
          (t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-ink-soft"
            >
              {t}
            </span>
          ),
        )}
      </div>

      <ol className="ruled mt-10 space-y-0 rounded-3xl border border-border bg-paper/70 p-5 sm:p-7">
        {ENTRIES.map((entry, i) => (
          <li
            key={entry.version}
            className={`flex flex-col gap-1 py-5 sm:flex-row sm:gap-6 ${i > 0 ? "border-t border-border/70" : ""}`}
          >
            <div className="flex flex-none items-center gap-2 sm:w-32 sm:flex-col sm:items-start">
              <span className="font-display text-lg font-semibold text-accent">
                {entry.version}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] ${
                  entry.status === "ongoing" ? "bg-clay/30" : "bg-sage/25"
                }`}
              >
                {entry.status}
              </span>
            </div>
            <div>
              <h2 className="text-lg">{entry.title}</h2>
              <p className="mt-1 max-w-2xl text-sm text-ink-soft">{entry.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="py-12">
        <Divider mark="✳" />
      </div>

      <p className="max-w-2xl rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-ink-soft">
        The goal was never the most complex site possible. It was to build something real, ship it
        before it was ready, and keep improving it where people can see.
      </p>
    </Page>
  );
}
