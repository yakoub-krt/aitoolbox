import { describe, expect, it, vi } from "vitest";
import { copyPromptText } from "./promptCopy";

describe("copyPromptText", () => {
  it("ينسخ نص الـPrompt كاملاً دون تعديل", async () => {
    const writer = vi.fn().mockResolvedValue(undefined);
    const prompt = "Transform [product] into a vertical ad video.";

    await copyPromptText(prompt, writer);

    expect(writer).toHaveBeenCalledWith(prompt);
  });
});
