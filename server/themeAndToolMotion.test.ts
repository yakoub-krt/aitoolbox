import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("theme switch and tool-card motion", () => {
  it("enables a persistent switchable theme provider", () => {
    const app = readFileSync(new URL("../client/src/App.tsx", import.meta.url), "utf8");
    const context = readFileSync(new URL("../client/src/contexts/ThemeContext.tsx", import.meta.url), "utf8");

    expect(app).toContain('<ThemeProvider defaultTheme="dark" switchable>');
    expect(context).toContain("root.dataset.theme = theme");
    expect(context).toContain('localStorage.setItem("theme", theme)');
  });

  it("adds a labeled header control and reduced-motion-safe tool-card interaction", () => {
    const shell = readFileSync(new URL("../client/src/components/BlogShell.tsx", import.meta.url), "utf8");
    const css = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");
    const directory = readFileSync(new URL("../client/src/pages/ToolsDirectoryPage.tsx", import.meta.url), "utf8");

    expect(shell).toContain("تفعيل الوضع النهاري");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).toContain(".tool-card:hover");
    expect(directory).toContain("tool-card relative");
  });
});
