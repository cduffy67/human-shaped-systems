import { createFileRoute } from "@tanstack/react-router";

import { Card, Page, PageHeader } from "@/components/site";

const LINKS = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/conor-duffy",
    href: "https://www.linkedin.com/in/conor-duffy/",
  },
  { label: "Email", value: "conor_duffy@me.com", href: "mailto:conor_duffy@me.com" },
  { label: "GitHub", value: "github.com/cduffy67", href: "https://github.com/cduffy67" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Conor Duffy" },
      {
        name: "description",
        content:
          "Get in touch about enterprise AI, systems thinking, solution architecture, or coffee. Based in London, from Ireland.",
      },
      { property: "og:title", content: "Contact — Conor Duffy" },
      {
        property: "og:description",
        content:
          "Always happy to chat about enterprise AI, systems thinking, solution architecture, or the odd good coffee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/contact" }],
  }),
  component: Contact,
});

export function Contact() {
  return (
    <Page>
      <PageHeader
        eyebrow="Say hello"
        title="Contact"
        intro="Always happy to chat about enterprise AI, systems thinking, solution architecture, or the odd good coffee."
        opener="contact"
      >

      <div className="mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className="beat block"
          >
            <Card>
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {link.label}
              </span>
              <p className="no-slash quiet-link relative mt-3 inline-block font-display text-lg text-foreground">
                {link.value}
              </p>
            </Card>
          </a>
        ))}
        <Card className="beat">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Location
          </span>
          <p className="no-slash mt-3 font-display text-lg text-foreground">London / Ireland</p>
        </Card>
      </div>


      <p className="beat mt-10 max-w-2xl leading-relaxed text-ink-soft">
        Based in <span className="font-medium">London</span>, from{" "}
        <span className="font-medium">Ireland</span>. Usually reachable somewhere in between, and
        generally quicker to reply to a good question than a good pitch.
      </p>
      </PageHeader>
    </Page>
  );
}
