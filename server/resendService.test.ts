import { describe, expect, it } from "vitest";
import { buildNewsletterEmail } from "./resendService";

describe("رسالة تحديث المقال", () => {
  it("تنشئ رسالة فردية تتضمن رابط المقال ورابط إلغاء اشتراك مميزاً", () => {
    const message = buildNewsletterEmail(
      { id: 12, title: "دليل أدوات الكتابة", slug: "writing-tools", excerpt: "شرح عملي لاختيار أداة كتابة عربية.", publishedAt: new Date(), newsletterSentAt: null },
      { id: 4, email: "reader@example.com", unsubscribeToken: "u".repeat(64) },
      "https://aitoolbox.example",
    );

    expect(message.subject).toContain("دليل أدوات الكتابة");
    expect(message.html).toContain("https://aitoolbox.example/articles/writing-tools");
    expect(message.html).toContain(`/unsubscribe/${"u".repeat(64)}`);
    expect(message.text).toContain("إلغاء الاشتراك");
  });
});
