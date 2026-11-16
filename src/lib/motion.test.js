import { describe, expect, it } from "vitest";
import { planSection, MAX_SECTION_MS } from "./motion";

describe("section timing", () => {
  it("never exceeds the 2000ms section budget", () => {
    const p = planSection({ opener: "journey", heading: "Enterprise problems, human-shaped solutions.", lines: 12, mode: "engine" });
    expect(p.total).toBe(MAX_SECTION_MS);
    expect(p.lastLine * p.scale + 400).toBeLessThanOrEqual(MAX_SECTION_MS + 0.001);
  });
  it("types the engine opener at 45ms a character before a 200ms gap", () => {
    const p = planSection({ opener: "hero", heading: "Hi", lines: 1, mode: "engine" });
    expect(p.headStart).toBe("$ whoami".length * 45 + 200);
  });
  it("types the boardroom eyebrow at 45ms a character too", () => {
    const p = planSection({ opener: "exploring", heading: "Hi", lines: 1, mode: "boardroom" });
    expect(p.headStart).toBe("ON MY DESK".length * 45 + 200);
  });
  it("staggers content lines 110ms apart when within budget", () => {
    const p = planSection({ lines: 3, mode: "boardroom" });
    expect(p.lastLine).toBe(220);
    expect(p.scale).toBe(1);
  });
});
