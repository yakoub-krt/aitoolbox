import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createArticle: vi.fn(),
  deleteArticle: vi.fn(),
  getArticleForNewsletter: vi.fn(),
  getArticlePublicationStatus: vi.fn(),
  listAdminArticles: vi.fn(),
  updateArticle: vi.fn(),
  sendArticleNewsletter: vi.fn(),
}));

vi.mock("./blogDb", () => ({
  createArticle: mocks.createArticle,
  deleteArticle: mocks.deleteArticle,
  getArticleForNewsletter: mocks.getArticleForNewsletter,
  getArticlePublicationStatus: mocks.getArticlePublicationStatus,
  listAdminArticles: mocks.listAdminArticles,
  updateArticle: mocks.updateArticle,
}));
vi.mock("./resendService", () => ({ sendArticleNewsletter: mocks.sendArticleNewsletter }));

import { adminRouter } from "./routers/admin";

const adminContext: TrpcContext = { user: { id: 1, openId: "owner", name: "Owner", email: "owner@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", get: () => "aitoolbox.example" } as TrpcContext["req"], res: {} as TrpcContext["res"] };
const input = { title: "مقال منشور جديد", slug: "published-newsletter-test", excerpt: "ملخص كافٍ لاختبار إرسال التحديث عند نشر المقال الجديد.", content: "# محتوى\n\nهذا نص اختبار مطول للتحقق من سير عمل النشرة الإلكترونية عند نشر مقال جديد عبر لوحة إدارة AIToolBox، مع الالتزام بحد المحتوى المطلوب في قواعد التحقق.", keywords: "ذكاء اصطناعي, أدوات", sectionId: null, coverTone: "violet" as const, isPublished: true, publishedAt: new Date(), lastReviewedAt: new Date() };

describe("إرسال النشرة عند النشر", () => {
  it("يرسل تحديثاً إلى المشتركين عند إنشاء مقال منشور", async () => {
    mocks.createArticle.mockResolvedValue(undefined);
    mocks.getArticleForNewsletter.mockResolvedValue({ id: 7, title: input.title, slug: input.slug, excerpt: input.excerpt, publishedAt: new Date(), newsletterSentAt: null });
    mocks.sendArticleNewsletter.mockResolvedValue({ sent: true, reason: "delivered", recipientCount: 3 });
    const caller = adminRouter.createCaller(adminContext);

    await expect(caller.createArticle(input)).resolves.toMatchObject({ success: true, newsletter: { sent: true, recipientCount: 3 } });
    expect(mocks.sendArticleNewsletter).toHaveBeenCalledWith(expect.objectContaining({ slug: input.slug }), "https://aitoolbox.example");
  });
});
