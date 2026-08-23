import { describe, expect, it } from "vitest";
import { discoveryNavigationItems, primaryNavigationItems, publicNavigationItems } from "./siteNavigation";

describe("public site navigation", () => {
  it("keeps every public route reachable through one desktop navigation group", () => {
    const combinedPaths = [...primaryNavigationItems, ...discoveryNavigationItems].map(item => item.path);
    expect(combinedPaths).toHaveLength(publicNavigationItems.length);
    expect(new Set(combinedPaths).size).toBe(publicNavigationItems.length);
    expect(new Set(combinedPaths)).toEqual(new Set(publicNavigationItems.map(item => item.path)));
  });

  it("keeps the most task-oriented routes in the compact desktop navigation", () => {
    expect(primaryNavigationItems.map(item => item.path)).toEqual([
      "/tools",
      "/prompts",
      "/compare",
      "/advisor",
      "/student-directory",
    ]);
  });
});
