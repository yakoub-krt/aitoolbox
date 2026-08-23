import { describe, expect, it } from "vitest";
import { filterFreeAlternatives, freeAlternatives, freeAlternativeCategories, getFreeAlternativeCategoryLabel } from "./freeAlternatives";

describe("free alternatives directory", () => {
  it("يعرض بدائل منتقاة بروابط HTTPS رسمية", () => {
    expect(freeAlternatives).toHaveLength(8);
    expect(freeAlternatives.every(item => item.url.startsWith("https://"))).toBe(true);
    expect(new Set(freeAlternatives.map(item => item.id)).size).toBe(freeAlternatives.length);
  });

  it("يفلتر حسب المهمة وبالاسم أو الوصف أو الكلمات المفتاحية", () => {
    expect(filterFreeAlternatives("image", "").map(item => item.name)).toEqual(["Photopea", "GIMP", "Inkscape"]);
    expect(filterFreeAlternatives("", "مراجع").map(item => item.name)).toEqual(["Zotero"]);
    expect(filterFreeAlternatives("video", "مونتاج").map(item => item.name)).toEqual(["Kdenlive"]);
  });

  it("يوفر تسميات عربية لكل فئة", () => {
    expect(freeAlternativeCategories).toHaveLength(6);
    expect(getFreeAlternativeCategoryLabel("planning")).toBe("التخطيط والرسم");
  });
});
