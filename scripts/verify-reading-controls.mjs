import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function verifyViewport(label, viewport) {
  const page = await browser.newPage({ viewport });
  try {
    await page.goto("http://127.0.0.1:3000/articles/ai-privacy-guide", { waitUntil: "networkidle" });
    await page.waitForSelector("#article-reading-surface");

    const initialProgress = await page.getByRole("progressbar", { name: "تقدّم القراءة" }).getAttribute("aria-valuenow");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight * 0.55, behavior: "instant" }));
    await page.waitForTimeout(150);

    const updatedProgress = await page.getByRole("progressbar", { name: "تقدّم القراءة" }).getAttribute("aria-valuenow");
    const returnButton = page.getByRole("button", { name: "العودة إلى أعلى المقال وجدول المحتويات" });
    const isReturnVisible = await returnButton.isVisible();

    if (Number(updatedProgress) <= Number(initialProgress)) throw new Error(`${label}: reading progress did not increase after scrolling.`);
    if (!isReturnVisible) throw new Error(`${label}: return-to-contents button did not appear after scrolling.`);
    await page.screenshot({ path: `/home/ubuntu/reading-controls-${label}.png` });

    await returnButton.click();
    await page.waitForTimeout(1000);
    const tocTop = await page.locator("#article-toc").evaluate((element) => Math.round(element.getBoundingClientRect().top));
    if (tocTop < 0 || tocTop > 150) throw new Error(`${label}: return button did not align the table of contents near the top (top: ${tocTop}).`);

    return { label, initialProgress, updatedProgress, isReturnVisible, tocTop };
  } finally {
    await page.close();
  }
}

try {
  const results = [];
  results.push(await verifyViewport("desktop", { width: 1280, height: 720 }));
  results.push(await verifyViewport("mobile", { width: 375, height: 812 }));
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
