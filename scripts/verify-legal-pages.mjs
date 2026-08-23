import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("http://127.0.0.1:3000/privacy", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "سياسة الخصوصية" }).waitFor();
  if (await page.getByText("الإعلانات وملفات تعريف الارتباط", { exact: true }).count() !== 1) throw new Error("Missing advertising and cookies disclosure.");
  if (await page.locator('a[href="https://www.google.com/settings/ads"]').count() !== 1) throw new Error("Missing Google Ads Settings link.");
  if (await page.locator('footer a[href="/terms"]').count() !== 1) throw new Error("Missing footer terms link.");
  await page.goto("http://127.0.0.1:3000/terms", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "شروط الاستخدام" }).waitFor();
  if (await page.getByText("استخدام الذكاء الاصطناعي", { exact: true }).count() !== 1) throw new Error("Missing responsible AI clause.");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto("http://127.0.0.1:3000/terms", { waitUntil: "networkidle" });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (overflow) throw new Error("Legal pages overflow on mobile.");
  console.log(JSON.stringify({ privacy: true, terms: true, footerNavigation: true, mobile: true }));
  await mobile.close();
  await page.close();
} finally {
  await browser.close();
}
