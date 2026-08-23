import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  listPrompts: vi.fn(),
  createPrompt: vi.fn(),
  updatePrompt: vi.fn(),
  deletePrompt: vi.fn(),
}));

vi.mock("./promptDb", () => ({
  ...mocks,
  promptCategories: ["image_to_video", "image_generation", "image_editing", "short_video", "marketing", "writing"],
  promptLanguages: ["ar", "en"],
}));
import { promptsRouter } from "./routers/prompts";

const promptInput = { title: "صورة إلى فيديو", slug: "image-to-video-sample", category: "image_to_video" as const, language: "ar" as const, useCase: "فيديو منتج قصير", description: "Prompt عربي عملي لتحويل صورة منتج إلى فيديو قصير.", promptText: "حوّل صورة المنتج إلى فيديو مدته [6 ثوانٍ] مع حركة كاميرا ناعمة وإضاءة واقعية.", toolHint: "استخدمه مع أداة image-to-video.", isFree: true, isPublished: true, colorTone: "violet" as const, sortOrder: 10 };
const publicContext: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const adminContext: TrpcContext = { user: { id: 1, openId: "owner", name: "Owner", email: "owner@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };

describe("مكتبة Prompts", () => {
  it("يمرر فلتر اللغة والمجال إلى القائمة العامة", async () => {
    mocks.listPrompts.mockResolvedValue([]);
    const caller = promptsRouter.createCaller(publicContext);
    await expect(caller.list({ category: "image_to_video", language: "en" })).resolves.toEqual([]);
    expect(mocks.listPrompts).toHaveBeenCalledWith({ category: "image_to_video", language: "en" });
  });

  it("يمرر كلمة البحث إلى القائمة العامة مع الفلاتر", async () => {
    mocks.listPrompts.mockResolvedValue([]);
    const caller = promptsRouter.createCaller(publicContext);
    await expect(caller.list({ category: "writing", language: "ar", search: "مقال" })).resolves.toEqual([]);
    expect(mocks.listPrompts).toHaveBeenCalledWith({ category: "writing", language: "ar", search: "مقال" });
  });

  it("يمنع الزائر غير المسجل من إضافة Prompt", async () => {
    const caller = promptsRouter.createCaller(publicContext);
    await expect(caller.create(promptInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح للمشرف بإضافة Prompt صالح", async () => {
    mocks.createPrompt.mockResolvedValue(undefined);
    const caller = promptsRouter.createCaller(adminContext);
    await expect(caller.create(promptInput)).resolves.toEqual({ success: true });
    expect(mocks.createPrompt).toHaveBeenCalledWith(promptInput);
  });
});
