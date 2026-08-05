import { createFileRoute } from "@tanstack/react-router";

import { Blob, Card, Page, PageHeader } from "@/components/site";

// Swap these placeholders for the real links.
const LINKS = [
  { label: "LinkedIn", value: "linkedin.com/in/your-handle", href: "#", icon: "in" },
  { label: "Email", value: "hello@example.com", href: "#", icon: "@" },
  { label: "GitHub", value: "github.com/your-handle", href: "#", icon: "{ }" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Conor Duffy" },
      {
        name: "description",
        content:
          "Get in touch about enterprise AI, solution architecture, Slack and Salesforce, career pivots, or coffee. Based in London and Ireland.",
      },
      { property: "og:title", content: "Contact — Conor Duffy" },
      {
        property: "og:description",
        content: "Always happy to chat about enterprise AI, architecture, or the odd good coffee.",
      },
    ],
  }),
  component: Contact;
});

function Contact() {
  return (
    <Page className="relative">
      <Blob className="pointer-events-none absolute -right-20 top-0 h-64 w-64 text-primary/10" />
      <PageHeader
        eyebrow="Say hello"
        title="Contact"
        intro="Always happy to chat about enterprise AI, solution architecture, Slack/Salesforce, career pivots, or the odd good coffee."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} className="block">
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
