import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { articles, savedItems, toolFaqs, tools, visitorSuggestions } from "../drizzle/schema";
import { getDb } from "./db";

export async function listToolFaqs(toolId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(toolFaqs).where(eq(toolFaqs.toolId, toolId)).orderBy(asc(toolFaqs.sortOrder), asc(toolFaqs.id));
}

export async function createToolFaq(input: { toolId: number; question: string; answer: string; sortOrder: number }) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.insert(toolFaqs).values(input);
}

export async function updateToolFaq(id: number, input: { question: string; answer: string; sortOrder: number }) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(toolFaqs).set(input).where(eq(toolFaqs.id, id));
}

export async function deleteToolFaq(id: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.delete(toolFaqs).where(eq(toolFaqs.id, id));
}

export async function createSuggestion(input: { title: string; details: string; category: "tool" | "comparison" | "article" | "other" }) {
  const db = await getDb();
  if (!db) throw new Error("تعذر حفظ الاقتراح حالياً.");
  await db.insert(visitorSuggestions).values(input);
}

export async function listSuggestions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(visitorSuggestions).orderBy(desc(visitorSuggestions.createdAt));
}

export async function updateSuggestionStatus(id: number, status: "pending" | "reviewed" | "implemented") {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(visitorSuggestions).set({ status }).where(eq(visitorSuggestions.id, id));
}

export async function saveItem(userId: number, item: { kind: "article"; id: number } | { kind: "tool"; id: number }) {
  const db = await getDb();
  if (!db) throw new Error("تعذر حفظ العنصر حالياً.");
  const conditions = item.kind === "article" ? and(eq(savedItems.userId, userId), eq(savedItems.articleId, item.id)) : and(eq(savedItems.userId, userId), eq(savedItems.toolId, item.id));
  const existing = await db.select({ id: savedItems.id }).from(savedItems).where(conditions).limit(1);
  if (!existing[0]) await db.insert(savedItems).values(item.kind === "article" ? { userId, articleId: item.id } : { userId, toolId: item.id });
}

export async function unsaveItem(userId: number, item: { kind: "article"; id: number } | { kind: "tool"; id: number }) {
  const db = await getDb();
  if (!db) throw new Error("تعذر تحديث العناصر المحفوظة حالياً.");
  const conditions = item.kind === "article" ? and(eq(savedItems.userId, userId), eq(savedItems.articleId, item.id)) : and(eq(savedItems.userId, userId), eq(savedItems.toolId, item.id));
  await db.delete(savedItems).where(conditions);
}

export async function listSavedItems(userId: number) {
  const db = await getDb();
  if (!db) return { articles: [], tools: [] };
  const rows = await db.select().from(savedItems).where(eq(savedItems.userId, userId)).orderBy(desc(savedItems.createdAt));
  const articleIds = rows.flatMap(row => row.articleId ? [row.articleId] : []);
  const toolIds = rows.flatMap(row => row.toolId ? [row.toolId] : []);
  const savedArticles = articleIds.length ? await db.select({ id: articles.id, title: articles.title, slug: articles.slug, excerpt: articles.excerpt }).from(articles).where(and(eq(articles.isPublished, true), inArray(articles.id, articleIds))) : [];
  const savedTools = toolIds.length ? await db.select({ id: tools.id, name: tools.name, slug: tools.slug, shortDescription: tools.shortDescription }).from(tools).where(inArray(tools.id, toolIds)) : [];
  return { articles: savedArticles, tools: savedTools };
}
