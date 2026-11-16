import { describe, expect, test } from "bun:test";
import { CASES, METHOD_STEPS } from "./cases";

describe("provisional case/step navigation", () => {
  test("all six steps point to an existing case page", () => {
    expect(METHOD_STEPS).toHaveLength(6);
    for (const step of METHOD_STEPS) expect(CASES.some((study) => study.slug === step.caseSlug)).toBe(true);
  });
  test("every placeholder case has a step backlink", () => {
    expect(CASES).toHaveLength(5);
    for (const study of CASES) expect(METHOD_STEPS.some((step) => step.caseSlug === study.slug)).toBe(true);
    expect(new Set(METHOD_STEPS.map((step) => step.id)).size).toBe(6);
  });
});