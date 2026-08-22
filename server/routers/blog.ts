import { z } from "zod";
import { getPublishedArticleBySlug, listPublishedArticles, listSections } from "../blogDb";
import { publicProcedure, router } from "../_core/trpc";

export const blogRouter = router({
  sections: publicProcedure.query(() => listSections()),
  list: publicProcedure
    .input(z.object({ sectionSlug: z.string().min(1).optional(), query: z.string().max(120).optional(), limit: z.number().int().min(1).max(50).optional() }).optional())
    .query(({ input }) => listPublishedArticles(input)),
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(255) })).query(({ input }) => getPublishedArticleBySlug(input.slug)),
});
