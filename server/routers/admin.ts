import { z } from "zod";
import { createArticle, deleteArticle, getArticleForNewsletter, getArticlePublicationStatus, listAdminArticles, updateArticle } from "../blogDb";
import { sendArticleNewsletter } from "../resendService";
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
  createArticle: adminProcedure.input(articleInputSchema).mutation(async ({ input, ctx }) => {
    await createArticle(input);
    const article = input.isPublished ? await getArticleForNewsletter(input.slug) : null;
    let newsletter = { sent: false, reason: "draft" };
    if (article) {
      try {
        newsletter = await sendArticleNewsletter(article, `${ctx.req.protocol}://${ctx.req.get("host")}`);
      } catch {
        newsletter = { sent: false, reason: "delivery_failed" };
      }
    }
    return { success: true, newsletter };
  }),
  updateArticle: adminProcedure.input(z.object({ id: z.number().int().positive(), data: articleInputSchema })).mutation(async ({ input, ctx }) => {
    const previous = await getArticlePublicationStatus(input.id);
    await updateArticle(input.id, input.data);
    const article = input.data.isPublished && !previous?.isPublished ? await getArticleForNewsletter(input.data.slug) : null;
    let newsletter = { sent: false, reason: "not_newly_published" };
    if (article) {
      try {
        newsletter = await sendArticleNewsletter(article, `${ctx.req.protocol}://${ctx.req.get("host")}`);
      } catch {
        newsletter = { sent: false, reason: "delivery_failed" };
      }
    }
    return { success: true, newsletter };
  }),
  deleteArticle: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await deleteArticle(input.id);
    return { success: true };
  }),
});
