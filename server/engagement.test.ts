import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  listToolFaqs: vi.fn(), createToolFaq: vi.fn(), updateToolFaq: vi.fn(), deleteToolFaq: vi.fn(),
  createSuggestion: vi.fn(), listSuggestions: vi.fn(), updateSuggestionStatus: vi.fn(),
  saveItem: vi.fn(), unsaveItem: vi.fn(), listSavedItems: vi.fn(),
}));
vi.mock("./engagementDb", () => mocks);
import { engagementRouter } from "./routers/engagement";

const publicContext: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const userContext: TrpcContext = { user: { id: 5, openId: "reader", name: "Reader", email: "reader@example.com", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const adminContext: TrpcContext = { ...userContext, user: { ...userContext.user!, role: "admin" } };

describe("تفاعل زوار AIToolBox", () => {
  it("يعرض الأسئلة الشائعة العامة للأداة", async () => {
    mocks.listToolFaqs.mockResolvedValue([{ id: 1, question: "سؤال", answer: "إجابة" }]);
    const caller = engagementRouter.createCaller(publicContext);
    await expect(caller.toolFaqs({ toolId: 1 })).resolves.toHaveLength(1);
    expect(mocks.listToolFaqs).toHaveBeenCalledWith(1);
  });

  it("يتحقق من الاقتراح قبل حفظه", async () => {
    const caller = engagementRouter.createCaller(publicContext);
    await expect(caller.submitSuggestion({ title: "قصير", details: "قصير", category: "tool" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("يستقبل اقتراحاً صالحاً من زائر دون كشف بيانات شخصية", async () => {
    mocks.createSuggestion.mockResolvedValue(undefined);
    const caller = engagementRouter.createCaller(publicContext);
    await expect(caller.submitSuggestion({ title: "مقارنة أدوات الكتابة", details: "أرغب في فهم الفروق العملية بين أدوات الكتابة العربية.", category: "comparison" })).resolves.toEqual({ success: true });
  });

  it("يمنع الحفظ المرتبط بالحساب من الزائر غير المسجل", async () => {
    const caller = engagementRouter.createCaller(publicContext);
    await expect(caller.save({ kind: "tool", id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("يحفظ الأداة ضمن حساب المستخدم المسجل", async () => {
    mocks.saveItem.mockResolvedValue(undefined);
    const caller = engagementRouter.createCaller(userContext);
    await expect(caller.save({ kind: "tool", id: 1 })).resolves.toEqual({ success: true });
    expect(mocks.saveItem).toHaveBeenCalledWith(5, { kind: "tool", id: 1 });
  });

  it("يقصر تعديل الأسئلة الشائعة على المشرف", async () => {
    mocks.createToolFaq.mockResolvedValue(undefined);
    const caller = engagementRouter.createCaller(adminContext);
    await expect(caller.adminCreateFaq({ toolId: 1, question: "هل يمكن استخدام الأداة بالعربية؟", answer: "راجع الناتج النهائي وتحقق من المعلومات قبل النشر.", sortOrder: 0 })).resolves.toEqual({ success: true });
  });
});
