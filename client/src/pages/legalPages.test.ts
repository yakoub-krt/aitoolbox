import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const staticPageSource = readFileSync(resolve(process.cwd(), "client/src/pages/StaticPage.tsx"), "utf8");
const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");

describe("صفحات الخصوصية وشروط الاستخدام", () => {
  it("تتضمن إفصاحاً واضحاً عن Google والكوكيز وخيارات التحكم", () => {
    expect(staticPageSource).toContain("الإعلانات وملفات تعريف الارتباط");
    expect(staticPageSource).toContain("إعدادات إعلانات Google");
    expect(staticPageSource).toContain("المنطقة الاقتصادية الأوروبية");
  });

  it("يضيف شروط الاستخدام إلى المسارات العامة", () => {
    expect(staticPageSource).toContain('"/terms"');
    expect(staticPageSource).toContain("شروط الاستخدام");
    expect(appSource).toContain('path="/terms"');
  });
});
