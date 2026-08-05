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
        className="mt-10 flex max-w-md flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(true);
        }}
      >
        <label htmlFor="case-password" className="sr-only">
          Password
        </label>
        <input
          id="case-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Unlock
        </button>
      </form>
      {notice ? (
        <p className="mt-3 text-sm text-accent">
          Shared by request for now — drop me a note and I'll send what's relevant.
        </p>
      ) : null}

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Some of this work is commercially sensitive, so the public version stays deliberately
        high-level. No customer names, no numbers, no internal detail.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LOCKED.map((title) => (
          <Card key={title} className="bg-secondary/50">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg">{title}</h2>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 flex-none text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <rect x="4" y="10" width="16" height="10" rx="2.5" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>
            <div className="mt-3 space-y-2" aria-hidden="true">
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-4/5 rounded-full bg-muted" />
              <div className="h-2 w-2/3 rounded-full bg-muted" />
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Locked</p>
          </Card>
        ))}
      </div>
    </Page>
  );
}
