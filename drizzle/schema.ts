import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const sections = mysqlTable(
  "sections",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description").notNull(),
    icon: varchar("icon", { length: 40 }).notNull().default("Sparkles"),
    sortOrder: int("sortOrder").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    slugUnique: uniqueIndex("sections_slug_unique").on(table.slug),
    orderIndex: index("sections_order_idx").on(table.sortOrder),
  }),
);

export const articles = mysqlTable(
  "articles",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    keywords: text("keywords").notNull(),
    sectionId: int("sectionId").references(() => sections.id, { onDelete: "set null" }),
    coverTone: varchar("coverTone", { length: 32 }).notNull().default("violet"),
    readingTime: int("readingTime").notNull().default(4),
    isPublished: boolean("isPublished").notNull().default(true),
    publishedAt: timestamp("publishedAt").defaultNow().notNull(),
    lastReviewedAt: timestamp("lastReviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugUnique: uniqueIndex("articles_slug_unique").on(table.slug),
    publishedIndex: index("articles_published_idx").on(table.isPublished, table.publishedAt),
    sectionIndex: index("articles_section_idx").on(table.sectionId),
  }),
);

export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type Article = typeof articles.$inferSelect;
