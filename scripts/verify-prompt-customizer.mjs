import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3000" });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/prompt-customizer", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "تسجيل مجاني" }).waitFor();

  await page.getByRole("button", { name: "English" }).click();
  await page.locator("label").filter({ hasText: "المنتج أو العنصر" }).locator("input").fill("smart watch");
  const videoOutput = await page.locator("pre").innerText();
  if (!videoOutput.includes("smart watch") || !videoOutput.includes("Transform")) throw new Error("English product-video prompt did not update.");

  await page.getByRole("button", { name: "صورة إعلان لمنتج" }).click();
  const adOutput = await page.locator("pre").innerText();
  if (!adOutput.includes("premium commercial image")) throw new Error("Product-ad template did not render in English.");

  await page.getByRole("button", { name: "سيناريو Reel تعليمي" }).click();
  await page.locator("label").filter({ hasText: "الموضوع" }).locator("input").fill("AI productivity");
  const reelOutput = await page.locator("pre").innerText();
  if (!reelOutput.includes("AI productivity") || !reelOutput.includes("educational Reel script")) throw new Error("Educational Reel template did not update.");

  await page.getByRole("button", { name: "مقال متكامل" }).click();
  await page.locator("label").filter({ hasText: "الموضوع" }).locator("input").fill("AI writing workflow");
  const articleOutput = await page.locator("pre").innerText();
  if (!articleOutput.includes("AI writing workflow") || !articleOutput.includes("practical")) throw new Error("Article template did not update.");

  await page.getByRole("button", { name: "منشور تواصل اجتماعي" }).click();
  await page.locator("label").filter({ hasText: "المنصة" }).locator("input").fill("LinkedIn");
  const socialOutput = await page.locator("pre").innerText();
  if (!socialOutput.includes("LinkedIn post")) throw new Error("Social-post template did not update.");

  await page.getByRole("button", { name: "نسخ الـPrompt" }).click();
  await page.getByRole("button", { name: "تم النسخ" }).waitFor();
  await page.getByRole("status", { name: "تم نسخ الـPrompt بنجاح" }).waitFor();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  if (clipboardText !== socialOutput) throw new Error("Customizer output was not copied to the clipboard.");

  await page.screenshot({ path: "/home/ubuntu/prompt-customizer-browser-check.png", fullPage: true });
  console.log(JSON.stringify({ productVideo: true, productAd: true, educationalReel: true, article: true, socialPost: true, signupCallout: true, copiedLength: clipboardText.length }));
  await context.close();
} finally {
  await browser.close();
}
