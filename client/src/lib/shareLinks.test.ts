import { describe, expect, it, vi } from "vitest";
import { copyShareLink, createShareLinks } from "./shareLinks";

describe("createShareLinks", () => {
  it("ينشئ روابط مشاركة مرمزة للعناوين العربية", () => {
    const links = createShareLinks("أفضل أدوات الذكاء الاصطناعي", "https://aitoolbox.example/articles/ai-tools");

    expect(links.x).toContain("https://x.com/intent/post?");
    expect(links.x).toContain(encodeURIComponent("أفضل أدوات الذكاء الاصطناعي"));
    expect(links.facebook).toBe("https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faitoolbox.example%2Farticles%2Fai-tools");
    expect(links.linkedin).toContain("linkedin.com/sharing/share-offsite");
    expect(links.whatsapp).toContain(encodeURIComponent("أفضل أدوات الذكاء الاصطناعي https://aitoolbox.example/articles/ai-tools"));
  });

  it("ينسخ رابط المقال ويتيح لواجهة المستخدم عرض نجاح العملية", async () => {
    const writer = vi.fn().mockResolvedValue(undefined);
    const url = "https://aitoolbox.example/articles/ai-tools";

    await expect(copyShareLink(url, writer)).resolves.toBeUndefined();
    expect(writer).toHaveBeenCalledWith(url);
  });
});
