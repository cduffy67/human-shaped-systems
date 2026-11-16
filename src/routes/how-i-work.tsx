import { createFileRoute, Link } from "@tanstack/react-router";

import { CONTENT, sectionNo } from "@/lib/content";
import { useSiteMode } from "@/lib/mode";
import { Divider, Label, Page, PageHeader, Plate, SectionHeading } from "@/components/site";

import { motion, useReducedMotion } from "framer-motion";
import { MethodDiagram } from "@/components/method-diagram";
import { CaseCTA } from "@/components/case-cta";
import { CASES, METHOD_STEPS } from "@/lib/cases";
import podcast from "@/assets/podcast.png.asset.json";
import cambridge from "@/assets/cambridge.png.asset.json";
import stage from "@/assets/stage.png.asset.json";

const PHOTOS = [
  { src: podcast.url, alt: "Conor in conversation during a filmed interview", caption: "Adoption beats features.", position: "object-center" },
  { src: cambridge.url, alt: "Conor outside a Cambridge college during an AI course", caption: "Stay the least expert in the room.", position: "object-bottom" },
  { src: stage.url, alt: "Conor speaking on stage at a Salesforce event", caption: "Making complex ideas useful in a room.", position: "object-center" },
];

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
  const reduce = useReducedMotion();
  return (
    <Page>
      <PageHeader
        eyebrow="Operating model, loosely held"
        title="How I Work"
        intro="Not a methodology. Three moves, six habits, and the order things usually need to happen in."
      />

      <MethodDiagram />

      <div className="mt-16 space-y-16">
        {PHASES.map((p, pi) => {
          const photo = PHOTOS[pi];
          if (!photo) return null;
          return (
          <section key={p.phase}>
            <div className="flex flex-wrap items-baseline gap-x-5 border-b border-border pb-3">
              <Label>{p.phase}</Label>
              <span className="mode-mono ml-auto font-display text-sm text-muted-foreground">
                {mode === "engine" ? sectionNo(pi + 1, mode) : `0${pi + 1} / 03`}
              </span>
            </div>

            <motion.div className="my-7" initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduce ? 0 : 0.55 }}>
              <Plate {...photo} ratio="aspect-[16/7]" />
            </motion.div>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {p.steps.map((s, si) => (
                <article key={s.title} id={METHOD_STEPS[pi * 2 + si]?.id} className="scroll-mt-28 border-b border-border/70 py-6">
                  <span className="mode-mono font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {pi * 2 + si + 1}
                  </span>
                  <h2 className="mt-2 text-xl leading-snug">{s.title}</h2>
                  <p key={mode} className="mode-fade mt-2 leading-relaxed text-ink-soft">
                    {CONTENT.method[pi * 2 + si]?.[mode]}
                  </p>
                  <Link to="/case-library/$slug" params={{ slug: METHOD_STEPS[pi * 2 + si]?.caseSlug ?? CASES[0].slug }} className="quiet-link mode-mono mt-5 inline-block text-xs leading-relaxed text-link">
                    SEEN IN → {CASES.find((study) => study.slug === METHOD_STEPS[pi * 2 + si]?.caseSlug)?.title}
                  </Link>
                </article>
              ))}
            </div>
          </section>
          );
        })}
      </div>

      <section className="mt-20">
        <SectionHeading>What that adds up to</SectionHeading>
        <div className="border-t border-border">
          {CONTENT.strengths.map((strength, i) => (
            <article key={i} className="row-warm grid gap-2 border-b border-border px-1 py-6 sm:grid-cols-[3.5rem_1fr_1.35fr] sm:gap-6 sm:px-3">
              <span className="mode-mono text-sm text-accent">{sectionNo(i + 1, mode)}</span>
              <h3 key={mode + "t"} className="mode-fade text-xl leading-snug">{strength.title[mode]}</h3>
              <p key={mode + "b"} className="mode-fade leading-relaxed text-ink-soft">{strength.body[mode]}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="py-16">
        <Divider />
      </div>

      <SectionHeading note="the honest caveat">In practice</SectionHeading>
      <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
        None of this is rigid. Some projects need three of these and a whiteboard. Some need all six
        twice, and a difficult conversation in the middle.
      </p>
      <div className="mt-16"><CaseCTA>See it in practice</CaseCTA></div>
    </Page>
  );
}
