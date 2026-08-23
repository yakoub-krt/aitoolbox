import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("tool directory skeleton loading", () => {
  it("renders a semantic six-card loading state using the shared Skeleton component", () => {
    const page = readFileSync(new URL("../client/src/pages/ToolsDirectoryPage.tsx", import.meta.url), "utf8");
    const skeleton = readFileSync(new URL("../client/src/components/ToolCardSkeleton.tsx", import.meta.url), "utf8");

    expect(page).toContain('role="status" aria-live="polite"');
    expect(page).toContain("جاري تحميل الأدوات");
    expect(page).toContain("Array.from({ length: 6 })");
    expect(page).toContain("<ToolCardSkeleton key={index} />");
    expect(skeleton).toContain('import { Skeleton } from "@/components/ui/skeleton"');
    expect(skeleton).toContain('aria-hidden="true"');
  });
});
