import { and, asc, eq, inArray } from "drizzle-orm";
import { tools } from "../drizzle/schema";
import { getDb } from "./db";

export type ToolFilters = {
  category?: "writing" | "images" | "video" | "productivity" | "research";
  priceModel?: "free" | "freemium" | "paid";
  arabicSupport?: "yes" | "partial" | "unknown";
};

export type ToolWriteInput = {
  name: string;
  slug: string;
  category: "writing" | "images" | "video" | "productivity" | "research";
  priceModel: "free" | "freemium" | "paid";
  arabicSupport: "yes" | "partial" | "unknown";
  websiteUrl: string;
  shortDescription: string;
  bestFor: string;
  editorialNotes: string;
  limitations: string;
  colorTone: string;
  isFeatured: boolean;
};

export async function listTools(filters: ToolFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters.category) conditions.push(eq(tools.category, filters.category));
  if (filters.priceModel) conditions.push(eq(tools.priceModel, filters.priceModel));
  if (filters.arabicSupport) conditions.push(eq(tools.arabicSupport, filters.arabicSupport));
  return db.select().from(tools).where(conditions.length ? and(...conditions) : undefined).orderBy(asc(tools.name));
}

export async function listToolsBySlugs(slugs: string[]) {
  const db = await getDb();
  if (!db || slugs.length === 0) return [];
  const rows = await db.select().from(tools).where(inArray(tools.slug, slugs));
  return slugs.map(slug => rows.find(tool => tool.slug === slug)).filter(Boolean);
}

export async function createTool(input: ToolWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.insert(tools).values(input);
}

export async function updateTool(id: number, input: ToolWriteInput) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.update(tools).set(input).where(eq(tools.id, id));
}

export async function deleteTool(id: number) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  await db.delete(tools).where(eq(tools.id, id));
}
