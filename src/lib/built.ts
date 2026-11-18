/** Side projects shown on Work, with a compact teaser on Home. */
export const BUILT = [
  {
    slug: "fx-deal-desk",
    name: "FX Deal Desk Assistant",
    tagline: "A morning's client FX emails in. A policy-ordered queue with safe replies out.",
    oneLiner: "Client FX inbox triage for relationship managers at a fictional bank, with policy guardrails the model can't override.",
    body: [
      "Clients send FX requests as messy emails, and someone retypes them one by one. Here a relationship manager pastes their inbox: AI turns each email into a ticket and flags what's missing, the bank's policy (not the AI) sets each ticket's priority and who reviews it, and every client gets a holding reply that's checked in code so it never promises a firm price or leaks internal detail.",
      "Two eval suites run against the live model (12 test deals and 6 client emails, three runs each, including prompt-injection attempts), plus a deterministic queue-ordering test. Email extraction passed 99 of 99 field checks, replies and policy explanations pass 35 of 36 runs, and the queue lands 7 of 7 tickets in the right order.",
    ],
    finding:
      "The evals caught a regression I'd otherwise have shipped. Telling the model not to name internal teams in customer emails leaked into its internal analysis too, and its replies started promising firm quotes. The score dropped to 13 of 36 until a scoped prompt fixed it, and the runtime guardrail meant no user ever saw a bad reply.",
    stack: ["LLM extraction + drafting", "Rules engine", "Eval: 18 cases × 3 runs", "Lovable"],
    links: [
      { label: "Try it", href: "https://fx-deal-genius.lovable.app" },
      { label: "Code on GitHub", href: "https://github.com/cduffy67/fx-deal-genius" },
    ],
  },
  {
    slug: "bag-chancer",
    name: "Bag Chancer",
    tagline: "Will your bag make it through the gate?",
    oneLiner: "AI cabin bag checker for Ireland–UK flights, with a 5-model eval against real bag dimensions.",
    body: [
      "A playful cabin bag checker with a serious core. Snap a photo and pick your airline: a vision model estimates the bag's size, then ordinary code applies Ryanair, Aer Lingus, easyJet and BA cabin rules for a traffic-light verdict.",
      "I built an eval that runs product photos of 21 bags with published dimensions through 5 models (Gemini, Claude, GPT). It measures size error, and whether the app gives the same pass/fail answer it would with the real dimensions.",
    ],
    finding:
      "The most accurate model didn't make the best decisions, and without anything in the photo for scale, cheaper models confused 80 cm hold cases with cabin bags.",
    stack: ["Vision models", "Rules engine", "Eval: 5 models × 21 bags", "Lovable"],
    links: [
      { label: "Try it", href: "https://bag-chancer-ai.lovable.app" },
      { label: "Code on GitHub", href: "https://github.com/cduffy67/bag-chancer" },
    ],
  },
] as const;
