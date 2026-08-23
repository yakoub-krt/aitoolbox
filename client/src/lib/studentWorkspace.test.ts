import { describe, expect, it } from "vitest";
import { buildConceptPrompt, buildFlashcards, buildReviewPrompt, buildStudyPlan } from "./studentWorkspace";

describe("student workspace", () => {
  it("ينشئ جلسة مذاكرة زمنية من أربع مراحل", () => {
    const plan = buildStudyPlan("قوانين نيوتن", 35);
    expect(plan).toHaveLength(4);
    expect(plan.map(step => step.time)).toEqual(["03 د", "10 د", "10 د", "8 د"]);
    expect(plan[0]?.detail).toContain("قوانين نيوتن");
  });

  it("يصنع Prompts تركز على الفهم والاسترجاع لا الواجب الجاهز", () => {
    expect(buildReviewPrompt("الانقسام الخلوي", "3 أسئلة شرح")).toContain("لا على تسليم واجب جاهز");
    expect(buildConceptPrompt("الخوارزمية", "مبتدئ")).toContain("مثال واقعي");
  });

  it("ينشئ ثلاث بطاقات حفظ مرتبطة بالموضوع", () => {
    const cards = buildFlashcards("الدوال");
    expect(cards).toHaveLength(3);
    expect(cards[0]?.question).toContain("الدوال");
  });
});
