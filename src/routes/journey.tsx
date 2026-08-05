import { createFileRoute } from "@tanstack/react-router";

import { BrandPill, Card, Divider, Page, PageHeader, SectionHeading } from "@/components/site";
import stage from "@/assets/stage.png.asset.json";
import cambridge from "@/assets/cambridge.png.asset.json";
import podcast from "@/assets/podcast.png.asset.json";

const CHAPTERS = [
  {
    brand: "UCD / Dublin",
    era: "Roots",
    title: "Numbers first",
    years: "Commerce, then a training contract",
    body: "Dublin, a commerce degree, and an audit training contract at KPMG — insurance, SaaS and an Irish pillar bank. Learning to read a business through its accounts turned out to be a quiet superpower later.",
    tags: ["Irish roots", "ACMA, CGMA", "Audit"],
  },
  {
    brand: "KPMG",
    era: "Audit",
    title: "Learning how businesses actually run",
    years: "Training contract",
    body: "Three years of looking at companies from the inside out. You stop being impressed by strategy decks quite quickly when you've reconciled the numbers behind them.",
    tags: ["Financial services", "Assurance", "Detail"],
  },
  {
    brand: "Deloitte",
    era: "Consulting",
    title: "Transformation, at scale",
    years: "2018 – 2022",
    body: "Four years in financial digital transformation: SAP S/4HANA finance programmes for FTSE 100 clients, design through deployment, plus CFO labs and workshops. This is where messy stakeholder reality became the interesting part.",
    tags: ["Finance transformation", "Programme delivery", "Executive rooms"],
  },
  {
    brand: "Slack",
    era: "Enterprise",
    title: "Solutions engineering, first lap",
    years: "2022 – 2025",
    body: "Enterprise financial services and fintech. Rookie of the Year, then #1 in EMEA. Built the UKI Partner Network and designed Slack Campfires, an enablement programme that ended up running globally.",
    tags: ["Solution design", "Zero-to-one", "Storytelling"],
  },
  {
    brand: "Salesforce",
    era: "Platform",
    title: "High tech and agents",
    years: "2025",
    body: "Led solution engineering for High Tech Enterprise, shaping go-to-market for Agentforce and the wider platform. A year of watching AI move from slide to production, and of how differently teams react to that.",
    tags: ["Agentforce", "Go-to-market", "AI adoption"],
  },
  {
    brand: "Slack · AI-native",
    era: "Now",
    title: "Second lap, building this time",
    years: "Present",
    body: "Back at Slack as Principal Solutions Engineer, working where conversation, CRM and AI meet — and increasingly building things myself instead of only designing them on a whiteboard.",
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

export function Journey() {
  return (
    <Page>
      <PageHeader
        eyebrow="A bit about me"
        title="Journey"
        intro="A slightly winding route: accounting, consulting, then enterprise software. Each step added a language — numbers, systems, customers — and I still use all three."
      />

      {/* Stage markers */}
      <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3 rounded-2xl border border-dashed border-border bg-paper/70 p-4">
        {["UCD", "KPMG", "Deloitte", "Slack", "Salesforce", "Cambridge", "Slack · AI-native"].map(
          (label, i, arr) => (
            <span key={label} className="flex items-center gap-2">
              <BrandPill label={label} />
              {i < arr.length - 1 ? (
                <span aria-hidden="true" className="text-accent/60">
                  ·
                </span>
              ) : null}
            </span>
          ),
        )}
      </div>

      {/* Work in the wild — early, not buried */}
      <section className="mt-12">
        <SectionHeading note="occasionally in public">Different dimensions</SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              src: stage.url,
              alt: "Conor speaking on stage at a Salesforce event",
              h: "Presenting",
              p: "Customer stories and live demos, in front of rooms that ask hard questions.",
            },
            {
              src: podcast.url,
              alt: "Conor in conversation during a filmed interview",
              h: "In conversation",
              p: "Interviews and panels — usually about adoption, not features.",
            },
            {
              src: cambridge.url,
              alt: "Conor outside a Cambridge college during an AI course",
              h: "Learning",
              p: "Cambridge, for an AI programme. Being the least expert in the room is a good habit.",
            },
          ].map((f) => (
            <figure
              key={f.h}
              className="card-lift overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img src={f.src} alt={f.alt} loading="lazy" className="h-44 w-full object-cover" />
              <figcaption className="p-4">
                <h3 className="text-base">{f.h}</h3>
                <p className="mt-1 text-sm text-ink-soft">{f.p}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="py-12">
        <Divider mark="↓" />
      </div>

      <SectionHeading note="the winding version">Chapter by chapter</SectionHeading>

      <ol className="relative space-y-5 border-l border-dashed border-border pl-6 sm:pl-9">
        {CHAPTERS.map((c, i) => (
          <li key={c.brand} className="relative">
            <span className="absolute -left-[1.85rem] top-6 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background sm:-left-[2.6rem]" />
            <Card className="relative overflow-hidden">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-3 font-display text-5xl leading-none text-secondary"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative flex flex-wrap items-center gap-2">
                <BrandPill label={c.brand} />
                <span className="rounded-full bg-secondary px-2.5 py-0.5 font-display text-xs font-semibold text-accent">
                  {c.era}
                </span>
                <span className="text-xs text-muted-foreground">{c.years}</span>
              </div>
              <h2 className="relative mt-3 text-xl">{c.title}</h2>
              <p className="relative mt-2 max-w-2xl text-ink-soft">{c.body}</p>
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

      <p className="ruled mt-14 max-w-2xl rounded-2xl border border-border bg-paper/70 p-5 text-ink-soft">
        The through-line: numbers taught me what a business cares about, consulting taught me how
        change actually lands, and enterprise software taught me how to build something people will
        still use on a wet Tuesday.
      </p>
    </Page>
  );
}
