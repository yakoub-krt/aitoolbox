import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await desktopContext.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3000" });
  const desktop = await desktopContext.newPage();
  await desktop.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const section = desktop.getByRole("heading", { name: "Prompts الأكثر شيوعاً" }).locator("xpath=ancestor::section[1]");
  await section.getByText("13 نسخ فعلي").waitFor();
  const titles = await section.locator("article h3").allTextContents();
  const expected = ["صورة منتج إلى فيديو إعلان", "Product Photo to Ad Video", "تحريك شخصية من صورة"];
  if (titles.join("|") !== expected.join("|")) throw new Error(`Unexpected real popularity order: ${titles.join("|")}`);
  await desktop.evaluate(() => sessionStorage.setItem("aitoolbox-prompt-copy-1", "1"));
  await section.getByRole("button", { name: "نسخ" }).first().click();
  await section.getByRole("button", { name: "تم النسخ" }).waitFor();
  const copiedText = await desktop.evaluate(() => navigator.clipboard.readText());
  if (!copiedText.includes("حوّل صورة المنتج")) throw new Error("Real popular prompt copy did not return the expected text.");
  await desktop.screenshot({ path: "/home/ubuntu/popular-prompts-real-desktop.png", fullPage: true });
  await desktopContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const mobileSection = mobile.getByRole("heading", { name: "Prompts الأكثر شيوعاً" }).locator("xpath=ancestor::section[1]");
  await mobileSection.getByText("13 نسخ فعلي").waitFor();
  await mobile.screenshot({ path: "/home/ubuntu/popular-prompts-real-mobile.png", fullPage: true });
  await mobileContext.close();

  console.log(JSON.stringify({ ranking: titles, directCopy: true, desktop: true, mobile: true, realData: true }));
} finally {
  await browser.close();
}
