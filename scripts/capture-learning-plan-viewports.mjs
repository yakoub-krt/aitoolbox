import { chromium } from "playwright-core";

const baseUrl = "https://3000-i8wbmgxzlbjzx6gixvu57-e385a87c.us4.manus.computer/learning-plan";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function capture(viewport, day, fileName) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (day !== 1) await page.locator(`[data-learning-day="${day}"]`).getByRole("button").first().click();
  await page.locator(`[data-learning-day="${day}"]`).getByRole("heading", { name: "خطة التطبيق خطوة بخطوة" }).waitFor();
  const visual = page.locator(`[data-learning-day="${day}"] [data-learning-visual="${day}"]`);
  await visual.scrollIntoViewIfNeeded();
  await page.waitForFunction(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0, await visual.elementHandle());
  await page.screenshot({ path: `/home/ubuntu/${fileName}`, fullPage: true });
  await context.close();
}

try {
  await capture({ width: 1280, height: 720 }, 6, "learning-plan-day-6-desktop.png");
  await capture({ width: 390, height: 844 }, 1, "learning-plan-day-1-mobile.png");
  await capture({ width: 390, height: 844 }, 7, "learning-plan-day-7-mobile.png");
  console.log("Captured desktop day 6 and mobile days 1 and 7.");
} finally {
  await browser.close();
}
