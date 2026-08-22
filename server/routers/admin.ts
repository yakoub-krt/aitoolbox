import { z } from "zod";
import { createArticle, deleteArticle, listAdminArticles, updateArticle } from "../blogDb";
import { adminProcedure, router } from "../_core/trpc";

export const articleInputSchema = z.object({
  title: z.string().trim().min(8).max(255),
  slug: z.string().trim().min(3).max(255).regex(/^[a-z0-9-]+$/, "الرابط المختصر يجب أن يحتوي أحرفاً إنجليزية صغيرة وأرقاماً وشرطات فقط."),
  excerpt: z.string().trim().min(24).max(800),
  content: z.string().trim().min(80),
  keywords: z.string().trim().min(3).max(500),
  sectionId: z.number().int().positive().nullable(),
  coverTone: z.enum(["violet", "cyan", "indigo", "fuchsia", "rose"]),
  isPublished: z.boolean(),
  publishedAt: z.date(),
  lastReviewedAt: z.date().nullable(),
});

export const adminRouter = router({
  listArticles: adminProcedure.query(() => listAdminArticles()),
  createArticle: adminProcedure.input(articleInputSchema).mutation(async ({ input }) => {
    await createArticle(input);
    return { success: true };
  }),
  updateArticle: adminProcedure.input(z.object({ id: z.number().int().positive(), data: articleInputSchema })).mutation(async ({ input }) => {
    await updateArticle(input.id, input.data);
    return { success: true };
  }),
  deleteArticle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await deleteArticle(input.id);
    return { success: true };
  }),
});
