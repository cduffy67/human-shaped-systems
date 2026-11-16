import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { BeatSection, BrandPill, Divider, Plate, PullQuote } from "@/components/site";
import { Beats, BeatHeading, BeatOpener } from "@/components/beats";
import { CONTENT } from "@/lib/content";
import { CaseCTA } from "@/components/case-cta";
import { setSiteMode, useSiteMode } from "@/lib/mode";
import { LiveTiles, useLiveUpdatedLabel } from "@/components/live-tiles";
import headshot from "@/assets/headshot.png.asset.json";
import { OFF_CLOCK_CAPTION, OFF_CLOCK_SRC } from "@/components/easter-eggs";
import team from "@/assets/team.png.asset.json";


const EXPLORING = [
  { topic: "Building with AI tools", note: "shipping things, not just slides" },
  { topic: "This digital garden", note: "you're standing in it" },
  { topic: "Enterprise AI adoption", note: "why pilots stall, and how they don't" },
  { topic: "Systems thinking", note: "seeing the whole board" },
  { topic: "How non-technical people become builders", note: "the new on-ramp" },
];
const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Conor Duffy · Enterprise problems, human-shaped solutions" },
      {
        name: "description",
        content:
          "Conor Duffy is an Irish enterprise solutions engineer in London, working across AI adoption, customer storytelling and practical architecture.",
      },
      {
        property: "og:title",
        content: "Conor Duffy · Enterprise problems, human-shaped solutions",
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
  const [heroOff, setHeroOff] = useState(false);
  const clicks = useRef<number[]>([]);
  const heroClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 3000), now];
    if (clicks.current.length >= 5 && !heroOff) {
      clicks.current = [];
      setHeroOff(true);
      window.setTimeout(() => setHeroOff(false), 6000);
    }
  };
  const liveLabel = useLiveUpdatedLabel();
  return (
    <div>
      {/* Hero */}
      <Beats id="home-hero" opener="hero" heading={CONTENT.hero.headline[mode]} placeOpener={false} className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.25fr_0.75fr] md:items-end">
        <div>
          <BeatOpener />
          <BeatHeading as="h1" text={CONTENT.hero.headline[mode]} circle="human-shaped" cursor className="hero-title text-[2.75rem] leading-[1.02] sm:text-[4.25rem]" />
          <p className="beat mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            {CONTENT.hero.sub[mode]}
          </p>
          <div className="beat mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <Link to="/how-i-work" className="quiet-link font-medium text-link">
              {engine ? "[ how_i_work → ]" : "How I work →"}
            </Link>
            <Link to="/contact" className={engine ? "quiet-link text-muted-foreground" : "quiet-link text-ink-soft"}>
              {engine ? "[ say_hello ]" : "Say hello"}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setSiteMode(engine ? "boardroom" : "engine")}
            className="mode-invite beat group mt-5 inline-flex flex-wrap items-baseline gap-x-1.5 rounded-sm text-left text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <span>{engine ? <><span className="text-[#6f675d]">// </span>Want to get out of the weeds?</> : "Want to see under the hood?"}</span>
            <span className="relative inline-flex items-baseline gap-1 text-accent">
              <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]">→</span>
              <span>{engine ? "Boardroom" : "Engine room"}</span>
              <svg aria-hidden="true" viewBox="0 0 100 8" preserveAspectRatio="none" className="pointer-events-none absolute -bottom-1.5 left-0 h-2 w-full fill-none">
                <path d="M 2 5 Q 25 2 50 4.5 T 98 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" pathLength={1} className="invite-line" />
              </svg>
            </span>
          </button>
        </div>

        <div className="beat">
          <div className="relative">
            <div className="overflow-hidden rounded-[4px] bg-secondary ring-1 ring-border shadow-[0_20px_50px_-34px_color-mix(in_oklab,var(--foreground)_75%,transparent)]">
              <img
                onClick={heroClick}
                src={heroOff ? OFF_CLOCK_SRC : headshot.url}
                alt={heroOff ? "Conor off the clock" : "Conor Duffy"}
                width={560}
                height={700}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <span aria-hidden="true" className="magnet" />
          </div>
          <p className={`no-slash mode-mono engine-caption mt-3 text-xs text-muted-foreground ${engine ? "" : "uppercase tracking-[0.18em]"}`}>
            {heroOff ? (engine ? `// ${OFF_CLOCK_CAPTION}` : OFF_CLOCK_CAPTION) : engine ? "// conor · principal_se" : "Conor Duffy · Principal SE"}
          </p>
        </div>
      </Beats>

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
      <Beats id="home-positioning" className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-start">
          <div>
            <p className="beat max-w-2xl text-lg leading-relaxed text-ink-soft">
              I started in accounting, ended up in consulting, then spent years in enterprise
              software watching good ideas die of vagueness. Now I work on the messy edge where
              business problems, architecture and budgets have to agree.
            </p>
          </div>
          <PullQuote className="beat">
            “The interesting part is rarely the software. It's the people arguing about what the
            software is for.”
          </PullQuote>
        </div>
      </Beats>

      {/* Currently exploring */}
      <BeatSection id="home-exploring" opener="exploring" title="Currently exploring" className="mx-auto w-full max-w-5xl px-5 pt-20 sm:px-8">
        {engine ? (
          <ul className="border-t border-border">
            {EXPLORING.map(({ topic, note }) => (
              <li key={topic} className="beat grid gap-1 border-b border-border py-2.5 text-sm sm:grid-cols-[22rem_1fr] sm:gap-6">
                <span className="text-accent">{kebab(topic)}</span>
                <span className="text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-2">
            {EXPLORING.map(({ topic }) => <span key={topic} className="beat topic-chip">{topic}</span>)}
          </div>
        )}
      </BeatSection>

      {/* Beyond work */}
      <BeatSection id="home-beyond" opener="tiles" openerText={liveLabel} title="Beyond work" note="the rest of it" className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 pt-20 sm:px-8">
        <div id="beyond" className="beat"><LiveTiles /></div>
      </BeatSection>
      <Beats id="home-about" opener="about" className="mx-auto w-full max-w-5xl px-5 pb-16 pt-12 sm:px-8">
        <div className="space-y-8">
          <div>
            <p className="beat max-w-xl text-lg leading-relaxed text-ink-soft">
              Usually running, reading, watching a film, following sport, or somewhere around a
              table with friends. Most of the good ideas turn up in one of those places rather than
              at a desk.
            </p>
            <p className="beat mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Nothing I've shipped happened alone either. The good bits usually came out of an
              argument with people I like.
            </p>
          </div>
          <div className="beat">
            <Plate
              src={team.url}
              alt="Conor with colleagues in the office"
              caption="The true driver of the work."
              className="mx-auto max-w-[720px]"
              ratio="aspect-[3/2]"
              position="object-center"
            />
          </div>
        </div>
      </Beats>
      <Beats id="home-cta" opener="cta" className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
        <div className="beat"><CaseCTA>See the work</CaseCTA></div>
      </Beats>
    </div>
  );
}
