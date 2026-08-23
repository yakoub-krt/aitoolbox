import { chromium } from "playwright-core";

const origin = "http://127.0.0.1:3000";
const routes = [
  "/", "/tools", "/prompts", "/prompt-customizer", "/learning-plan", "/student", "/student-directory", "/advisor", "/best-ai-tools", "/compare", "/search",
  "/about", "/contact", "/privacy", "/terms", "/affiliate-disclosure",
  "/sections/writing", "/sections/photos", "/sections/video", "/sections/comparisons", "/sections/productivity",
  "/articles/start-ai-project", "/articles/best-ai-tools-2026", "/articles/ai-writing-arabic", "/articles/chatgpt-gemini-claude-comparison", "/articles/ai-image-tools", "/articles/ai-pdf-summary-tools", "/articles/ai-tools-for-students", "/articles/ai-video-audio-tools", "/articles/ai-tools-for-freelancers", "/articles/ai-productivity-tools", "/articles/ai-privacy-guide",
];

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const failures = [];
const results = [];

try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", request => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "failed"}`));
    try {
      const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForTimeout(250);
      const snapshot = await page.evaluate(() => ({
        bodyLength: document.body.innerText.trim().length,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
        errorBoundary: document.body.innerText.includes("حدث خطأ غير متوقع"),
        notFound: document.body.innerText.includes("الصفحة غير موجودة"),
        brokenImages: Array.from(document.images).filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src),
      }));
      const issue = !response?.ok() || snapshot.bodyLength < 80 || snapshot.horizontalOverflow || snapshot.errorBoundary || snapshot.notFound || consoleErrors.length > 0 || failedRequests.length > 0 || snapshot.brokenImages.length > 0;
      const result = { route, status: response?.status() ?? 0, ...snapshot, consoleErrors, failedRequests };
      results.push(result);
      if (issue) failures.push(result);
    } catch (error) {
      const result = { route, status: 0, error: error instanceof Error ? error.message : String(error) };
      results.push(result);
      failures.push(result);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ checked: results.length, failures, passing: results.filter(result => !failures.includes(result)).length }, null, 2));
if (failures.length) process.exitCode = 1;
