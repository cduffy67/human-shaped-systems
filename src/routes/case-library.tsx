import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card, Page, PageHeader } from "@/components/site";
import stage from "@/assets/stage.png.asset.json";

const LOCKED = [
  "Enterprise AI Adoption",
  "Slack + Salesforce Architecture",
  "Value-led Transformation",
  "Workflow and Systems Design",
];

export const Route = createFileRoute("/case-library")({
  head: () => ({
    meta: [
      { title: "Case Library — Conor Duffy" },
      {
        name: "description",
        content:
          "Selected case studies on enterprise AI adoption, Slack and Salesforce architecture, and value-led solution design — available privately.",
      },
      { property: "og:title", content: "Case Library — Conor Duffy" },
      {
        property: "og:description",
        content: "Private write-ups on enterprise AI adoption and value-led solution design.",
      },
    ],
  }),
  component: CaseLibrary,
});

function CaseLibrary() {
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(false);

  return (
    <Page>
      <PageHeader
        eyebrow="Behind the curtain"
        title="Case Library"
        intro="Selected case studies are available privately. This area will eventually hold more detailed write-ups on enterprise AI adoption, Slack/Salesforce architecture, value-led solution design and customer transformation work."
      />

      <figure className="mt-10 overflow-hidden rounded-2xl border border-border">
        <img
          src={stage.url}
          alt="Conor presenting on stage at a Salesforce event"
          loading="lazy"
          className="h-32 w-full object-cover sm:h-40"
        />
        <figcaption className="bg-card px-4 py-2 text-xs text-muted-foreground">
          Some of the work ends up on a stage. Most of it doesn't.
        </figcaption>
      </figure>

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
          Not wired up yet — drop me a note and I'll share what's relevant.
        </p>
      ) : null}

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Some examples involve commercially sensitive work, so the public version stays deliberately
        high-level.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {LOCKED.map((title) => (
          <Card key={title} className="bg-secondary/50">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg">{title}</h2>
              <span aria-hidden="true" className="text-accent">
                🔒
              </span>
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
