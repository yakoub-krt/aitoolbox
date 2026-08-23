import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("homepage entrance motion", () => {
  it("adds staggered hero entrance classes while respecting reduced-motion settings", () => {
    const home = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");
    const css = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

    expect(home).toContain("entry-reveal entry-reveal-scale entry-delay-2");
    expect(home).toContain("hero-glow");
    expect(home).toContain("entry-delay-${index + 1}");
    expect(css).toContain("@keyframes entrance-reveal");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("hero-glow-drift");
  });
});
