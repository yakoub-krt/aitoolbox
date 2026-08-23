import { chromium } from "playwright-core";

const primaryLabels = ["دليل الأدوات", "Prompts", "المقارنة", "اختيار الأداة", "للطلاب"];
const discoveryLabels = ["الكتابة", "الصور", "الفيديو", "المقارنات", "الإنتاجية", "بدائل مجانية", "الأفضل", "محفوظاتي"];

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });

  const navigation = page.getByRole("navigation", { name: "التنقل الرئيسي" });
  for (const label of primaryLabels) await navigation.getByRole("link", { name: label }).waitFor();

  await page.getByRole("button", { name: "فتح قائمة الاستكشاف" }).click();
  for (const label of discoveryLabels) await page.getByText(label, { exact: true }).last().waitFor();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (overflow) throw new Error("Desktop navigation causes horizontal overflow.");

  await page.screenshot({ path: "/home/ubuntu/desktop-navigation-check.png", fullPage: false });
  console.log(JSON.stringify({ primaryLinks: primaryLabels.length, discoveryLinks: discoveryLabels.length, overflow }));
} finally {
  await browser.close();
}
