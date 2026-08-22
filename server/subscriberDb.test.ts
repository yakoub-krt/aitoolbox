import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getDb: vi.fn() }));
vi.mock("./db", () => ({ getDb: mocks.getDb }));

import { subscribeEmail } from "./blogDb";

function databaseWithExisting(existing: unknown[]) {
  const limit = vi.fn().mockResolvedValue(existing);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  const select = vi.fn().mockReturnValue({ from });
  const insertValues = vi.fn().mockResolvedValue(undefined);
  const insert = vi.fn().mockReturnValue({ values: insertValues });
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
  const update = vi.fn().mockReturnValue({ set: updateSet });
  return { db: { select, insert, update }, insertValues, updateSet };
}

describe("حفظ اشتراكات البريد", () => {
  beforeEach(() => vi.clearAllMocks());

  it("يطبع البريد ويخزنه كمشترك جديد", async () => {
    const fake = databaseWithExisting([]);
    mocks.getDb.mockResolvedValue(fake.db as never);

    await expect(subscribeEmail(" Reader@Example.com ")).resolves.toMatchObject({ email: "reader@example.com", reactivated: false });
    expect(fake.insertValues).toHaveBeenCalledWith(expect.objectContaining({ email: "reader@example.com", status: "subscribed" }));
  });

  it("يعيد تفعيل بريد ألغى الاشتراك من دون إنشاء سجل مكرر", async () => {
    const fake = databaseWithExisting([{ id: 8, status: "unsubscribed" }]);
    mocks.getDb.mockResolvedValue(fake.db as never);

    await expect(subscribeEmail("reader@example.com")).resolves.toMatchObject({ reactivated: true });
    expect(fake.insertValues).not.toHaveBeenCalled();
    expect(fake.updateSet).toHaveBeenCalledWith(expect.objectContaining({ status: "subscribed", unsubscribedAt: null }));
  });
});
