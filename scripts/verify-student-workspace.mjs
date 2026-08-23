import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/student", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "مساحة الطالب: ذاكر بتركيز أكبر" }).waitFor();
  await page.getByLabel("موضوع المذاكرة").fill("قوانين نيوتن");
  await page.getByLabel("هدف الجلسة").fill("أشرح القانون الثاني بكلماتي");
  await page.getByText("حضّر هدفاً واحداً", { exact: true }).waitFor();
  await page.getByRole("button", { name: /ابدأ المؤقت/ }).click();
  await page.getByRole("button", { name: "إيقاف مؤقت", exact: true }).waitFor();
  await page.getByRole("button", { name: "إيقاف مؤقت", exact: true }).click();
  await page.locator('button[aria-pressed]').filter({ hasText: "أسئلة مراجعة" }).click();
  await page.getByText("تم فتح أسئلة مراجعة", { exact: true }).waitFor();
  await page.getByLabel("إجابة السؤال 1").fill("القوة تساوي الكتلة مضروبة في التسارع.");
  await page.getByText("كيف تراجع إجابتك؟", { exact: true }).first().click();
  await page.locator('button[aria-pressed]').filter({ hasText: "بسّط مفهوماً" }).click();
  await page.getByText("تم فتح بسّط مفهوماً", { exact: true }).waitFor();
  await page.getByText("Prompt للتبسيط والفحص", { exact: true }).waitFor();
  await page.locator('button[aria-pressed]').filter({ hasText: "بطاقات حفظ" }).click();
  await page.getByText("تم فتح بطاقات حفظ", { exact: true }).waitFor();
  await page.getByLabel("سؤال بطاقة جديدة").fill("ما المقصود بالقصور الذاتي؟");
  await page.getByLabel("إجابة بطاقة جديدة").fill("ميل الجسم للمحافظة على حالته الحركية.");
  await page.getByRole("button", { name: "إضافة البطاقة", exact: true }).click();
  await page.getByText("4 بطاقات", { exact: true }).waitFor();
  const learningPlanLink = page.getByRole("link", { name: "افتح خطة 7 أيام", exact: true });
  if (await learningPlanLink.getAttribute("href") !== "/learning-plan") throw new Error("Student workspace does not link to the learning plan.");
  await page.screenshot({ path: "/home/ubuntu/student-workspace-browser-check.png", fullPage: true });
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000/student", { waitUntil: "networkidle" });
  for (const title of ["خطة مذاكرة", "أسئلة مراجعة", "بسّط مفهوماً", "بطاقات حفظ"]) {
    await mobile.locator('button[aria-pressed]').filter({ hasText: title }).click();
    await mobile.getByText(`تم فتح ${title}`, { exact: true }).waitFor();
    const panel = mobile.locator("#student-tool-panel");
    await panel.scrollIntoViewIfNeeded();
    if (!await panel.isVisible()) throw new Error(`Student tool ${title} did not open visibly on mobile.`);
  }
  await mobileContext.close();
  console.log(JSON.stringify({ heading: true, studyPlanTimer: true, reviewAnswer: true, concept: true, customFlashcard: true, learningPlanLink: true, mobileToolOpening: true }));
} finally {
  await browser.close();
}
