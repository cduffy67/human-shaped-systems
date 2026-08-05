import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card, Page, PageHeader } from "@/components/site";

const LOCKED = [
  "Enterprise AI Adoption",
  "Workflow & Systems Design",
  "Slack + Salesforce Architecture",
  "Value-led Transformation",
  "Complex Enterprise Sales",
];

export const Route = createFileRoute("/case-library")({
  head: () => ({
    meta: [
      { title: "Case Library — Conor Duffy" },
      {
        name: "description",
        content:
          "Selected case studies on enterprise AI adoption, workflow design, Slack and Salesforce architecture, and value-led transformation — shared privately.",
      },
      { property: "og:title", content: "Case Library — Conor Duffy" },
      {
        property: "og:description",
        content: "Private write-ups on enterprise AI adoption and value-led solution design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://human-shaped-systems.lovable.app/case-library" }],
  }),
  component: CaseLibrary,
});

export function CaseLibrary() {
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(false);

  return (
    <Page>
      <PageHeader
        eyebrow="Available privately"
        title="Case Library"
        intro="High-level themes here, detail on request. Most of this work involves other people's names and numbers, so it stays behind a door."
      />

      <form
        className="mt-12 flex max-w-md flex-wrap items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(true);
        }}
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="case-password"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
          >
            Password
          </label>
          <input
            id="case-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full border-b border-border bg-transparent pb-2 text-base outline-none transition-colors focus:border-accent"
          />
        </div>
        <button
          type="submit"
          className="quiet-link relative pb-2 font-display text-base text-accent"
        >
          Unlock →
        </button>
      </form>

      {notice ? (
        <p className="mt-4 text-sm text-accent">
          Shared by request — send me a note and I will pass on whatever is relevant.
        </p>
      ) : null}

      <p className="mt-10 max-w-2xl leading-relaxed text-muted-foreground">
        Some of this work is commercially sensitive, so the public version stays deliberately
        high-level. No customer names, no numbers, no internal detail.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {LOCKED.map((title, i) => (
          <Card key={title} className="relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <span className="font-display text-sm text-accent/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                <path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl leading-snug">{title}</h2>
            <p className="mt-2 select-none text-sm leading-relaxed text-ink-soft blur-[3px]">
              Context, approach and outcome — written up properly, shared on request.
            </p>
            <span className="mt-5 inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Locked
            </span>
          </Card>
        ))}
      </div>

    </Page>
  );
}
