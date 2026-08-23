import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const menuButton = page.getByRole("button", { name: "فتح قائمة التنقل" });
  await menuButton.click();
  const mobileNav = page.locator('nav[aria-label="التنقل على الهاتف"]');
  await mobileNav.waitFor();
  if (await mobileNav.locator("a").count() !== 13) throw new Error("The mobile navigation does not expose all public routes.");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (overflow) throw new Error("The mobile navigation causes horizontal page overflow.");
  await mobileNav.locator('a[href="/student-directory"]').click();
  await page.waitForURL("**/student-directory");
  if (await page.getByRole("heading", { name: /دليل الطلاب/ }).count() < 1) throw new Error("The mobile menu route did not open correctly.");
  console.log(JSON.stringify({ menu: true, links: 13, overflow: false, routeNavigation: true }));
} finally {
  await browser.close();
}
