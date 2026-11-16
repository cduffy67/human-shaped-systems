import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader } from "@/components/site";
import { useSiteMode } from "@/lib/mode";
import { CASES } from "@/lib/cases";

export const Route = createFileRoute("/case-library")({
  head: () => ({
    meta: [
      { title: "Case Library — Conor Duffy" },
      { name: "description", content: "Enterprise AI, workflow design and practical architecture: Conor Duffy’s case library, from messy problem to credible solution." },
      { property: "og:title", content: "Case Library — Conor Duffy" },
      { property: "og:description", content: "Selected work in enterprise AI adoption and value-led solution design. Case write-ups coming soon." },
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
        <div className="mt-14 border-t border-border">
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
