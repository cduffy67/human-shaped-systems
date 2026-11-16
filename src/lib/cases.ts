export const METHOD_STEPS = [
  { id: "user-journey", title: "Start with the user journey", caseSlug: "enterprise-ai-adoption" },
  { id: "systems", title: "Map the systems", caseSlug: "workflow-systems-design" },
  { id: "trade-offs", title: "Expose the trade-offs", caseSlug: "slack-salesforce-architecture" },
  { id: "business-value", title: "Tie choices to business value", caseSlug: "value-led-transformation" },
  { id: "credible-version", title: "Build the smallest credible version", caseSlug: "complex-enterprise-sales" },
  { id: "extensible", title: "Make it extensible later", caseSlug: "slack-salesforce-architecture" },
] as const;

export const CASES = [
  { slug: "enterprise-ai-adoption", title: "Enterprise AI Adoption", tags: ["AI", "Adoption"] },
  { slug: "workflow-systems-design", title: "Workflow & Systems Design", tags: ["Workflows", "Systems"] },
  { slug: "slack-salesforce-architecture", title: "Slack + Salesforce Architecture", tags: ["Slack", "Salesforce", "Architecture"] },
  { slug: "value-led-transformation", title: "Value-led Transformation", tags: ["Business value", "Transformation"] },
  { slug: "complex-enterprise-sales", title: "Complex Enterprise Sales", tags: ["Enterprise", "Sales"] },
] as const;