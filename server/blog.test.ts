import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createArticle: vi.fn(),
  deleteArticle: vi.fn(),
  getPublishedArticleBySlug: vi.fn(),
  listAdminArticles: vi.fn(),
  listPublishedArticles: vi.fn(),
  listSections: vi.fn(),
  updateArticle: vi.fn(),
  createContactMessage: vi.fn(),
}));

vi.mock("./blogDb", () => mocks);

import { articleInputSchema } from "./routers/admin";
import { appRouter } from "./routers";

const articleInput = {
  title: "دليل تجريبي مفيد لأداة جديدة",
  slug: "sample-ai-guide",
  excerpt: "ملخص عربي كافٍ يشرح فكرة المقال التجريبي والقيمة العملية التي سيجدها القارئ.",
  content: "# عنوان\n\nهذا محتوى تجريبي طويل بما يكفي لاختبار التحقق من المقالات في نظام AIToolBox.",
  keywords: "أداة, ذكاء اصطناعي",
  sectionId: 1,
  coverTone: "violet" as const,
  isPublished: true,
  publishedAt: new Date("2026-08-22T12:00:00Z"),
  lastReviewedAt: new Date("2026-08-22T12:00:00Z"),
};

function contextFor(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("نظام مقالات AIToolBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("يرفض الرابط المختصر غير الآمن أو غير المتوافق", () => {
    expect(() => articleInputSchema.parse({ ...articleInput, slug: "رابط غير صالح" })).toThrow();
  });

  it("يسمح للمشرف بإنشاء مقال عبر الإجراء المحمي", async () => {
    mocks.createArticle.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(contextFor("admin"));

    await expect(caller.admin.createArticle(articleInput)).resolves.toEqual({ success: true });
    expect(mocks.createArticle).toHaveBeenCalledWith(articleInput);
  });

  it("يمنع المستخدم العادي من حذف مقال", async () => {
    const caller = appRouter.createCaller(contextFor("user"));

    await expect(caller.admin.deleteArticle({ id: 7 })).rejects.toBeInstanceOf(TRPCError);
    expect(mocks.deleteArticle).not.toHaveBeenCalled();
  });

  it("يمرر عبارة البحث إلى قائمة المقالات العامة", async () => {
    mocks.listPublishedArticles.mockResolvedValue([{ id: 1, title: "نتيجة اختبار" }]);
    const caller = appRouter.createCaller({ ...contextFor("user"), user: null });

    await expect(caller.blog.list({ query: "تلخيص PDF" })).resolves.toEqual([{ id: 1, title: "نتيجة اختبار" }]);
    expect(mocks.listPublishedArticles).toHaveBeenCalledWith({ query: "تلخيص PDF" });
  });
});
