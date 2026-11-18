import { createFileRoute } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/site";
import { useSiteMode } from "@/lib/mode";
import { ArrowUpRight } from "lucide-react";
import { BUILT } from "@/lib/built";
import { NextStep } from "@/components/site";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Lab · Conor Duffy" },
      { name: "description", content: "Things Conor Duffy has built end to end: live apps, the code, and the evals behind them." },
      { property: "og:title", content: "Lab · Conor Duffy" },
      { property: "og:description", content: "Live apps, the code, and the evals behind them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/lab" }],
  }),
  component: Lab,
});

export function Lab() {
  const engine = useSiteMode() === "engine";
  return (
    <Page>
      <PageHeader opener="cases" eyebrow="Built, shipped, tested" title="Lab" intro="Things I've built end to end. Each one is live, with the code and the evals behind it.">
        <BuiltSection engine={engine} />
        <NextStep to="/contact" kicker={engine ? "$ next" : "Like what you see?"} label={engine ? "cd ~/contact" : "Say hello →"} />
      </PageHeader>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Built: personal side projects, shown ahead of the case write-ups.  */
/* ------------------------------------------------------------------ */



function BuiltSection({ engine }: { engine: boolean }) {
  return (
    <section aria-labelledby="built-heading" className="mt-14">
      <h2 id="built-heading" className="beat mode-mono text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
        {engine ? "$ ls ~/built" : "Built · side projects"}
      </h2>
      <div className="mt-4 border-t border-border">
        {BUILT.map((p) => (
          <article key={p.slug} id={p.slug} className="beat scroll-mt-24 grid gap-6 border-b border-border py-9 md:grid-cols-[1fr_15rem]">
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
