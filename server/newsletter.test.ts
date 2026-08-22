import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  subscribeEmail: vi.fn(),
  unsubscribeByToken: vi.fn(),
  listSubscribers: vi.fn(),
  syncSubscriberToResend: vi.fn(),
  unsubscribeRemoteContact: vi.fn(),
}));

vi.mock("./blogDb", () => ({
  subscribeEmail: mocks.subscribeEmail,
  unsubscribeByToken: mocks.unsubscribeByToken,
  listSubscribers: mocks.listSubscribers,
}));
vi.mock("./resendService", () => ({
  syncSubscriberToResend: mocks.syncSubscriberToResend,
  unsubscribeRemoteContact: mocks.unsubscribeRemoteContact,
}));

import { newsletterRouter } from "./routers/newsletter";

const publicContext: TrpcContext = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] };

describe("الاشتراك في نشرة AIToolBox", () => {
  it("يتحقق من صحة البريد الإلكتروني قبل إنشاء اشتراك", async () => {
    const caller = newsletterRouter.createCaller(publicContext);
    await expect(caller.subscribe({ email: "ليس بريداً" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("يعيد استجابة عامة لا تكشف حالة البريد المسجل سابقاً", async () => {
    mocks.subscribeEmail.mockResolvedValue({ email: "reader@example.com", reactivated: true });
    mocks.syncSubscriberToResend.mockResolvedValue(undefined);
    const caller = newsletterRouter.createCaller(publicContext);

    await expect(caller.subscribe({ email: "reader@example.com" })).resolves.toEqual({ success: true });
    expect(mocks.subscribeEmail).toHaveBeenCalledWith("reader@example.com");
  });

  it("ينهي الاشتراك محلياً حتى عندما لا يتوافر اتصال البريد الخارجي", async () => {
    mocks.unsubscribeByToken.mockResolvedValue({ email: "reader@example.com" });
    mocks.unsubscribeRemoteContact.mockRejectedValue(new Error("mail offline"));
    const caller = newsletterRouter.createCaller(publicContext);

    await expect(caller.unsubscribe({ token: "a".repeat(64) })).resolves.toEqual({ success: true });
  });
});
