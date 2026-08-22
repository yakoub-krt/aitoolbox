import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  listTools: vi.fn(),
  listToolsBySlugs: vi.fn(),
  createTool: vi.fn(),
  updateTool: vi.fn(),
  deleteTool: vi.fn(),
}));

vi.mock("./toolDb", () => mocks);
import { toolsRouter } from "./routers/tools";

const toolInput = { name: "أداة تجريبية", slug: "sample-tool", category: "writing" as const, priceModel: "freemium" as const, arabicSupport: "unknown" as const, websiteUrl: "https://example.com", shortDescription: "وصف واقعي مختصر للأداة التجريبية لاختبار دليل الأدوات.", bestFor: "صياغة مسودات أولية وتنظيم الأفكار.", editorialNotes: "ينبغي مراجعة النتيجة والتحقق من المعلومات المهمة.", limitations: "قد تختلف المزايا حسب الخطة وتغيرات مزود الخدمة.", colorTone: "violet" as const, isFeatured: false };
const publicContext: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };
const adminContext: TrpcContext = { user: { id: 1, openId: "owner", name: "Owner", email: "owner@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };

describe("دليل الأدوات", () => {
  it("يمرر فلاتر المجال والتسعير إلى قائمة الأدوات العامة", async () => {
    mocks.listTools.mockResolvedValue([]);
    const caller = toolsRouter.createCaller(publicContext);
    await expect(caller.list({ category: "writing", priceModel: "freemium" })).resolves.toEqual([]);
    expect(mocks.listTools).toHaveBeenCalledWith({ category: "writing", priceModel: "freemium" });
  });

  it("يمنع الزائر غير المسجل من إضافة أداة", async () => {
    const caller = toolsRouter.createCaller(publicContext);
    await expect(caller.create(toolInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("يسمح للمشرف بإضافة أداة ذات رابط صالح", async () => {
    mocks.createTool.mockResolvedValue(undefined);
    const caller = toolsRouter.createCaller(adminContext);
    await expect(caller.create(toolInput)).resolves.toEqual({ success: true });
    expect(mocks.createTool).toHaveBeenCalledWith(toolInput);
  });
});
