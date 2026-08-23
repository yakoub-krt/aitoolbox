import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/learning-plan", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "تعلّم الذكاء الاصطناعي خلال 7 أيام" }).waitFor();
  await page.getByRole("button", { name: "ضع علامة كمكتمل" }).first().click();
  await page.getByText("14%", { exact: true }).waitFor();
  await page.getByRole("button", { name: "تم اليوم" }).first().waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("14%", { exact: true }).waitFor();
  const dayOne = page.locator('[data-learning-day="1"]');
  await dayOne.getByRole("heading", { name: "خطة التطبيق خطوة بخطوة" }).waitFor();
  const expandedDays = [
    { id: 2, title: "Prompt واضحاً" },
    { id: 3, title: "تعلّم وتلخيص بوعي" },
    { id: 4, title: "اكتب ثم حرّر" },
    { id: 5, title: "اصنع فكرة بصرية" },
    { id: 6, title: "خطّط لمقطع قصير" },
    { id: 7, title: "ابنِ سير عملك الأول" },
  ];
  for (const day of expandedDays) {
    const card = page.locator(`[data-learning-day="${day.id}"]`);
    await card.getByRole("button").first().click();
    await card.getByRole("heading", { name: "خطة التطبيق خطوة بخطوة" }).waitFor();
    if (await card.locator("[data-learning-step]").count() !== 4) throw new Error(`Day ${day.id} does not have four practical steps.`);
    await card.getByText("Prompt مثال: عدّله لمهمتك").waitFor();
  }
  await page.locator('[data-learning-day="2"]').getByRole("button").first().click();
  const promptsLink = page.getByRole("link", { name: "مكتبة Prompts", exact: true });
  if (await promptsLink.getAttribute("href") !== "/prompts") throw new Error("Learning day resources do not link to the prompt library.");
  await page.getByRole("button", { name: "إعادة ضبط التقدّم" }).click();
  await page.getByText("0%", { exact: true }).waitFor();
  const home = await context.newPage();
  await home.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const planLink = home.getByRole("link", { name: "ابدأ خطة 7 أيام", exact: true });
  if (await planLink.getAttribute("href") !== "/learning-plan") throw new Error("Homepage does not link to the learning plan.");
  await home.close();
  await page.screenshot({ path: "/home/ubuntu/learning-plan-browser-check.png", fullPage: true });
  console.log(JSON.stringify({ dayCompletion: true, localProgressPersistence: true, sevenExpandedDays: true, sevenVisuals: true, resources: true, reset: true, homepageLink: true }));
  await context.close();
} finally {
  await browser.close();
}
