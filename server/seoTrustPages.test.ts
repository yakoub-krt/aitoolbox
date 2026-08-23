import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("trust pages and SEO metadata", () => {
  it("provides transparent ownership and safe communication guidance", () => {
    const page = readFileSync(new URL("../client/src/pages/StaticPage.tsx", import.meta.url), "utf8");

    expect(page).toContain("Yakoub Kartouche");
    expect(page).toContain("منهجنا التحريري");
    expect(page).toContain("كيف نتعامل مع رسالتك؟");
    expect(page).toContain("لا ترسل كلمات مرور");
  });

  it("sets route-aware Arabic titles, descriptions, keywords, canonical URLs, and noindex for private routes", () => {
    const seo = readFileSync(new URL("../client/src/components/SeoMeta.tsx", import.meta.url), "utf8");

    expect(seo).toContain('"/about"');
    expect(seo).toContain('"/contact"');
    expect(seo).toContain('setMeta("description", entry.description)');
    expect(seo).toContain('setMeta("keywords", entry.keywords)');
    expect(seo).toContain('canonical.rel = "canonical"');
    expect(seo).toContain('"noindex, nofollow"');
  });
});
