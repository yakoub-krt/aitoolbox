import { and, asc, desc, eq, gt, like, or, sql } from "drizzle-orm";
import { prompts } from "../drizzle/schema";
import { getDb } from "./db";

export const promptCategories = ["image_to_video", "image_generation", "image_editing", "short_video", "marketing", "writing"] as const;
export const promptLanguages = ["ar", "en"] as const;
export type PromptCategory = (typeof promptCategories)[number];
export type PromptLanguage = (typeof promptLanguages)[number];

export type PromptFilters = {
  category?: PromptCategory;
  language?: PromptLanguage;
  search?: string;
};

export type PromptWriteInput = {
  title: string;
  slug: string;
  category: PromptCategory;
  language: PromptLanguage;
  useCase: string;
  description: string;
  promptText: string;
  toolHint: string;
  isFree: boolean;
  isPublished: boolean;
  colorTone: string;
  sortOrder: number;
};

export async function listPrompts(filters: PromptFilters = {}, includeAll = false) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (!includeAll) {
    conditions.push(eq(prompts.isPublished, true));
    conditions.push(eq(prompts.isFree, true));
  }
  if (filters.category) conditions.push(eq(prompts.category, filters.category));
  if (filters.language) conditions.push(eq(prompts.language, filters.language));
  const search = filters.search?.trim();
  if (search) {
    const keyword = `%${search}%`;
    conditions.push(or(like(prompts.title, keyword), like(prompts.useCase, keyword), like(prompts.description, keyword), like(prompts.promptText, keyword))!);
  }

  return db.select().from(prompts).where(conditions.length ? and(...conditions) : undefined).orderBy(asc(prompts.sortOrder), asc(prompts.title));
}

export async function listPopularPrompts(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(prompts).where(and(eq(prompts.isPublished, true), eq(prompts.isFree, true), gt(prompts.copyCount, 0))).orderBy(desc(prompts.copyCount), asc(prompts.sortOrder), asc(prompts.title)).limit(limit);
}

export async function recordPromptCopy(id: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(prompts).set({ copyCount: sql`${prompts.copyCount} + 1` }).where(and(eq(prompts.id, id), eq(prompts.isPublished, true), eq(prompts.isFree, true)));
}

export async function createPrompt(input: PromptWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.insert(prompts).values(input);
}

export async function updatePrompt(id: number, input: PromptWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(prompts).set(input).where(eq(prompts.id, id));
}

export async function deletePrompt(id: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.delete(prompts).where(eq(prompts.id, id));
}
