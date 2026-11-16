import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Page, PageHeader, SectionHeading } from "@/components/site";
import { CASES, METHOD_STEPS } from "@/lib/cases";

export const Route = createFileRoute("/case-library_/$slug")({
  loader: ({ params }) => {
    const study = CASES.find((item) => item.slug === params.slug);
    if (!study) throw notFound();
    return study;
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.title ?? "Case unavailable"} · Conor Duffy`;
    const description = loaderData ? `A forthcoming case study on ${loaderData.title.toLowerCase()}, from messy problem to credible solution.` : "This case study is unavailable.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex" }] };
  },
  component: CaseStudy,
});

function CaseStudy() {
  const study = Route.useLoaderData();
  return (
    <Page>
      <Link to="/case-library" className="quiet-link mode-mono text-xs text-link">← Case Library</Link>
      <div className="mt-10"><PageHeader eyebrow="Case study · placeholder" title={study.title} intro="Outcome to follow." /></div>
      <div className="mt-6 flex flex-wrap gap-2">{study.tags.map((tag) => <span key={tag} className="topic-chip">{tag}</span>)}</div>
      <div className="mt-16 space-y-12">
        {["Messy problem", "Mapped system", "Credible solution", "What changed"].map((title) => (
          <section key={title}><SectionHeading>{title}</SectionHeading><p className="text-ink-soft">{title === "What changed" ? "Outcome to follow." : "Case notes to follow."}</p></section>
        ))}
        <section><SectionHeading>Steps used</SectionHeading><p className="mb-5 text-sm text-muted-foreground">Provisional links. Case mapping to follow.</p><div className="flex flex-wrap gap-2">{METHOD_STEPS.filter((step) => step.caseSlug === study.slug).map((step) => <Link key={step.id} to="/how-i-work" hash={step.id} className="topic-chip transition-colors hover:border-accent focus-visible:outline-accent">{step.title} ↗</Link>)}</div></section>
      </div>
    </Page>
  );
}