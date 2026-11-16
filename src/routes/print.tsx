import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { BeatsInstant } from "@/components/beats";

import { Home } from "./index";
import { HowIWork } from "./how-i-work";
import { Journey } from "./journey";
import { BuildLog } from "./build-log";
import { CaseLibrary } from "./case-library";
import { Contact } from "./contact";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "Conor Duffy — Printable site (PDF export)" },
      {
        name: "description",
        content:
          "A single printable page containing every section of Conor Duffy's site: home, how I work, journey, build log, case library and contact.",
      },
      { property: "og:title", content: "Conor Duffy — Printable site" },
      {
        property: "og:description",
        content: "Every page of the site on one sheet, ready to save as a PDF.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrintPage,
});

const SECTIONS = [
  { label: "Home", Component: Home },
  { label: "How I Work", Component: HowIWork },
  { label: "Journey", Component: Journey },
  { label: "Build Log", Component: BuildLog },
  { label: "Case Library", Component: CaseLibrary },
  { label: "Contact", Component: Contact },
];

function PrintPage() {
  useEffect(() => {
    const id = window.setTimeout(() => window.print(), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="print-doc">
      <div className="no-print mx-auto w-full max-w-5xl px-5 pt-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-ink-soft">
            The whole site on one page. Your print dialog should open — choose{" "}
            <em>Save as PDF</em>.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Print again
          </button>
        </div>
      </div>

      <BeatsInstant>
      {SECTIONS.map(({ label, Component }) => (
        <section key={label} className="print-section">
          <Component />
        </section>
      ))}
      </BeatsInstant>
    </div>
  );
}
