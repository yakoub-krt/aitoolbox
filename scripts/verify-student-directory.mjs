import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/student-directory", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "دليل الطلاب: أدوات حسب تخصصك" }).waitFor();
  const specializations = ["علوم وهندسة", "لغات وإنسانيات", "برمجة وحوسبة", "أعمال وتصميم"];
  for (const title of specializations) {
    await page.locator('button[aria-pressed]').filter({ hasText: title }).click();
    await page.getByText(`مسار ${title === "علوم وهندسة" ? "العلوم والهندسة" : title === "لغات وإنسانيات" ? "الآداب واللغات والعلوم الإنسانية" : title === "برمجة وحوسبة" ? "البرمجة وعلوم الحاسوب" : "الأعمال والتصميم والعروض"}`, { exact: true }).waitFor();
    const externalLinks = page.locator('a[target="_blank"]');
    if (await externalLinks.count() < 3) throw new Error(`Expected official tool links for ${title}.`);
    for (const href of await externalLinks.evaluateAll(nodes => nodes.map(node => node.getAttribute("href")))) if (!href?.startsWith("https://")) throw new Error(`Invalid official link: ${href}`);
  }
  const workspaceLink = page.locator('a[href="/student"]').first();
  if (await workspaceLink.getAttribute("href") !== "/student") throw new Error("Student workspace link is incorrect.");
  await page.screenshot({ path: "/home/ubuntu/student-directory-browser-check.png", fullPage: true });
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://127.0.0.1:3000/student-directory", { waitUntil: "networkidle" });
  await mobile.locator('button[aria-pressed]').filter({ hasText: "برمجة وحوسبة" }).click();
  await mobile.getByText("مسار البرمجة وعلوم الحاسوب", { exact: true }).waitFor();
  await mobileContext.close();
  console.log(JSON.stringify({ heading: true, specialties: 4, officialLinks: true, workspaceLink: true, mobile: true }));
} finally {
  await browser.close();
}
