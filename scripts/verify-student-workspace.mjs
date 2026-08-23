import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/student", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "مساحة الطالب: ذاكر بتركيز أكبر" }).waitFor();
  await page.getByLabel("موضوع المذاكرة").fill("قوانين نيوتن");
  await page.getByText("حضّر هدفاً واحداً", { exact: true }).waitFor();
  await page.getByRole("button", { name: /أسئلة مراجعة/ }).click();
  await page.getByText("قوانين نيوتن", { exact: false }).last().waitFor();
  await page.getByRole("button", { name: /بسّط مفهوماً/ }).click();
  await page.getByText("Prompt للتبسيط والفحص", { exact: true }).waitFor();
  await page.getByRole("button", { name: /بطاقات حفظ/ }).click();
  await page.getByText("بطاقة 01", { exact: true }).waitFor();
  const learningPlanLink = page.getByRole("link", { name: "افتح خطة 7 أيام", exact: true });
  if (await learningPlanLink.getAttribute("href") !== "/learning-plan") throw new Error("Student workspace does not link to the learning plan.");
  await page.screenshot({ path: "/home/ubuntu/student-workspace-browser-check.png", fullPage: true });
  console.log(JSON.stringify({ heading: true, studyPlan: true, review: true, concept: true, flashcards: true, learningPlanLink: true }));
  await context.close();
} finally {
  await browser.close();
}
