import { createFileRoute } from "@tanstack/react-router";

import { Page, PageHeader } from "@/components/site";

const ENTRIES = [
  {
    version: "v0",
    title: "Scaffolded in Lovable",
    body: "An empty page and a vague idea. Enough to start.",
  },
  {
    version: "v1",
    title: "Personal positioning and site structure",
    body: "Worked out what this site is actually for, and which pages earn their place.",
  },
  {
    version: "v2",
    title: "Refined with better copy and visual direction",
    body: "Made it sound like me rather than like a landing page.",
  },
  {
    version: "v3",
    title: "Enriched with real experience, images and career context",
    body: "Added the journey, a few honest photos, and the parts of the story worth telling publicly.",
  },
  {
    version: "v4",
    title: "Reviewed and improved with Claude Code",
    body: "A second pass on the code itself — structure, clarity, the boring-but-important bits.",
  },
  {
    version: "v5",
    title: "Versioned and hosted",
    body: "Proper history and a real URL, so changes are traceable and reversible.",
  },
  {
    version: "v6",
    title: "Tweaked slowly over time",
    body: "Out in the world, still unfinished. That's the point.",
  },
];

export const Route = createFileRoute("/build-log")({
  head: () => ({
    meta: [
      { title: "Build Log — Conor Duffy" },
      {
        name: "description",
        content:
          "A running log of how this site gets built, from scaffold to shipped: an AI-assisted builder workflow, in public.",
      },
      { property: "og:title", content: "Build Log — Conor Duffy" },
      {
        property: "og:description",
        content:
          "How this site gets built, version by version — a small learning project in public.",
      },
    ],
  }),
  component: BuildLog,
});

function BuildLog() {
  return (
    <Page>
      <PageHeader
        eyebrow="Working in public"
        title="Build Log"
        intro="This site is also a small learning project: a way to understand the modern AI-assisted builder workflow from idea to shipped artefact."
      />

      <ol className="relative mt-14 space-y-7 border-l border-border pl-8">
        {ENTRIES.map((entry) => (
          <li key={entry.version} className="relative">
            <span className="absolute -left-[2.28rem] top-2 h-3 w-3 rounded-full border-2 border-accent bg-background" />
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-display text-xs font-semibold text-accent">
                {entry.version}
              </span>
              <h2 className="text-lg">{entry.title}</h2>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{entry.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-14 max-w-2xl rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-ink-soft">
        The point is not to build the most complex site possible. The point is to build something
        real, ship it quickly, and keep learning in public.
      </p>
    </Page>
  );
}
