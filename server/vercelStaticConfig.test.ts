import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Vercel static site configuration", () => {
  it("builds the Vite client output and rewrites public SPA routes to index.html", () => {
    const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

    expect(config.framework).toBe("vite");
    expect(config.buildCommand).toBe("pnpm run build:vercel");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.rewrites).toContainEqual({
      source: "/api/trpc/(.*)",
      destination: "https://aitoolbox-qe3ypjf9.manus.space/api/trpc/$1",
    });
    expect(config.rewrites).toContainEqual({
      source: "/manus-storage/(.*)",
      destination: "https://aitoolbox-qe3ypjf9.manus.space/manus-storage/$1",
    });
    expect(config.rewrites).toContainEqual({ source: "/(.*)", destination: "/index.html" });
  });
});
