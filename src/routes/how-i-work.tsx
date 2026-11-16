import { createFileRoute } from "@tanstack/react-router";

import { CONTENT, sectionNo } from "@/lib/content";
import { useSiteMode } from "@/lib/mode";
import { Divider, Label, Page, PageHeader, SectionHeading } from "@/components/site";

const PHASES = [
  {
    phase: "Messy problem",
    steps: [
      {
        title: "Start with the user journey",
        body: "What is a real person trying to do on a Tuesday afternoon, and where does it currently go wrong?",
      },
      {
        title: "Map the systems",
        body: "What already exists, who owns it, where the data lives, and which bits are held together with hope.",
      },
    ],
  },
  {
    phase: "Mapped system",
    steps: [
      {
        title: "Expose the trade-offs",
        body: "Every option costs something — time, flexibility, licence spend, someone's patience. Say it out loud early.",
      },
      {
        title: "Tie choices to business value",
        body: "If I can't explain a decision in the language of the person paying for it, it's probably the wrong decision.",
      },
    ],
  },
  {
    phase: "Credible solution",
    steps: [
      {
        title: "Build the smallest credible version",
        body: "Small enough to ship, real enough to judge. A demo that dodges the hard part convinces nobody.",
      },
      {
        title: "Make it extensible later",
        body: "Leave the seams visible, so the next person can pick it up and extend it without needing a séance.",
      },
    ],
  },
];

export const Route = createFileRoute("/how-i-work")({
  head: () => ({
    meta: [
      { title: "How I Work — Conor Duffy" },
      {
        name: "description",
        content:
          "A working framework in three moves: messy problem, mapped system, credible solution — user journeys, trade-offs, business value and room to extend.",
      },
      { property: "og:title", content: "How I Work — Conor Duffy" },
      {
        property: "og:description",
        content: "A plain-English operating model for turning messy problems into working systems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/how-i-work" }],
  }),
  component: HowIWork,
});

export function HowIWork() {
  const mode = useSiteMode();
  return (
    <Page>
      <PageHeader
        eyebrow="Operating model, loosely held"
        title="How I Work"
        intro="Not a methodology. Three moves, six habits, and the order things usually need to happen in."
      />

      {/* Flow line */}
      <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-5 font-display text-lg">
        <span>Messy problem</span>
        <span aria-hidden="true" className="text-accent">
          →
        </span>
        <span>mapped system</span>
        <span aria-hidden="true" className="text-accent">
          →
        </span>
        <span>credible solution</span>
      </div>

      <div className="mt-16 space-y-16">
        {PHASES.map((p, pi) => (
          <section key={p.phase}>
            <div className="flex flex-wrap items-baseline gap-x-5 border-b border-border pb-3">
              <Label>{p.phase}</Label>
              <span className="mode-mono ml-auto font-display text-sm text-muted-foreground">
                {mode === "engine" ? sectionNo(pi + 1, mode) : `0${pi + 1} / 03`}
              </span>
            </div>

            <div className="grid gap-x-12 sm:grid-cols-2">
              {p.steps.map((s, si) => (
                <article key={s.title} className="border-b border-border/70 py-6">
                  <span className="mode-mono font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {pi * 2 + si + 1}
                  </span>
                  <h2 className="mt-2 text-xl leading-snug">{s.title}</h2>
                  <p key={mode} className="mode-fade mt-2 leading-relaxed text-ink-soft">
                    {CONTENT.method[pi * 2 + si][mode]}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="py-16">
        <Divider />
      </div>

      <SectionHeading note="the honest caveat">In practice</SectionHeading>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        None of this is rigid. Some projects need three of these and a whiteboard. Some need all six
        twice, and a difficult conversation in the middle.
      </p>
    </Page>
  );
}
