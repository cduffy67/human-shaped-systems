import type { SiteMode } from "./mode";

type Pair = Record<SiteMode, string>;

export const CONTENT = {
  hero: {
    label: { boardroom: "Conor Duffy · London / Ireland", engine: "~/conor-duffy $ whoami" } as Pair,
    headline: {
      boardroom: "Enterprise problems,|human-shaped|solutions.",
      engine: "Messy systems,|clean|interfaces.",
    } as Pair,
    sub: {
      boardroom:
        "I help leadership teams turn AI ambition into something their people actually use, buy and trust, with a clear line from the first workshop to the business case.",
      engine:
        "I map what already exists (data, APIs, permissions, the bits held together with cron jobs) then build the smallest version that survives contact with production.",
    } as Pair,
  },
  strengths: [
    {
      title: { boardroom: "Value-led solutions", engine: "Outcome-first scoping" },
      body: {
        boardroom: "Start from the outcome someone will pay for, then work backwards to the build.",
        engine: "Define the success metric before the schema. If we can't measure it, we don't build it yet.",
      },
    },
    {
      title: { boardroom: "Ambiguity to execution", engine: "Spec from chaos" },
      body: {
        boardroom: "Turn a half-formed ambition into a plan a team can start this week.",
        engine: "Turn a vague ask into a ticketable spec: inputs, outputs, edge cases, owners.",
      },
    },
    {
      title: { boardroom: "Two rooms, one story", engine: "Same story, more detail" },
      body: {
        boardroom: "Board-level framing, with nothing lost in translation to the build team.",
        engine: "The narrative the board heard, plus the parts they skipped. No slideware.",
      },
    },
    {
      title: { boardroom: "Pragmatic architecture", engine: "Boring architecture, on purpose" },
      body: {
        boardroom: "Enough structure to scale, not so much that it slows you down.",
        engine: "Events where it matters, plain APIs where it doesn't. Every seam documented so it can change later.",
      },
    },
    {
      title: { boardroom: "Commercially grounded", engine: "Cost-aware by default" },
      body: {
        boardroom: "As a chartered accountant (CGMA), I'll build the business case alongside the solution.",
        engine: "Chartered accountant (CGMA). Token spend, licence tiers, latency budgets: I'll price the design before you fall in love with it.",
      },
    },
  ] as { title: Pair; body: Pair }[],
  method: [
    {
      boardroom: "Who's affected, and what is the current way costing us?",
      engine: "Trace one real workflow end to end. Where does it break, and what do the logs say?",
    },
    {
      boardroom: "What we already own, who owns it, and where the risk sits.",
      engine: "Systems of record, auth model, data residency, rate limits, and which bits are held together with hope.",
    },
    {
      boardroom: "Every option has a price: time, flexibility, spend. You'll see it up front.",
      engine: "Build vs buy vs configure. Latency vs accuracy. Agent vs deterministic flow. Written down early.",
    },
    {
      boardroom: "If it doesn't move a number you care about, it doesn't make the cut.",
      engine: "Every component maps to a metric, so nothing ships just because it was fun to build.",
    },
    {
      boardroom: "A working solution that makes the value obvious.",
      engine: "A working slice against real data and the hardest edge case. No happy-path demos.",
    },
    {
      boardroom: "Built so your team can own it after we've gone.",
      engine: "Clear seams, typed interfaces, a README a stranger can follow. No séance required.",
    },
  ] as Pair[],
};

/** "01" in boardroom, "01 //" in engine room. */
export function sectionNo(n: number, mode: SiteMode) {
  const s = String(n).padStart(2, "0");
  return mode === "engine" ? `${s} //` : s;
}
