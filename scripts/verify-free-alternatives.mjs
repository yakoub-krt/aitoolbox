import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/free-alternatives", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /مواقع وبدائل مجانية/ }).waitFor();
  if (await page.locator("[data-alternative-id]").count() !== 8) throw new Error("Expected eight curated alternatives.");
  await page.getByRole("button", { name: "الصورة والتصميم" }).click();
  if (await page.locator("[data-alternative-id]").count() !== 3) throw new Error("Image filter did not return three results.");
  const search = page.getByRole("textbox", { name: "البحث في المواقع والبدائل المجانية" });
  await search.fill("Zotero");
  if (await page.locator("[data-alternative-id]").count() !== 0) throw new Error("Combined filters should show the empty state.");
  await page.getByRole("button", { name: "مسح البحث والفلاتر" }).click();
  await search.fill("مراجع");
  if (await page.locator("[data-alternative-id]").count() !== 1) throw new Error("Keyword search did not isolate Zotero.");
  const hrefs = await page.locator('a[target="_blank"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")));
  if (hrefs.length !== 1 || hrefs.some(href => !href?.startsWith("https://"))) throw new Error("Official external link validation failed.");
  await page.screenshot({ path: "/home/ubuntu/free-alternatives-browser-check.png", fullPage: true });
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000/free-alternatives", { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "الفيديو" }).click();
  await mobile.getByText("Kdenlive", { exact: true }).waitFor();
  if (await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)) throw new Error("Mobile page has horizontal overflow.");
  await mobileContext.close();
  console.log(JSON.stringify({ alternatives: 8, imageFilter: true, keywordSearch: true, externalLinks: true, mobile: true }));
} finally {
  await browser.close();
}
