import { randomBytes } from "node:crypto";
import { and, desc, eq, like, ne, or } from "drizzle-orm";
import { articles, contactMessages, sections, subscribers } from "../drizzle/schema";
import { getDb } from "./db";

const articleSelection = {
  id: articles.id,
  title: articles.title,
  slug: articles.slug,
  excerpt: articles.excerpt,
  content: articles.content,
  keywords: articles.keywords,
  sectionId: articles.sectionId,
  coverTone: articles.coverTone,
  readingTime: articles.readingTime,
  isPublished: articles.isPublished,
  publishedAt: articles.publishedAt,
  lastReviewedAt: articles.lastReviewedAt,
  newsletterSentAt: articles.newsletterSentAt,
  createdAt: articles.createdAt,
  updatedAt: articles.updatedAt,
  sectionName: sections.name,
  sectionSlug: sections.slug,
};

type ListArticlesInput = { sectionSlug?: string; query?: string; limit?: number };

export async function listSections() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sections).orderBy(sections.sortOrder, sections.name);
}

export async function listPublishedArticles(input: ListArticlesInput = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(articles.isPublished, true)];
  if (input.sectionSlug) conditions.push(eq(sections.slug, input.sectionSlug));
  if (input.query?.trim()) {
    const term = `%${input.query.trim()}%`;
    const searchCondition = or(like(articles.title, term), like(articles.excerpt, term), like(articles.keywords, term));
    if (searchCondition) conditions.push(searchCondition);
  }
  return db.select(articleSelection).from(articles).leftJoin(sections, eq(articles.sectionId, sections.id)).where(and(...conditions)).orderBy(desc(articles.publishedAt)).limit(input.limit ?? 24);
}

export async function getPublishedArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select(articleSelection).from(articles).leftJoin(sections, eq(articles.sectionId, sections.id)).where(and(eq(articles.slug, slug), eq(articles.isPublished, true))).limit(1);
  const article = rows[0];
  if (!article) return null;
  const related = article.sectionId ? await db.select(articleSelection).from(articles).leftJoin(sections, eq(articles.sectionId, sections.id)).where(and(eq(articles.isPublished, true), eq(articles.sectionId, article.sectionId), ne(articles.id, article.id))).orderBy(desc(articles.publishedAt)).limit(3) : [];
  return { article, related };
}

export async function listAdminArticles() {
  const db = await getDb();
  if (!db) return [];
  return db.select(articleSelection).from(articles).leftJoin(sections, eq(articles.sectionId, sections.id)).orderBy(desc(articles.updatedAt));
}

export type ArticleWriteInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string;
  sectionId: number | null;
  coverTone: string;
  isPublished: boolean;
  publishedAt: Date;
  lastReviewedAt: Date | null;
};

function estimateReadingTime(content: string) { return Math.max(3, Math.ceil(content.trim().split(/\s+/).length / 190)); }

export async function createArticle(input: ArticleWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.insert(articles).values({ ...input, readingTime: estimateReadingTime(input.content) });
}

export async function updateArticle(id: number, input: ArticleWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(articles).set({ ...input, readingTime: estimateReadingTime(input.content) }).where(eq(articles.id, id));
}

export async function getArticlePublicationStatus(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select({ id: articles.id, isPublished: articles.isPublished }).from(articles).where(eq(articles.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getArticleForNewsletter(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select({ id: articles.id, title: articles.title, slug: articles.slug, excerpt: articles.excerpt, publishedAt: articles.publishedAt, newsletterSentAt: articles.newsletterSentAt }).from(articles).where(and(eq(articles.slug, slug), eq(articles.isPublished, true))).limit(1);
  return rows[0] ?? null;
}

export async function markNewsletterSent(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(articles).set({ newsletterSentAt: new Date() }).where(eq(articles.id, articleId));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.delete(articles).where(eq(articles.id, id));
}

export async function createContactMessage(input: { name: string; email: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("تعذر إرسال الرسالة حالياً.");
  await db.insert(contactMessages).values(input);
}

function normalizeEmail(email: string) { return email.trim().toLowerCase(); }

export async function subscribeEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("تعذر حفظ الاشتراك حالياً.");
  const normalizedEmail = normalizeEmail(email);
  const existing = await db.select().from(subscribers).where(eq(subscribers.email, normalizedEmail)).limit(1);
  if (existing[0]) {
    await db.update(subscribers).set({ status: "subscribed", consentAt: new Date(), unsubscribedAt: null }).where(eq(subscribers.id, existing[0].id));
    return { email: normalizedEmail, reactivated: existing[0].status === "unsubscribed" };
  }
  await db.insert(subscribers).values({ email: normalizedEmail, status: "subscribed", unsubscribeToken: randomBytes(32).toString("hex") });
  return { email: normalizedEmail, reactivated: false };
}

export async function listSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
}

export async function listNewsletterRecipients() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: subscribers.id, email: subscribers.email, unsubscribeToken: subscribers.unsubscribeToken }).from(subscribers).where(eq(subscribers.status, "subscribed"));
}

export async function updateSubscriberResendContact(email: string, resendContactId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(subscribers).set({ resendContactId }).where(eq(subscribers.email, normalizeEmail(email)));
}

export async function unsubscribeByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("تعذر إلغاء الاشتراك حالياً.");
  const rows = await db.select({ email: subscribers.email }).from(subscribers).where(eq(subscribers.unsubscribeToken, token)).limit(1);
  const subscriber = rows[0];
  if (!subscriber) return null;
  await db.update(subscribers).set({ status: "unsubscribed", unsubscribedAt: new Date() }).where(eq(subscribers.unsubscribeToken, token));
  return subscriber;
}
