import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const content = readFileSync(resolve(process.cwd(), "content/start-ai-project.md"), "utf8");

describe("دليل بدء مشروع بالذكاء الاصطناعي", () => {
  it("يحافظ على طول المقال المطلوب وصورته التعليمية", () => {
    expect(content.length).toBeGreaterThanOrEqual(8_000);
    expect(content.length).toBeLessThanOrEqual(10_000);
    expect(content).toContain("/manus-storage/start-ai-project-hero_f180def9.png");
  });

  it("يتضمن هيكلاً عملياً ومراجع وروابط AIToolBox الداخلية", () => {
    expect((content.match(/^## /gm) ?? []).length).toBeGreaterThanOrEqual(8);
    expect(content).toContain("/advisor");
    expect(content).toContain("/learning-plan");
    expect(content).toContain("[1]: https://www.ycombinator.com/");
    expect(content).toContain("[3]: https://www.nist.gov/");
  });
});
