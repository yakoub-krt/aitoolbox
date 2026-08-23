import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "ابدأ بما يجرّبه الزوار" }).waitFor();
  await page.getByText("انسخ أول Prompt يناسب مهمتك، وستظهر الاستخدامات الفعلية هنا عندما يبدأ الزوار بالتجربة.").waitFor();
  const libraryLink = page.getByRole("link", { name: "تصفح مكتبة Prompts" }).last();
  if (await libraryLink.getAttribute("href") !== "/prompts") throw new Error("Popular prompts empty state does not link to the library.");
  await page.screenshot({ path: "/home/ubuntu/popular-prompts-empty-check.png", fullPage: true });
  console.log(JSON.stringify({ popularHeading: true, factualEmptyState: true, libraryLink: true }));
} finally {
  await browser.close();
}
