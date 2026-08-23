import { describe, expect, it } from "vitest";
import { countStudentTools, getStudentSpecialty, studentSpecialties } from "./studentDirectory";

describe("student directory", () => {
  it("يوفر أربعة تخصصات ولكل واحد أدوات مرتبطة به", () => {
    expect(studentSpecialties).toHaveLength(4);
    expect(studentSpecialties.every(specialty => specialty.tools.length >= 3)).toBe(true);
  });

  it("يحسب روابط الأدوات ويرجع المسار الصحيح", () => {
    expect(countStudentTools()).toBe(12);
    expect(getStudentSpecialty("computing")?.shortTitle).toContain("برمجة");
  });

  it("يستخدم روابط HTTPS رسمية لجميع الأدوات", () => {
    expect(studentSpecialties.flatMap(specialty => specialty.tools).every(tool => tool.url.startsWith("https://"))).toBe(true);
  });
});
