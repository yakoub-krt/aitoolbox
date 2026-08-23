import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/articles/start-ai-project", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "كيف تبدأ مشروعاً باستخدام الذكاء الاصطناعي: من فكرة صغيرة إلى تجربة حقيقية" }).waitFor();
  const image = page.locator("article img").first();
  const imageSources = await page.locator("article img").evaluateAll(nodes => nodes.map(node => node.getAttribute("src")));
  if (await image.count() !== 1) throw new Error(`The article educational image is missing. Found: ${JSON.stringify(imageSources)}`);
  if (!(await image.getAttribute("src"))?.includes("start-ai-project-hero_f180def9.png")) throw new Error("The article renders an unexpected educational image.");
  if (await page.locator(".article-prose h2").count() < 8) throw new Error("The article does not contain enough sections.");
  for (const href of ["/advisor", "/learning-plan", "/prompt-customizer"]) {
    if (await page.locator(`.article-project-links a[href="${href}"]`).count() < 1) throw new Error(`Missing internal article link: ${href}`);
  }
  await page.screenshot({ path: "/home/ubuntu/start-ai-project-browser-check.png", fullPage: true });
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000/articles/start-ai-project", { waitUntil: "networkidle" });
  await mobile.locator("article img").scrollIntoViewIfNeeded();
  if (!await mobile.locator("article img").isVisible()) throw new Error("The article image is not visible on mobile.");
  await mobileContext.close();
  console.log(JSON.stringify({ title: true, image: true, headings: true, internalLinks: true, mobile: true }));
} finally {
  await browser.close();
}
