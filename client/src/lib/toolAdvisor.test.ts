import { describe, expect, it } from "vitest";
import { recommendTools } from "./toolAdvisor";

const tools = [
  { id: 1, name: "Writer", slug: "writer", category: "writing" as const, priceModel: "freemium" as const, arabicSupport: "yes" as const, bestFor: "الكتابة", shortDescription: "", websiteUrl: "https://example.com" },
  { id: 2, name: "Image", slug: "image", category: "images" as const, priceModel: "paid" as const, arabicSupport: "unknown" as const, bestFor: "الصور", shortDescription: "", websiteUrl: "https://example.com" },
];

describe("مستشار اختيار الأداة", () => {
  it("يعطي أولوية للأداة المطابقة للهدف والميزانية ودعم العربية", () => {
    const results = recommendTools(tools, { goal: "writing", budget: "free", arabic: "required" });
    expect(results[0]?.tool.slug).toBe("writer");
    expect(results[0]?.reasons).toContain("يناسب الهدف الذي اخترته");
  });
});
