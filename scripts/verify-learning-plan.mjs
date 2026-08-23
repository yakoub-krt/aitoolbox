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
  await page.getByRole("button", { name: "Prompt واضحاً" }).click();
  const promptsLink = page.getByRole("link", { name: "مكتبة Prompts", exact: true });
  if (await promptsLink.getAttribute("href") !== "/prompts") throw new Error("Learning day resources do not link to the prompt library.");
  await page.getByRole("button", { name: "إعادة ضبط التقدّم" }).click();
  await page.getByText("0%", { exact: true }).waitFor();
  const home = await context.newPage();
  await home.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const planLink = home.getByRole("link", { name: "خطة تعلم 7 أيام" });
  if (await planLink.getAttribute("href") !== "/learning-plan") throw new Error("Homepage does not link to the learning plan.");
  await home.close();
  await page.screenshot({ path: "/home/ubuntu/learning-plan-browser-check.png", fullPage: true });
  console.log(JSON.stringify({ dayCompletion: true, localProgressPersistence: true, resources: true, reset: true, homepageLink: true }));
  await context.close();
} finally {
  await browser.close();
}
