import { describe, expect, it } from "vitest";
import { calculateLearningProgress, learningPlanDays, normalizeCompletedDays, toggleCompletedDay } from "./learningPlan";

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

  it("يجعل كل الأيام السبعة دروساً عملية موسعة", () => {
    expect(learningPlanDays).toHaveLength(7);
    const visualUrls = new Set<string>();
    for (const day of learningPlanDays) {
      expect(day.steps).toHaveLength(4);
      expect(day.duration).toMatch(/(35|40|45) دقيقة/);
      expect(day.promptExample.length).toBeGreaterThan(80);
      expect(day.pitfalls).toHaveLength(3);
      expect(day.deliverable.length).toBeGreaterThan(25);
      expect(day.imageUrl).toContain("/manus-storage/");
      visualUrls.add(day.imageUrl);
    }
    expect(visualUrls).toHaveLength(7);
  });
});
