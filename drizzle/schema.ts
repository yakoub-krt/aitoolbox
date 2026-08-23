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
    newsletterSentAt: timestamp("newsletterSentAt"),
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

export const subscribers = mysqlTable(
  "subscribers",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    status: mysqlEnum("status", ["subscribed", "unsubscribed"]).notNull().default("subscribed"),
    consentAt: timestamp("consentAt").defaultNow().notNull(),
    unsubscribedAt: timestamp("unsubscribedAt"),
    unsubscribeToken: varchar("unsubscribeToken", { length: 128 }).notNull(),
    resendContactId: varchar("resendContactId", { length: 128 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    emailUnique: uniqueIndex("subscribers_email_unique").on(table.email),
    unsubscribeTokenUnique: uniqueIndex("subscribers_unsubscribe_token_unique").on(table.unsubscribeToken),
    statusIndex: index("subscribers_status_idx").on(table.status),
  }),
);

export const newsletterSettings = mysqlTable("newsletterSettings", {
  id: int("id").autoincrement().primaryKey(),
  resendSegmentId: varchar("resendSegmentId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tools = mysqlTable(
  "tools",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    category: mysqlEnum("category", ["writing", "images", "video", "productivity", "research"]).notNull(),
    priceModel: mysqlEnum("priceModel", ["free", "freemium", "paid"]).notNull().default("freemium"),
    arabicSupport: mysqlEnum("arabicSupport", ["yes", "partial", "unknown"]).notNull().default("unknown"),
    websiteUrl: varchar("websiteUrl", { length: 500 }).notNull(),
    shortDescription: text("shortDescription").notNull(),
    bestFor: text("bestFor").notNull(),
    editorialNotes: text("editorialNotes").notNull(),
    limitations: text("limitations").notNull(),
    colorTone: varchar("colorTone", { length: 32 }).notNull().default("violet"),
    isFeatured: boolean("isFeatured").notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    slugUnique: uniqueIndex("tools_slug_unique").on(table.slug),
    categoryIndex: index("tools_category_idx").on(table.category),
    featuredIndex: index("tools_featured_idx").on(table.isFeatured),
  }),
);

export const toolFaqs = mysqlTable(
  "toolFaqs",
  {
    id: int("id").autoincrement().primaryKey(),
    toolId: int("toolId").notNull().references(() => tools.id, { onDelete: "cascade" }),
    question: varchar("question", { length: 255 }).notNull(),
    answer: text("answer").notNull(),
    sortOrder: int("sortOrder").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ toolIndex: index("tool_faqs_tool_idx").on(table.toolId, table.sortOrder) }),
);

export const visitorSuggestions = mysqlTable(
  "visitorSuggestions",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 180 }).notNull(),
    details: text("details").notNull(),
    category: mysqlEnum("category", ["tool", "comparison", "article", "other"]).notNull().default("tool"),
    status: mysqlEnum("status", ["pending", "reviewed", "implemented"]).notNull().default("pending"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ statusIndex: index("suggestions_status_idx").on(table.status, table.createdAt) }),
);

export const savedItems = mysqlTable(
  "savedItems",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    articleId: int("articleId").references(() => articles.id, { onDelete: "cascade" }),
    toolId: int("toolId").references(() => tools.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userArticleUnique: uniqueIndex("saved_items_user_article_unique").on(table.userId, table.articleId),
    userToolUnique: uniqueIndex("saved_items_user_tool_unique").on(table.userId, table.toolId),
    userIndex: index("saved_items_user_idx").on(table.userId, table.createdAt),
  }),
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type ToolFaq = typeof toolFaqs.$inferSelect;
export type VisitorSuggestion = typeof visitorSuggestions.$inferSelect;
