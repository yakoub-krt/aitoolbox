import { chromium } from "playwright-core";

const popularPrompts = [
  { id: 701, title: "Prompt Alpha", category: "writing", description: "A high-use writing prompt for testing ranking order.", promptText: "Create an article outline about [topic].", copyCount: 13 },
  { id: 702, title: "Prompt Beta", category: "marketing", description: "A marketing prompt for validating the second rank.", promptText: "Write a concise social post about [topic].", copyCount: 7 },
  { id: 703, title: "Prompt Gamma", category: "image_to_video", description: "An image-to-video prompt for validating the third rank.", promptText: "Turn this product image into a vertical video.", copyCount: 2 },
];

async function createPage(viewport) {
  const context = await browser.newContext({ viewport });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3000" });
  const page = await context.newPage();
  await page.route("**/api/trpc/**", async route => {
    const url = new URL(route.request().url());
    if (!url.pathname.includes("prompts.popular")) return route.continue();
    const paths = url.pathname.split("/api/trpc/")[1].split(",");
    const data = paths.map(path => ({
      result: {
        data: {
          json: path === "prompts.popular" ? popularPrompts : path === "auth.me" ? null : [],
        },
      },
    }));
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(data) });
  });
  return { context, page };
}

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const desktop = await createPage({ width: 1280, height: 720 });
  await desktop.page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const popularSection = desktop.page.getByRole("heading", { name: "Prompts الأكثر شيوعاً" }).locator("xpath=ancestor::section[1]");
  await popularSection.getByText("13 نسخ فعلي").waitFor();
  const titles = await popularSection.locator("article h3").allTextContents();
  if (titles.join("|") !== "Prompt Alpha|Prompt Beta|Prompt Gamma") throw new Error(`Unexpected popular-prompt ranking: ${titles.join("|")}`);
  await desktop.page.evaluate(() => sessionStorage.setItem("aitoolbox-prompt-copy-701", "1"));
  await popularSection.getByRole("button", { name: "نسخ" }).first().click();
  await popularSection.getByRole("button", { name: "تم النسخ" }).waitFor();
  await desktop.page.getByRole("status", { name: "تم نسخ الـPrompt إلى الحافظة" }).waitFor();
  const copiedText = await desktop.page.evaluate(() => navigator.clipboard.readText());
  if (copiedText !== popularPrompts[0].promptText) throw new Error("Popular prompt direct copy did not write the expected text.");
  await desktop.page.screenshot({ path: "/home/ubuntu/popular-prompts-populated-desktop.png", fullPage: true });
  await desktop.context.close();

  const mobile = await createPage({ width: 375, height: 812 });
  await mobile.page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const mobileSection = mobile.page.getByRole("heading", { name: "Prompts الأكثر شيوعاً" }).locator("xpath=ancestor::section[1]");
  await mobileSection.getByText("13 نسخ فعلي").waitFor();
  await mobile.page.screenshot({ path: "/home/ubuntu/popular-prompts-populated-mobile.png", fullPage: true });
  await mobile.context.close();

  console.log(JSON.stringify({ ranking: titles, directCopy: true, desktop: true, mobile: true }));
} finally {
  await browser.close();
}
