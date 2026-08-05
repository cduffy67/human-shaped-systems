import { createFileRoute, Link } from "@tanstack/react-router";

import { BrandPill, Divider, Label, Plate, SectionHeading } from "@/components/site";
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
  { title: "Building with AI tools", note: "less designing, more shipping" },
  { title: "This digital garden", note: "perpetually unfinished, deliberately" },
  { title: "Enterprise AI adoption", note: "the human bit, not the model bit" },
  { title: "Systems thinking", note: "an old habit, newly useful" },
  { title: "How non-technical people become builders", note: "including me" },
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
      <section className="mx-auto grid w-full max-w-5xl gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.25fr_0.75fr] md:items-end">
        <div className="rise">
          <Label>Conor Duffy · London / Ireland</Label>
          <h1 className="mt-6 text-[2.6rem] leading-[1.04] sm:text-[4rem]">
            Enterprise problems,
            <br />
            human-shaped
            <br />
            solutions.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
            I help turn messy business problems into systems people can actually use, buy and
            trust — usually somewhere between enterprise software, AI adoption and a whiteboard
            nobody has rubbed out yet.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Part storyteller, part systems thinker, part practical builder. Irish, based in London,
            still learning out loud.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <Link to="/how-i-work" className="quiet-link font-medium text-foreground">
              How I work →
            </Link>
            <Link to="/journey" className="quiet-link font-medium text-foreground">
              My journey →
            </Link>
            <Link to="/contact" className="quiet-link text-ink-soft">
              Say hello
            </Link>
          </div>
        </div>

        <div className="rise">
          <div className="overflow-hidden rounded-2xl bg-secondary ring-1 ring-border shadow-[0_20px_50px_-34px_color-mix(in_oklab,var(--foreground)_75%,transparent)]">
            <img
              src={headshot.url}
              alt="Conor Duffy"
              width={560}
              height={700}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">This is me 👋</p>
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

      {/* Field notes — photography high on the page */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-20 sm:px-8">
        <SectionHeading note="presenting, learning, talking">Work in the wild</SectionHeading>
        <div className="grid gap-8 sm:grid-cols-3">
          <Plate
            src={stage.url}
            alt="Conor speaking on stage at a Salesforce event"
            ratio="aspect-[4/3]"
            title="Evangelising"
            caption="Making complex ideas useful in a room."
          />
          <Plate
            src={podcast.url}
            alt="Conor in conversation during a filmed interview"
            ratio="aspect-[4/3]"
            title="In conversation"
            caption="Adoption beats features."
          />
          <Plate
            src={cambridge.url}
            alt="Conor outside a Cambridge college during an AI course"
            ratio="aspect-[4/3]"
            position="object-top"
            title="Learning"
            caption="Stay the least expert in the room."
          />

        </div>
      </section>

      <div className="py-20">
        <Divider />
      </div>

      {/* Positioning */}
      <section className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-start">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
            I started in accounting, ended up in consulting, and then spent years in enterprise
            software watching good ideas die of vagueness. Most of my work now happens on that messy
            edge where a business problem, a customer story, an architecture diagram and a budget
            all have to agree with each other.
          </p>
          <blockquote className="border-l border-accent/50 pl-5 font-display text-lg italic leading-relaxed text-foreground/80">
            “The interesting part is rarely the software. It's the people arguing about what the
            software is for.”
          </blockquote>
        </div>
      </section>

      {/* Strengths — editorial index */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-24 sm:px-8">
        <SectionHeading note="the short version">What I do</SectionHeading>
        <div className="border-t border-border">
          {STRENGTHS.map((s) => (
            <article
              key={s.title}
              className="row-warm grid gap-2 border-b border-border px-1 py-6 sm:grid-cols-[3.5rem_1fr_1.35fr] sm:gap-6 sm:px-3"
            >
              <span className="font-display text-sm text-accent/80">{s.no}</span>
              <h3 className="text-xl leading-snug">{s.title}</h3>
              <p className="leading-relaxed text-ink-soft">{s.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Accounting → consulting → Slack → Salesforce → Slack again.{" "}
          <Link to="/journey" className="quiet-link text-accent">
            The winding version
          </Link>
        </p>
      </section>

      {/* Currently exploring — notebook index */}
      <section className="mx-auto w-full max-w-5xl px-5 pt-24 sm:px-8">
        <SectionHeading note="always in progress">Currently exploring</SectionHeading>
        <ol className="max-w-3xl">
          {EXPLORING.map((item, i) => (
            <li
              key={item.title}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border/70 py-3.5"
            >
              <span className="w-6 font-display text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-lg">{item.title}</span>
              <span className="text-sm italic text-muted-foreground">{item.note}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Beyond work */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-28 pt-24 sm:px-8">
        <SectionHeading note="the rest of it">Beyond work</SectionHeading>
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-start">
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
              ratio="aspect-[4/3]"
              position="object-center"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
