import { createFileRoute, Link } from "@tanstack/react-router";

import { Blob, Card, SectionHeading, Squiggle } from "@/components/site";
import headshot from "@/assets/headshot.png.asset.json";
import team from "@/assets/team.png.asset.json";
import running from "@/assets/running.png.asset.json";

const STRENGTHS = [
  {
    title: "Value-led Solutions",
    body: "Start from the outcome someone is willing to pay for, then work backwards to the build.",
  },
  {
    title: "Ambiguity to Execution",
    body: "Take a vague, half-formed problem and turn it into something a team can actually start on.",
  },
  {
    title: "Executive to Technical Fluency",
    body: "Same story, two rooms. Board-level framing upstairs, honest detail with the engineers.",
  },
  {
    title: "Pragmatic Architecture",
    body: "Enough structure to hold weight, not so much that nobody can change it later.",
  },
  {
    title: "Measurable ROI",
    body: "If we can't say what got better, we haven't finished the job.",
  },
];

const EXPLORING = [
  "Building with AI tools",
  "Personal digital garden",
  "Enterprise AI adoption",
  "Slack, Salesforce and workflow systems",
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
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Blob className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 text-accent/10" />
        <Blob className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rotate-45 text-primary/10" />

        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rise">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Conor Duffy · London / Ireland
            </p>
            <h1 className="mt-4 text-4xl leading-[1.08] sm:text-6xl">
              Enterprise problems,
              <br />
              <span className="relative inline-block">
                human-shaped solutions.
                <Squiggle className="absolute -bottom-2 left-0 w-full" />
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-ink-soft">
              I work at the intersection of enterprise software, AI adoption, customer
              storytelling and practical architecture.
            </p>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              I help turn messy business problems into systems people can actually use, buy and
              trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/how-i-work"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                How I work
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Say hello
              </Link>
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

      {/* Strengths */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <SectionHeading note="the short version">What I'm good at</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STRENGTHS.map((s) => (
            <Card key={s.title}>
              <h3 className="text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </Card>
          ))}
          <Card className="flex items-center justify-center bg-secondary/70 text-center">
            <p className="text-sm text-ink-soft">
              Accounting → consulting → Salesforce → Slack.
              <br />
              <span className="text-muted-foreground">A slightly winding route here.</span>
            </p>
          </Card>
        </div>
      </section>

      {/* Currently exploring */}
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

      {/* Collaboration + beyond work */}
      <section className="mx-auto grid w-full max-w-5xl gap-4 px-5 pb-24 sm:px-8 md:grid-cols-2">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={team.url}
            alt="Conor with colleagues in the office"
            loading="lazy"
            className="h-28 w-full rounded-xl object-cover sm:w-36"
          />
          <div>
            <h3 className="text-lg">Mostly a team sport</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              The interesting part is rarely the software. It's the people arguing about what the
              software is for.
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src={running.url}
            alt="Conor with friends after a half marathon"
            loading="lazy"
            className="h-28 w-full rounded-xl object-cover sm:w-36"
          />
          <div>
            <h3 className="text-lg">Beyond work</h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              Running, rugby, and the ongoing search for a decent flat white in London.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
