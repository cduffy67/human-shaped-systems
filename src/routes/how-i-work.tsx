import { createFileRoute } from "@tanstack/react-router";

import { Page, PageHeader } from "@/components/site";

const STEPS = [
  {
    title: "Start with the user journey",
    body: "Before anything gets designed, I want to know what a real person is trying to do on a Tuesday afternoon, and where it currently goes wrong.",
  },
  {
    title: "Map the systems",
    body: "What already exists, who owns it, where the data lives, and which bits are held together with hope. Most of the answer is usually already in the room.",
  },
  {
    title: "Expose the trade-offs",
    body: "Every option costs something — time, flexibility, licence spend, someone's patience. Say it out loud early so nobody is surprised later.",
  },
  {
    title: "Tie technical choices to business value",
    body: "If I can't explain why a decision matters in the language of the person paying for it, it probably isn't the right decision.",
  },
  {
    title: "Build the smallest credible version",
    body: "Small enough to ship, real enough to judge. Credible is the key word — a demo that dodges the hard part convinces nobody.",
  },
  {
    title: "Make it extensible later",
    body: "Leave the seams visible. The goal is something the next person can pick up and extend without needing a séance.",
  },
];

export const Route = createFileRoute("/how-i-work")({
  head: () => ({
    meta: [
      { title: "How I Work — Conor Duffy" },
      {
        name: "description",
        content:
          "A six-step working framework: user journey, systems, trade-offs, business value, the smallest credible version, and room to extend.",
      },
      { property: "og:title", content: "How I Work — Conor Duffy" },
      {
        property: "og:description",
        content: "A plain-English framework for turning messy problems into working systems.",
      },
    ],
  }),
  component: HowIWork,
});

export function HowIWork() {
  return (
    <Page>
      <PageHeader
        eyebrow="Method, loosely held"
        title="How I Work"
        intro="Not a methodology. Just the order I tend to do things in, and why it usually holds up."
      />

      <ol className="relative mt-14 space-y-8 border-l border-dashed border-border pl-8 sm:pl-10">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative">
            <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card font-display text-sm text-accent sm:-left-[3.55rem]">
              {i + 1}
            </span>
            <h2 className="text-xl">{step.title}</h2>
            <p className="mt-2 max-w-2xl text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-14 max-w-2xl rounded-2xl bg-secondary/70 p-5 text-sm text-ink-soft">
        None of this is rigid. Some projects need three of these steps and a whiteboard; some need
        all six twice.
      </p>
    </Page>
  );
}
