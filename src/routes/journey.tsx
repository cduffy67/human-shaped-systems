import { createFileRoute } from "@tanstack/react-router";

import { Card, Page, PageHeader, SectionHeading } from "@/components/site";
import stage from "@/assets/stage.png.asset.json";
import cambridge from "@/assets/cambridge.png.asset.json";
import podcast from "@/assets/podcast.png.asset.json";

const CHAPTERS = [
  {
    era: "Dublin",
    title: "Numbers first",
    years: "Commerce, then audit",
    body: "Started in Dublin with a commerce degree and a training contract at KPMG — insurance, SaaS and an Irish pillar bank. Learning to read a business through its accounts turned out to be a useful superpower later.",
    tags: ["Irish roots", "ACMA, CGMA", "Audit"],
  },
  {
    era: "Deloitte",
    title: "Consulting, at scale",
    years: "2018 – 2022",
    body: "Four years in financial digital transformation: SAP S/4HANA finance programmes for FTSE 100 clients, from design through to deployment, plus CFO labs and workshops. This is where messy stakeholder reality became the interesting part.",
    tags: ["Finance transformation", "Programme delivery", "Executive rooms"],
  },
  {
    era: "Slack",
    title: "Enterprise and fintech",
    years: "2022 – 2025",
    body: "Solutions engineering for enterprise financial services and fintech. Rookie of the Year, then #1 in EMEA. Built the UKI Partner Network and designed Slack Campfires, an enablement programme that ended up running globally.",
    tags: ["Solution design", "Zero-to-one programmes", "Storytelling"],
  },
  {
    era: "Salesforce",
    title: "High tech and agents",
    years: "2025",
    body: "Led solution engineering for High Tech Enterprise, shaping go-to-market for Agentforce and the wider platform. A year of learning how quickly AI moves from slide to production — and how differently teams react to it.",
    tags: ["Agentforce", "Go-to-market", "AI adoption"],
  },
  {
    era: "Now",
    title: "AI-native, second lap",
    years: "Present",
    body: "Back at Slack as Principal Solutions Engineer, working where conversation, CRM and AI meet. Increasingly building things myself rather than just designing them on a whiteboard.",
    tags: ["Principal SE", "Building", "Learning in public"],
  },
];

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Conor Duffy" },
      {
        name: "description",
        content:
          "From Dublin audit to Deloitte consulting to Slack and Salesforce — the winding route into enterprise solutions engineering and AI-native work.",
      },
      { property: "og:title", content: "Journey — Conor Duffy" },
      {
        property: "og:description",
        content:
          "Accounting, consulting, Slack, Salesforce and what comes next — a short career story, told properly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/journey" }],
  }),
  component: Journey,
});

function Journey() {
  return (
    <Page>
      <PageHeader
        eyebrow="A bit about me"
        title="Journey"
        intro="A slightly winding route: accounting, consulting, then enterprise software. Each step added a language — numbers, systems, customers — and I still use all three."
      />

      <ol className="mt-14 space-y-5">
        {CHAPTERS.map((c, i) => (
          <li key={c.era}>
            <Card className="relative overflow-hidden">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 -top-4 font-display text-6xl text-secondary"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full bg-secondary px-3 py-0.5 font-display text-xs font-semibold text-accent">
                  {c.era}
                </span>
                <h2 className="text-xl">{c.title}</h2>
                <span className="text-xs text-muted-foreground">{c.years}</span>
              </div>
              <p className="relative mt-3 max-w-2xl text-ink-soft">{c.body}</p>
              <ul className="relative mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ol>

      <section className="mt-20">
        <SectionHeading note="occasionally in public">Work in the wild</SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          <figure className="card-lift overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={stage.url}
              alt="Conor speaking on stage at a Salesforce event"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
            <figcaption className="p-4">
              <h3 className="text-base">On stage</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Customer stories, live demos, and the occasional demo gods moment.
              </p>
            </figcaption>
          </figure>

          <figure className="card-lift overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={podcast.url}
              alt="Conor in conversation during a filmed interview"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
            <figcaption className="p-4">
              <h3 className="text-base">In conversation</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Interviews and panels — usually about how teams actually adopt AI, not how it demos.
              </p>
            </figcaption>
          </figure>

          <figure className="card-lift overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={cambridge.url}
              alt="Conor outside a Cambridge college during an AI course"
              loading="lazy"
              className="h-44 w-full object-cover"
            />
            <figcaption className="p-4">
              <h3 className="text-base">Still studying</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Cambridge, for an AI programme. Being the least expert person in the room is a good
                habit.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <p className="mt-14 max-w-2xl rounded-2xl bg-secondary/70 p-5 text-sm text-ink-soft">
        The through-line: numbers taught me what a business cares about, consulting taught me how
        change actually lands, and enterprise software taught me how to build something people will
        use on a Tuesday.
      </p>
    </Page>
  );
}
