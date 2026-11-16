import { createFileRoute } from "@tanstack/react-router";

import type { ReactNode } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { siGithub } from "simple-icons";

import { Page, PageHeader } from "@/components/site";

// LinkedIn isn't in simple-icons any more, so its mark is inlined here.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

function BrandMark({ path }: { path: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current">
      <path d={path} />
    </svg>
  );
}

type ContactLink = { label: string; value: string; href: string; icon: ReactNode };

const LINKS: ContactLink[] = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/conor-duffy",
    href: "https://www.linkedin.com/in/conor-duffy/",
    icon: <BrandMark path={LINKEDIN_PATH} />,
  },
  {
    label: "Email",
    value: "conor_duffy@me.com",
    href: "mailto:conor_duffy@me.com",
    icon: <Mail aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />,
  },
  {
    label: "GitHub",
    value: "github.com/cduffy67",
    href: "https://github.com/cduffy67",
    icon: <BrandMark path={siGithub.path} />,
  },
];

const ICON_CHIP =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors duration-300";

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

      <ul className="mt-14 max-w-2xl border-t border-border">
        {LINKS.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label} className="beat border-b border-border">
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                aria-label={`${link.label}: ${link.value}${external ? " (opens in a new tab)" : ""}`}
                className="group flex items-center gap-5 py-5 outline-none transition-transform duration-300 hover:translate-x-1 focus-visible:translate-x-1 motion-reduce:transform-none"
              >
                <span
                  className={`${ICON_CHIP} group-hover:border-accent group-hover:text-accent group-focus-visible:border-accent group-focus-visible:text-accent`}
                >
                  {link.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {link.label}
                  </span>
                  <span className="no-slash mt-1 block truncate font-display text-lg text-foreground">
                    {link.value}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.75}
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-focus-visible:text-accent"
                />
              </a>
            </li>
          );
        })}
        <li className="beat flex items-center gap-5 border-b border-border py-5">
          <span className={ICON_CHIP}>
            <MapPin aria-hidden className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Location
            </span>
            <span className="no-slash mt-1 block font-display text-lg text-foreground">London / Ireland</span>
          </span>
        </li>
      </ul>

      <p className="beat mt-10 max-w-2xl leading-relaxed text-ink-soft">
        Based in <span className="font-medium">London</span>, from{" "}
        <span className="font-medium">Ireland</span>. Usually reachable somewhere in between, and
        generally quicker to reply to a good question than a good pitch.
      </p>
      </PageHeader>
    </Page>
  );
}
