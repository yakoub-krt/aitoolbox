import { describe, expect, it } from "vitest";
import { buildCustomPrompt, defaultCustomizerValues } from "./promptCustomizer";

describe("prompt customizer", () => {
  it("ينشئ Prompt عربياً لفيديو المنتج بالقيم التي يختارها المستخدم", () => {
    const output = buildCustomPrompt("product_video", "ar", { ...defaultCustomizerValues, product: "عطر فاخر", format: "9:16" });
    expect(output).toContain("عطر فاخر");
    expect(output).toContain("9:16");
    expect(output).toContain("من دون نص داخل الفيديو");
  });

  it("ينشئ Prompt إنجليزياً لإعلان المنتج", () => {
    const output = buildCustomPrompt("product_ad", "en", { ...defaultCustomizerValues, product: "wireless headphones" });
    expect(output).toContain("wireless headphones");
    expect(output).toContain("negative space");
  });

  it("ينشئ سيناريو Reel ثنائي اللغة مع نبرة ودعوة قابلة للتغيير", () => {
    const output = buildCustomPrompt("educational_reel", "en", { ...defaultCustomizerValues, topic: "AI tool selection", tone: "friendly", callToAction: "Save this video" });
    expect(output).toContain("AI tool selection");
    expect(output).toContain("friendly");
    expect(output).toContain("Save this video");
  });
});
