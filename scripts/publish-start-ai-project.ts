import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { getDb } from "../server/db";
import { articles } from "../drizzle/schema";

const slug = "start-ai-project";
const content = await readFile(new URL("../content/start-ai-project.md", import.meta.url), "utf8");
const readingTime = Math.max(3, Math.ceil(content.trim().split(/\s+/).length / 190));
const values = {
  title: "كيف تبدأ مشروعاً باستخدام الذكاء الاصطناعي: من فكرة صغيرة إلى تجربة حقيقية",
  slug,
  excerpt: "دليل عملي طويل يحول الفكرة العامة إلى مشكلة واضحة، ومنتج أولي صغير، وتجربة مبنية على ملاحظات مستخدمين حقيقيين — مع استخدام واعٍ للذكاء الاصطناعي.",
  content,
  keywords: "مشروع بالذكاء الاصطناعي,منتج أولي,MVP,أفكار مشاريع,ريادة أعمال,اختبار فكرة,أدوات الذكاء الاصطناعي",
  sectionId: 5,
  coverTone: "cyan",
  readingTime,
  isPublished: true,
  publishedAt: new Date(),
  lastReviewedAt: new Date(),
};
const db = await getDb();
if (!db) throw new Error("Database is not available.");
const existing = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug)).limit(1);
if (existing[0]) await db.update(articles).set(values).where(eq(articles.id, existing[0].id));
else await db.insert(articles).values(values);
console.log(JSON.stringify({ slug, action: existing[0] ? "updated" : "created", characters: content.length, readingTime }));
