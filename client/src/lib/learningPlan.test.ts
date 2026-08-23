import { describe, expect, it } from "vitest";
import { calculateLearningProgress, normalizeCompletedDays, toggleCompletedDay } from "./learningPlan";

describe("learning plan progress", () => {
  it("ينظف أيام التقدم ويحافظ على الأيام الصحيحة فقط", () => {
    expect(normalizeCompletedDays([3, 1, 3, 0, 9, "2"])).toEqual([1, 3]);
  });

  it("يبدل إكمال اليوم دون تكرار", () => {
    expect(toggleCompletedDay([1, 2], 3)).toEqual([1, 2, 3]);
    expect(toggleCompletedDay([1, 2], 2)).toEqual([1]);
  });

  it("يحسب النسبة المئوية من الأيام السبعة", () => {
    expect(calculateLearningProgress([1, 2, 3, 4])).toBe(57);
    expect(calculateLearningProgress([1, 2, 3, 4, 5, 6, 7])).toBe(100);
  });
});
