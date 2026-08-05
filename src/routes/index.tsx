import { createFileRoute, Link } from "@tanstack/react-router";

import { Blob, BrandPill, Card, Divider, Polaroid, SectionHeading, Squiggle } from "@/components/site";
import headshot from "@/assets/headshot.png.asset.json";
import team from "@/assets/team.png.asset.json";
import running from "@/assets/running.png.asset.json";
import stage from "@/assets/stage.png.asset.json";
import podcast from "@/assets/podcast.png.asset.json";
import cambridge from "@/assets/cambridge.png.asset.json";

const STRENGTHS = [
  {
    no: "01",
    title: "Value-led solutions",
    body: "Start from the outcome someone will actually pay for, then work backwards to the build.",
  },
  {
    no: "02",
    title: "Ambiguity to execution",
    body: "Turn a vague, half-formed problem into something a team can start on this week.",
  },
  {
    no: "03",
    title: "Two rooms, one story",
    body: "Board-level framing upstairs, honest detail with the engineers. Same story either way.",
  },
  {
    no: "04",
    title: "Pragmatic architecture",
    body: "Enough structure to hold weight, not so much that nobody can change it later.",
  },
  {
    no: "05",
    title: "Commercially grounded",
    body: "An accountant's instinct for what a decision costs, and what it's genuinely worth.",
  },
];

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
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Blob className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 text-clay/25" />
        <Blob className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rotate-45 text-sage/25" />

        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rise">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Conor Duffy · London / Ireland
            </p>
            <h1 className="mt-4 text-4xl leading-[1.06] sm:text-6xl">
              Enterprise problems,
              <br />
              <span className="relative inline-block">
                human-shaped solutions.
                <Squiggle className="absolute -bottom-2 left-0 w-full" />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-ink-soft">
              I help turn messy business problems into systems people can actually use, buy and
              trust — usually somewhere between enterprise software, AI adoption and a whiteboard
              nobody has rubbed out yet.
            </p>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Part storyteller, part systems thinker, part practical builder. Irish, based in
              London, still learning out loud.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/how-i-work"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                How I work
              </Link>
              <Link
                to="/journey"
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                My journey
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Previously
              </span>
              <BrandPill label="KPMG" />
              <BrandPill label="Deloitte" />
              <BrandPill label="Salesforce" />
              <BrandPill label="Slack" />
            </div>
          </div>

          <div className="rise relative mx-auto w-full max-w-[280px]">
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-accent/40" />
            <img
              src={headshot.url}
              alt="Conor Duffy"
              width={560}
              height={560}
              className="relative aspect-square w-full rounded-full object-cover shadow-[0_24px_60px_-30px_var(--foreground)]"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-xs text-ink-soft">
              well, hello
            </span>
          </div>
        </div>
      </section>

      {/* Field notes — images high on the page */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-4 sm:px-8">
        <div className="ruled rounded-3xl border border-border bg-paper/70 p-5 sm:p-8">
          <SectionHeading note="presenting, learning, talking">Work in the wild</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-3">
            <Polaroid
              src={stage.url}
              alt="Conor speaking on stage at a Salesforce event"
              caption="On stage — customer stories and live demos, demo gods permitting."
              tilt={-1.4}
            />
            <Polaroid
              src={podcast.url}
              alt="Conor in conversation during a filmed interview"
              caption="In conversation — how teams actually adopt AI, not how it demos."
              tilt={1.1}
            />
            <Polaroid
              src={cambridge.url}
              alt="Conor outside a Cambridge college during an AI course"
              caption="Still studying — Cambridge, and the habit of being the least expert in the room."
              tilt={-0.8}
            />
          </div>
        </div>
      </section>

      <div className="py-12">
        <Divider />
      </div>

      {/* Positioning */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 rounded-3xl border border-dashed border-border bg-card p-6 sm:p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <p className="max-w-2xl text-lg text-ink-soft">
            I started in accounting, ended up in consulting, and then spent years in enterprise
            software watching good ideas die of vagueness. Most of my work now happens on that messy
            edge where a business problem, a customer story, an architecture diagram and a budget
            all have to agree with each other.
          </p>
          <p className="rounded-2xl bg-secondary/70 p-4 font-display text-base leading-relaxed text-foreground/80">
            “The interesting part is rarely the software. It's the people arguing about what the
            software is for.”
          </p>
        </div>
      </section>

      {/* Strengths */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <SectionHeading note="the short version">What I'm good at</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STRENGTHS.map((s) => (
            <Card key={s.title} className="relative overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute right-3 top-1 font-display text-4xl text-secondary"
              >
                {s.no}
              </span>
              <h2 className="relative text-lg">{s.title}</h2>
              <p className="relative mt-2 text-sm text-ink-soft">{s.body}</p>
            </Card>
          ))}
          <Card className="flex items-center justify-center bg-secondary/70 text-center">
            <p className="text-sm text-ink-soft">
              Accounting → consulting → Slack → Salesforce → Slack again.
              <br />
              <Link to="/journey" className="text-accent underline underline-offset-4">
                The winding version
              </Link>
            </p>
          </Card>
        </div>
      </section>

      {/* Currently building */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <SectionHeading note="always in progress">Currently exploring</SectionHeading>
        <ul className="flex flex-wrap gap-3">
          {EXPLORING.map((item, i) => (
            <li
              key={item}
              className="card-lift rounded-2xl border border-border bg-card px-4 py-3 text-sm"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4)}deg)` }}
            >
              <span className="mr-2 text-accent">✳</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Beyond work */}
      <section className="mx-auto grid w-full max-w-5xl gap-4 px-5 pb-24 sm:px-8 md:grid-cols-2">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={team.url}
            alt="Conor with colleagues in the office"
            loading="lazy"
            className="h-28 w-full rounded-xl object-cover sm:w-36"
          />
          <div>
            <h2 className="text-lg">Mostly a team sport</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Nothing I've shipped happened alone. The good bits usually came out of an argument.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={running.url}
            alt="Conor with friends after a running event"
            loading="lazy"
            className="h-28 w-full rounded-xl object-cover sm:w-36"
          />
          <div>
            <h2 className="text-lg">Beyond work</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Running, rugby, and an ongoing search for a decent flat white in London.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
