import { createFileRoute } from "@tanstack/react-router";

import { Divider, Page, PageHeader, SectionHeading } from "@/components/site";

const PHASES = [
  {
    phase: "Messy problem",
    tone: "clay",
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
    tone: "haze",
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
    tone: "sage",
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

const TONE: Record<string, string> = {
  clay: "bg-clay/25",
  haze: "bg-haze/35",
  sage: "bg-sage/25",
};

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
  return (
    <Page>
      <PageHeader
        eyebrow="Operating model, loosely held"
        title="How I Work"
        intro="Not a methodology. Three moves, six habits, and the order things usually need to happen in."
      />

      {/* Flow map */}
      <div className="mt-12 grid items-center gap-3 rounded-3xl border border-dashed border-border bg-paper/70 p-5 text-center font-display text-sm sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:p-6">
        <span className="rounded-full bg-clay/25 px-4 py-2">Messy problem</span>
        <span aria-hidden="true" className="text-accent">
          →
        </span>
        <span className="rounded-full bg-haze/35 px-4 py-2">Mapped system</span>
        <span aria-hidden="true" className="text-accent">
          →
        </span>
        <span className="rounded-full bg-sage/25 px-4 py-2">Credible solution</span>
      </div>

      <div className="mt-14 space-y-12">
        {PHASES.map((p, pi) => (
          <section key={p.phase} className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.16em] ${TONE[p.tone]}`}
              >
                {p.phase}
              </span>
              <span className="hairline h-px flex-1" />
              <span className="font-display text-sm text-muted-foreground">
                0{pi + 1} / 03
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {p.steps.map((s, si) => (
                <article
                  key={s.title}
                  className="card-lift relative rounded-2xl border border-border bg-card p-5"
                >
                  <span className="font-display text-xs uppercase tracking-[0.16em] text-accent">
                    Step {pi * 2 + si + 1}
                  </span>
                  <h2 className="mt-2 text-xl">{s.title}</h2>
                  <p className="mt-2 text-ink-soft">{s.body}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="py-12">
        <Divider mark="↓" />
      </div>

      <SectionHeading note="the honest caveat">In practice</SectionHeading>
      <p className="ruled max-w-2xl rounded-2xl border border-border bg-paper/70 p-5 text-ink-soft">
        None of this is rigid. Some projects need three of these and a whiteboard. Some need all six
        twice, and a difficult conversation in the middle.
      </p>
    </Page>
  );
}
