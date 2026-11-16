import { createFileRoute, Link } from "@tanstack/react-router";

import { BrandPill, Divider, Label, Plate, PullQuote, SectionHeading } from "@/components/site";
import { CONTENT } from "@/lib/content";
import { CaseCTA } from "@/components/case-cta";
import { useSiteMode } from "@/lib/mode";
import { LiveTiles } from "@/components/live-tiles";
import headshot from "@/assets/headshot.png.asset.json";
import team from "@/assets/team.png.asset.json";


const EXPLORING = [
  "Building with AI tools",
  "This digital garden",
  "Enterprise AI adoption",
  "Systems thinking",
  "How non-technical people become builders",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conor Duffy — Enterprise problems, human-shaped solutions" },
      {
        name: "description",
        content:
          "Conor Duffy is an Irish enterprise solutions engineer in London, working across AI adoption, customer storytelling and practical architecture.",
      },
      {
        property: "og:title",
        content: "Conor Duffy — Enterprise problems, human-shaped solutions",
      },
      {
        property: "og:description",
        content:
          "I help turn messy business problems into systems people can actually use, buy and trust.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/" }],
  }),
  component: Home,
});

export function Home() {
  const mode = useSiteMode();
  const engine = mode === "engine";
  const lines = CONTENT.hero.headline[mode].split("|");
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.25fr_0.75fr] md:items-end">
        <div className="rise mode-fade" key={mode}>
          <Label className="mode-mono">{CONTENT.hero.label[mode]}</Label>
          <h1 className="mt-6 text-[2.75rem] leading-[1.02] sm:text-[4.25rem]">
            {lines.map((l, i) => (
              <span key={i}>
                {l}
                {i < lines.length - 1 ? <br /> : null}
              </span>
            ))}
            {engine ? <span className="block-cursor" aria-hidden="true" /> : null}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            {CONTENT.hero.sub[mode]}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <Link to="/how-i-work" className="quiet-link font-medium text-link">
              How I work →
            </Link>
            <Link to="/contact" className="quiet-link text-ink-soft">
              Say hello
            </Link>
          </div>
        </div>

        <div className="rise">
          <div className="relative">
            <div className="overflow-hidden rounded-[4px] bg-secondary ring-1 ring-border shadow-[0_20px_50px_-34px_color-mix(in_oklab,var(--foreground)_75%,transparent)]">
              <img
                src={headshot.url}
                alt="Conor Duffy"
                width={560}
                height={700}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <span aria-hidden="true" className="magnet" />
          </div>
          <p className="mode-mono mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Conor Duffy · Principal SE · London
          </p>
        </div>


      </section>

      {/* Career strip */}
      <section className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            Previously
          </span>
          <BrandPill label="KPMG" />
          <BrandPill label="Deloitte" />
          <BrandPill label="Salesforce" />
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            Now
          </span>
          <BrandPill label="Slack, again" className="whitespace-nowrap" />
        </div>
      </section>

      <div className="py-20">
        <Divider />
      </div>

      {/* Positioning */}
      <section className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-start">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
              I started in accounting, ended up in consulting, then spent years in enterprise
              software watching good ideas die of vagueness. Now I work on the messy edge where
              business problems, architecture and budgets have to agree.
            </p>
          </div>
          <PullQuote>
            “The interesting part is rarely the software. It's the people arguing about what the
            software is for.”
          </PullQuote>
        </div>
      </section>

      {/* Currently exploring */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-20 sm:px-8">
        <h2 className="mb-5 text-xl">Currently exploring</h2>
        <div className="flex flex-wrap gap-2">
          {EXPLORING.map((topic) => <span key={topic} className="topic-chip">{topic}</span>)}
        </div>
      </section>

      {/* Beyond work */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 pt-20 sm:px-8">
        <SectionHeading note="the rest of it">Beyond work</SectionHeading>
        <LiveTiles />
        <div className="space-y-8">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
              Usually running, reading, watching a film, following sport, or somewhere around a
              table with friends. Most of the good ideas turn up in one of those places rather than
              at a desk.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Nothing I've shipped happened alone either. The good bits usually came out of an
              argument with people I like.
            </p>
          </div>
          <div>
            <Plate
              src={team.url}
              alt="Conor with colleagues in the office"
              title="People"
              ratio="aspect-[16/7]"
              position="object-center"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8"><CaseCTA>See the work</CaseCTA></section>
    </div>
  );
}
