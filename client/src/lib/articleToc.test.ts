import { createHeadingAnchor, getArticleHeadings, getHeadingIdAtPosition } from "./articleToc";
import { describe, expect, it } from "vitest";

describe("article table of contents", () => {
  it("ينشئ روابط ثابتة للعناوين العربية مع إزالة التشكيل وعلامات الترقيم", () => {
    expect(createHeadingAnchor("كيف تختار أداةً آمنة؟")).toBe("كيف-تختار-اداة-امنة");
    expect(createHeadingAnchor("ChatGPT & Gemini: البداية")).toBe("chatgpt-gemini-البداية");
  });

  it("يستخرج عناوين المستوى الثاني والثالث مع معرفات فريدة", () => {
    const content = `# عنوان المقال
## البداية السريعة
نص تمهيدي.
### خطوة أولى
## البداية السريعة
#### لا يظهر هذا العنوان`;

    expect(getArticleHeadings(content)).toEqual([
      { id: "البداية-السريعة", text: "البداية السريعة", level: 2 },
      { id: "خطوة-اولى", text: "خطوة أولى", level: 3 },
      { id: "البداية-السريعة-2", text: "البداية السريعة", level: 2 },
    ]);
  });

  it("ينظف صياغة Markdown البسيطة من نص العنوان المعروض", () => {
    expect(getArticleHeadings("## **دليل** [الأدوات](/tools)")).toEqual([
      { id: "دليل-الادوات", text: "دليل الأدوات", level: 2 },
    ]);
  });

  it("يربط العناوين المكررة بالمعرف الفريد المقابل لترتيب ظهورها", () => {
    const headings = getArticleHeadings("## خطوات العمل\n### خطوة أولى\n## خطوات العمل");

    expect(getHeadingIdAtPosition(headings, "خطوات العمل", 0)).toBe("خطوات-العمل");
    expect(getHeadingIdAtPosition(headings, "خطوات العمل", 1)).toBe("خطوات-العمل-2");
  });
});
