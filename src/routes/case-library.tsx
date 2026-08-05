import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Page, PageHeader } from "@/components/site";

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

      <ol className="mt-14 max-w-3xl border-t border-border">
        {LOCKED.map((title, i) => (
          <li
            key={title}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-border py-5"
          >
            <span className="w-6 font-display text-sm text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-xl">{title}</span>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
              Locked
            </span>
          </li>
        ))}
      </ol>
    </Page>
  );
}
