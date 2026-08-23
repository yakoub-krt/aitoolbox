import { describe, expect, it } from "vitest";
import { parseSavedItems, toggleSavedItem } from "./savedItems";

const item = { kind: "tool" as const, id: 4, label: "Canva AI", href: "/tools" };

describe("العناصر المحفوظة محلياً", () => {
  it("يضيف العنصر ويحذفه عند الضغط مرة ثانية", () => {
    const added = toggleSavedItem([], item);
    expect(added).toEqual([item]);
    expect(toggleSavedItem(added, item)).toEqual([]);
  });

  it("يتعامل بأمان مع بيانات التخزين غير الصالحة", () => {
    expect(parseSavedItems("not-json")).toEqual([]);
    expect(parseSavedItems(JSON.stringify([item]))).toEqual([item]);
  });
});
