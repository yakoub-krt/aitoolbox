import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "ماذا تريد أن تنجز اليوم؟" }).waitFor();
  const startLink = page.getByRole("link", { name: "ابدأ مجاناً" });
  const advisorLink = page.getByRole("link", { name: "اختر أداتك المناسبة" });
  const promptPathLink = page.getByRole("link", { name: "تصفح الـPrompts" }).first();
  if (await startLink.getAttribute("href") !== "/learning-plan") throw new Error("Landing primary CTA is not linked to the learning plan.");
  if (await advisorLink.getAttribute("href") !== "/advisor") throw new Error("Landing advisor CTA is not linked to the advisor.");
  if (await promptPathLink.getAttribute("href") !== "/prompts") throw new Error("Landing prompt path is not linked to the library.");
  await page.getByRole("heading", { name: "خطوات عملية، لا وعود مبالغ فيها" }).waitFor();
  await page.getByRole("heading", { name: "احفظ ما يناسبك وارجع إليه لاحقاً" }).waitFor();
  await page.getByRole("button", { name: "إنشاء حساب مجاني" }).waitFor();
  await page.screenshot({ path: "/home/ubuntu/landing-page-browser-check.png", fullPage: true });
  console.log(JSON.stringify({ hero: true, visitorPaths: true, trustSection: true, signupCallToAction: true }));
  await context.close();
} finally {
  await browser.close();
}
