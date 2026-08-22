import { and, desc, eq, like, ne, or } from "drizzle-orm";
import { articles, contactMessages, sections } from "../drizzle/schema";
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
  createdAt: articles.createdAt,
  updatedAt: articles.updatedAt,
  sectionName: sections.name,
  sectionSlug: sections.slug,
};

type ListArticlesInput = {
  sectionSlug?: string;
  query?: string;
  limit?: number;
};

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
    const searchCondition = or(
      like(articles.title, term),
      like(articles.excerpt, term),
      like(articles.keywords, term),
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  return db
    .select(articleSelection)
    .from(articles)
    .leftJoin(sections, eq(articles.sectionId, sections.id))
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .limit(input.limit ?? 24);
}

export async function getPublishedArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const rows = await db
    .select(articleSelection)
    .from(articles)
    .leftJoin(sections, eq(articles.sectionId, sections.id))
    .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
    .limit(1);
  const article = rows[0];
  if (!article) return null;

  const related = article.sectionId
    ? await db
        .select(articleSelection)
        .from(articles)
        .leftJoin(sections, eq(articles.sectionId, sections.id))
        .where(
          and(
            eq(articles.isPublished, true),
            eq(articles.sectionId, article.sectionId),
            ne(articles.id, article.id),
          ),
        )
        .orderBy(desc(articles.publishedAt))
        .limit(3)
    : [];

  return { article, related };
}

export async function listAdminArticles() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select(articleSelection)
    .from(articles)
    .leftJoin(sections, eq(articles.sectionId, sections.id))
    .orderBy(desc(articles.updatedAt));
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

function estimateReadingTime(content: string) {
  return Math.max(3, Math.ceil(content.trim().split(/\s+/).length / 190));
}

export async function createArticle(input: ArticleWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.insert(articles).values({ ...input, readingTime: estimateReadingTime(input.content) });
}

export async function updateArticle(id: number, input: ArticleWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db
    .update(articles)
    .set({ ...input, readingTime: estimateReadingTime(input.content) })
    .where(eq(articles.id, id));
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
