import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public layout spacing", () => {
  it("keeps readable responsive side padding for all shared containers", () => {
    const css = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

    expect(css).toContain(".container { box-sizing: border-box; padding-inline: clamp(1.25rem, 4vw, 4rem); }");
    expect(css).toContain("@media (max-width: 640px) { .container { padding-inline: 1rem;");
  });

  it("uses a more compact shared header and footer", () => {
    const shell = readFileSync(new URL("../client/src/components/BlogShell.tsx", import.meta.url), "utf8");

    expect(shell).toContain('h-[4.5rem]');
    expect(shell).toContain('footer className="mt-16');
  });
});
