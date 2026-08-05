import { createFileRoute } from "@tanstack/react-router";

import { Blob, Card, Page, PageHeader } from "@/components/site";

const LINKS = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/conor-duffy",
    href: "https://www.linkedin.com/in/conor-duffy/",
    icon: "in",
  },
  { label: "Email", value: "conor_duffy@me.com", href: "mailto:conor_duffy@me.com", icon: "@" },
  // Swap in the real handle when there's something worth showing.
  { label: "GitHub", value: "coming soon", href: "#", icon: "{ }" },
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

function Contact() {
  return (
    <Page className="relative">
      <Blob className="pointer-events-none absolute -right-20 top-0 h-64 w-64 text-primary/10" />
      <PageHeader
        eyebrow="Say hello"
        title="Contact"
        intro="Always happy to chat about enterprise AI, systems thinking, solution architecture, or the odd good coffee."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            className="block"
          >
            <Card>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm text-accent">
                {link.icon}
              </span>
              <h2 className="mt-3 text-lg">{link.label}</h2>
              <p className="mt-1 break-words text-sm text-muted-foreground">{link.value}</p>
            </Card>
          </a>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        Based in <strong className="font-semibold">London</strong>, from{" "}
        <strong className="font-semibold">Ireland</strong>. Usually reachable somewhere in between.
      </p>
    </Page>
  );
}
