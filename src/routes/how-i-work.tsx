import { createFileRoute, Link } from "@tanstack/react-router";
import { Beats } from "@/components/beats";

import { CONTENT, sectionNo } from "@/lib/content";
import { useSiteMode } from "@/lib/mode";
import { BeatSection, Divider, Label, Page, PageHeader } from "@/components/site";

import { MethodDiagram } from "@/components/method-diagram";
import { PhaseIllustration } from "@/components/phase-illustration";
import { withWet } from "@/components/easter-eggs";
import { CaseCTA } from "@/components/case-cta";
import { CASES, METHOD_STEPS } from "@/lib/cases";

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
        opener="how"
      >
        <MethodDiagram />
      </PageHeader>

      <div className="mt-16 space-y-16">
        {PHASES.map((p, pi) => {
          return (
          <Beats key={p.phase} id={`how-phase-${pi}`}>
            <div className="beat flex flex-wrap items-baseline gap-x-5 border-b border-border pb-3">
              <Label>{p.phase}</Label>
              <span className="mode-mono ml-auto font-display text-sm text-muted-foreground">
                {mode === "engine" ? sectionNo(pi + 1, mode) : `0${pi + 1} / 03`}
              </span>
            </div>

            <div className="mt-7 grid items-center gap-5 lg:grid-cols-[minmax(240px,0.85fr)_2fr] lg:gap-10">
              <PhaseIllustration phase={pi} />
              <div className="grid gap-x-8 sm:grid-cols-2">
              {p.steps.map((s, si) => (
                <article key={s.title} id={METHOD_STEPS[pi * 2 + si]?.id} className="beat scroll-mt-28 border-b border-border/70 py-6">
                  <span className="mode-mono font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {pi * 2 + si + 1}
                  </span>
                  <h2 className="mt-2 text-xl leading-snug">{s.title}</h2>
                  <p key={mode} className="mode-fade mt-2 leading-relaxed text-ink-soft">
                    {withWet(CONTENT.method[pi * 2 + si]?.[mode], "Tuesday afternoon")}
                  </p>
                  <Link to="/case-library/$slug" params={{ slug: METHOD_STEPS[pi * 2 + si]?.caseSlug ?? CASES[0].slug }} className="quiet-link mode-mono mt-5 inline-block text-xs leading-relaxed text-link">
                    SEEN IN → {CASES.find((study) => study.slug === METHOD_STEPS[pi * 2 + si]?.caseSlug)?.title}
                  </Link>
                </article>
              ))}
              </div>
            </div>
          </Beats>
          );
        })}
      </div>

      <BeatSection id="how-what" opener="what" title="What that adds up to" className="mt-20">
        {mode === "engine" ? (
          <ul className="border-t border-border">
            {CONTENT.strengths.map((strength, i) => (
              <li key={i} className="beat grid gap-1 border-b border-border py-3 text-sm sm:grid-cols-[18rem_1fr] sm:gap-6">
                <span className="text-accent">{strength.title.engine.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}</span>
                <span className="text-muted-foreground">{strength.body.engine}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid border-t border-border lg:grid-cols-5 lg:gap-6">
            {CONTENT.strengths.map((strength, i) => (
              <article key={i} className="beat row-warm flex flex-col gap-2 border-b border-border px-1 py-5 lg:border-b-0 lg:px-0">
                <span className="mode-mono text-sm text-accent">{sectionNo(i + 1, mode)}</span>
                <h3 className="text-base font-bold leading-snug">{strength.title[mode]}</h3>
                <p className="line-clamp-2 text-sm leading-snug text-ink-soft lg:line-clamp-3">{strength.body[mode]}</p>
              </article>
            ))}
          </div>
        )}
      </BeatSection>

      <div className="py-16">
        <Divider />
      </div>

      <BeatSection id="how-practice" title="In practice" note="the honest caveat">
      <p className="beat max-w-2xl text-lg leading-relaxed text-ink-soft">
        None of this is rigid. Some projects need three of these and a whiteboard. Some need all six
        twice, and a difficult conversation in the middle.
      </p>
      </BeatSection>
      <Beats id="how-cta" opener="cta" className="mt-16">
        <div className="beat"><CaseCTA>See it in practice</CaseCTA></div>
      </Beats>
    </Page>
  );
}
