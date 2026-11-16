import { createFileRoute } from "@tanstack/react-router";

import { BrandPill, Divider, Page, PageHeader, Plate, PullQuote, BeatSection } from "@/components/site";
import stage from "@/assets/stage.png.asset.json";
import cambridge from "@/assets/cambridge.png.asset.json";
import podcast from "@/assets/podcast.png.asset.json";

const CHAPTERS: {
  brand: string;
  era: string;
  title: string;
  subtitle?: string;
  years: string;
  body: string;
  tags: string[];
}[] = [
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
    brand: "Slack, again",
    era: "Now",
    title: "Slack, again",
    subtitle: "Second lap, building this time",
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
        opener="journey"
      >
      {/* Stage markers */}
      <div className="beat mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-border py-4">
        {["UCD", "KPMG", "Deloitte", "Slack", "Salesforce", "Slack, again", "Cambridge"].map(
          (label, i, arr) => (
            <span key={label} className="flex items-center gap-3">
              <BrandPill label={label} className="whitespace-nowrap" />
              {i < arr.length - 1 ? (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              ) : null}
            </span>
          ),
        )}
      </div>
      </PageHeader>

      {/* Photography, early */}
      <BeatSection id="journey-dimensions" title="Different dimensions" note="occasionally in public" className="mt-20">
        <div className="grid gap-8 md:grid-cols-3">
          <Plate className="beat"
            src={stage.url}
            alt="Conor speaking on stage at a Salesforce event"
            ratio="aspect-[4/3]"
            title="Evangelising"
            caption="Making complex ideas useful in a room."
          />
          <Plate className="beat"
            src={podcast.url}
            alt="Conor in conversation during a filmed interview"
            ratio="aspect-[4/3]"
            title="In conversation"
            caption="Adoption beats features."
          />
          <Plate className="beat"
            src={cambridge.url}
            alt="Conor outside a Cambridge college during an AI course"
            ratio="aspect-[4/3]"
            position="object-top"
            title="Learning"
            caption="Stay the least expert in the room."
          />
        </div>
      </BeatSection>

      <div className="py-20">
        <Divider />
      </div>

      <BeatSection id="journey-chapters" title="Chapter by chapter" note="the winding version">

      <ol className="border-t border-border">
        {CHAPTERS.map((c, i) => (
          <li
            key={c.brand}
            className="beat grid gap-x-10 gap-y-3 border-b border-border py-9 md:grid-cols-[10rem_1fr]"
          >
            <div className="flex flex-col gap-1.5">
              <span className="mode-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <BrandPill label={c.brand} className="self-start" />
              <span className="text-sm text-muted-foreground">{c.years}</span>
            </div>
            <div>
              <h2 className="text-2xl leading-snug">{c.title}</h2>
              {c.subtitle ? (
                <p className="mt-1 text-base italic text-muted-foreground">{c.subtitle}</p>
              ) : null}
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{c.body}</p>
              <p className="mt-4 text-sm italic text-muted-foreground">{c.tags.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>

      <PullQuote className="beat mt-16 max-w-2xl">
        The through-line: numbers taught me what a business cares about, consulting taught me how
        change actually lands, and enterprise software taught me how to build something people will
        still use on a wet Tuesday.
      </PullQuote>
      </BeatSection>
    </Page>
  );
}
