import { chromium } from "playwright-core";

const baseUrl = "https://3000-i8wbmgxzlbjzx6gixvu57-e385a87c.us4.manus.computer/learning-plan";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function verifyAtViewport(viewport, days) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const verified = [];

  for (const day of days) {
    const card = page.locator(`[data-learning-day="${day}"]`);
    if (day !== 1) await card.getByRole("button").first().click();
    await card.getByRole("heading", { name: "خطة التطبيق خطوة بخطوة" }).waitFor();
    const image = card.locator(`[data-learning-visual="${day}"]`);
    await image.scrollIntoViewIfNeeded();
    const metrics = await image.evaluate(async node => {
      const imageElement = node;
      if (!imageElement.complete) await new Promise(resolve => imageElement.addEventListener("load", resolve, { once: true }));
      return { src: imageElement.currentSrc, width: imageElement.naturalWidth, height: imageElement.naturalHeight };
    });
    if (!metrics.src.includes("/manus-storage/") || metrics.width <= 0 || metrics.height <= 0) throw new Error(`Day ${day} image did not load successfully.`);
    verified.push({ day, ...metrics });
  }

  await context.close();
  return verified;
}

try {
  const desktop = await verifyAtViewport({ width: 1280, height: 720 }, [1, 2, 3, 4, 5, 6, 7]);
  const mobile = await verifyAtViewport({ width: 390, height: 844 }, [3, 6, 7]);
  console.log(JSON.stringify({ desktop, mobile }));
} finally {
  await browser.close();
}
