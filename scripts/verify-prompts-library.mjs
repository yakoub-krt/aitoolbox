import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3000" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/prompts", { waitUntil: "networkidle" });
  await page.waitForSelector("article");

  const allPrompts = await page.locator("article").count();
  await page.getByRole("button", { name: "English" }).click();
  await page.waitForFunction(() => document.querySelectorAll("article").length === 10);
  const englishPrompts = await page.locator("article").count();
  if (allPrompts < 20) throw new Error(`Expected at least 20 free prompts, found ${allPrompts}.`);
  if (englishPrompts !== 10) throw new Error(`Expected 10 English prompts, found ${englishPrompts}.`);

  await page.getByRole("button", { name: "نسخ الـPrompt" }).first().click();
  await page.getByRole("button", { name: "تم النسخ" }).first().waitFor();
  await page.getByRole("status", { name: "تم نسخ الـPrompt إلى الحافظة" }).waitFor();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  if (!clipboardText.includes("Transform")) throw new Error("Copied prompt text was not written to the clipboard.");

  await page.screenshot({ path: "/home/ubuntu/prompts-library-browser-check.png" });
  console.log(JSON.stringify({ allPrompts, englishPrompts, clipboardLength: clipboardText.length }));
  await context.close();
} finally {
  await browser.close();
}
