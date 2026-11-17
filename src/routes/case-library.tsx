import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/site";
import { useSiteMode } from "@/lib/mode";
import { ArrowUpRight } from "lucide-react";
import { CASES } from "@/lib/cases";

export const Route = createFileRoute("/case-library")({
  head: () => ({
    meta: [
      { title: "Case Library · Conor Duffy" },
      { name: "description", content: "Enterprise AI, workflow design and practical architecture: Conor Duffy’s case library, from messy problem to credible solution." },
      { property: "og:title", content: "Case Library · Conor Duffy" },
      { property: "og:description", content: "Side projects and selected work in enterprise AI adoption and value-led solution design." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/case-library" }],
  }),
  component: CaseLibrary,
});

export function CaseLibrary() {
  const engine = useSiteMode() === "engine";
  return (
    <Page>
      <PageHeader opener="cases" eyebrow="Selected work · taking shape" title="Case Library" intro="From messy problem to credible solution. The themes are here; the write-ups are on their way.">
        <BuiltSection engine={engine} />

        <h2 className="beat mode-mono mt-16 text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
          {engine ? "$ ls cases/  # write-ups in progress" : "Case studies · write-ups in progress"}
        </h2>
        <div className="mt-4 border-t border-border">
          {CASES.map((study, i) => engine ? (
            <Link key={study.slug} to="/case-library/$slug" params={{ slug: study.slug }} className="beat row-warm grid gap-1 border-b border-border py-3 text-sm sm:grid-cols-[20rem_1fr_auto] sm:gap-6">
              <span className="text-accent">{study.slug}/</span>
              <span className="text-muted-foreground">{study.title} · {study.tags.join(", ").toLowerCase()}</span>
              <span aria-hidden="true" className="text-muted-foreground">draft</span>
            </Link>
          ) : (
            <Link key={study.slug} to="/case-library/$slug" params={{ slug: study.slug }} className="beat row-warm grid grid-cols-[2rem_1fr_auto] items-start gap-4 border-b border-border py-7 sm:grid-cols-[3rem_1fr_auto] sm:gap-6">
              <span className="mode-mono pt-1 text-xs text-accent">0{i + 1}</span>
              <div><h2 className="text-xl leading-snug sm:text-2xl">{study.title}</h2><div className="mode-mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>Write-up to follow</span><span>{study.tags.join(" / ")}</span></div></div>
              <span aria-hidden="true" className="text-xl text-accent">↗</span>
            </Link>
          ))}
        </div>
      </PageHeader>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Built: personal side projects, shown ahead of the case write-ups.  */
/* ------------------------------------------------------------------ */

const BUILT = [
  {
    slug: "fx-deal-desk",
    name: "FX Deal Desk Assistant",
    tagline: "Client FX emails in, checked tickets and safe replies out.",
    oneLiner: "Client FX email triage for relationship managers at a fictional bank, with policy guardrails the model can't override.",
    body: [
      "Clients send FX requests as messy emails, and someone retypes them. Here a relationship manager pastes the email, AI turns it into a ticket and flags what's missing, the bank's policy (not the AI) decides who needs to review it, and AI drafts a holding reply that's checked in code so it never promises a firm price or leaks internal detail.",
      "Two eval suites run against the live model: 12 test deals and 6 customer emails, three runs each, including prompt-injection attempts. Email extraction passed 99 of 99 field checks; the decision pack passes 35 of 36 runs.",
    ],
    finding:
      "The evals caught a regression I'd otherwise have shipped. Telling the model not to name internal teams in customer emails leaked into its internal analysis too, and its replies started promising firm quotes. The score dropped to 13 of 36 until a scoped prompt fixed it, and the runtime guardrail meant no user ever saw a bad reply.",
    stack: ["LLM extraction + drafting", "Rules engine", "Eval: 18 cases × 3 runs", "Lovable"],
    links: [
      { label: "Try it", href: "https://fx-deal-genius.lovable.app" },
      { label: "Code on GitHub", href: "https://github.com/cduffy67/fx-deal-genius" },
    ],
  },
  {
    slug: "bag-chancer",
    name: "Bag Chancer",
    tagline: "Will your bag make it through the gate?",
    oneLiner: "AI cabin bag checker for Ireland–UK flights, with a 5-model eval against real bag dimensions.",
    body: [
      "A playful cabin bag checker with a serious core. Snap a photo and pick your airline: a vision model estimates the bag's size, then ordinary code applies Ryanair, Aer Lingus, easyJet and BA cabin rules for a traffic-light verdict.",
      "I built an eval that runs product photos of 21 bags with published dimensions through 5 models (Gemini, Claude, GPT). It measures size error, and whether the app gives the same pass/fail answer it would with the real dimensions.",
    ],
    finding:
      "The most accurate model didn't make the best decisions, and without anything in the photo for scale, cheaper models confused 80 cm hold cases with cabin bags.",
    stack: ["Vision models", "Rules engine", "Eval: 5 models × 21 bags", "Lovable"],
    links: [
      { label: "Try it", href: "https://bag-chancer-ai.lovable.app" },
      { label: "Code on GitHub", href: "https://github.com/cduffy67/bag-chancer" },
    ],
  },
] as const;

function BuiltSection({ engine }: { engine: boolean }) {
  return (
    <section aria-labelledby="built-heading" className="mt-14">
      <h2 id="built-heading" className="beat mode-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
        {engine ? "$ ls ~/built" : "Built · side projects"}
      </h2>
      <div className="mt-4 border-t border-border">
        {BUILT.map((p) => (
          <article key={p.slug} className="beat grid gap-6 border-b border-border py-9 md:grid-cols-[1fr_15rem]">
            <div>
              <p className="no-slash mode-mono text-xs text-accent">{engine ? `${p.slug}/` : "Side project"}</p>
              <h3 className="mt-2 text-2xl leading-snug sm:text-3xl">{p.name}</h3>
              <p className="mt-1 text-lg italic text-muted-foreground">{p.tagline}</p>
              {p.body.map((para) => (
                <p key={para.slice(0, 24)} className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
              <p className="no-slash mt-5 max-w-2xl border-l-2 border-accent pl-4 leading-relaxed text-foreground">
                <span className="mode-mono mr-2 text-xs uppercase tracking-[0.18em] text-accent">
                  {engine ? "// finding:" : "Finding"}
                </span>
                {p.finding}
              </p>
            </div>
            <aside className="flex flex-col gap-5 md:pt-7">
              <ul className="flex flex-wrap gap-2 md:flex-col md:items-start">
                {p.stack.map((t) => (
                  <li key={t} className="mode-mono rounded-[4px] border border-border px-2 py-1 text-xs text-muted-foreground">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 self-start text-sm font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {engine ? `[ ${l.label.toLowerCase()} ]` : l.label}
                    <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            </aside>
          </article>
        ))}
      </div>
    </section>
  );
}
