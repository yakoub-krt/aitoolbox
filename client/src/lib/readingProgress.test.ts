import { describe, expect, it } from "vitest";
import { getArticleReadingProgress, shouldShowReturnToToc } from "./readingProgress";

describe("reading progress", () => {
  const article = { articleTop: 200, articleHeight: 1800, viewportHeight: 600 };

  it("يحسب تقدّم القراءة ضمن نطاق 0 إلى 100", () => {
    expect(getArticleReadingProgress({ ...article, scrollY: 0 })).toBe(0);
    expect(getArticleReadingProgress({ ...article, scrollY: 800 })).toBe(50);
    expect(getArticleReadingProgress({ ...article, scrollY: 2000 })).toBe(100);
  });

  it("يعرض زر العودة فقط بعد تجاوز بداية المقال بمسافة مناسبة", () => {
    expect(shouldShowReturnToToc(480, article.articleTop)).toBe(false);
    expect(shouldShowReturnToToc(481, article.articleTop)).toBe(true);
  });
});
