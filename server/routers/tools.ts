import { z } from "zod";
import { createTool, deleteTool, listTools, listToolsBySlugs, updateTool } from "../toolDb";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const categorySchema = z.enum(["writing", "images", "video", "productivity", "research"]);
const priceSchema = z.enum(["free", "freemium", "paid"]);
const arabicSchema = z.enum(["yes", "partial", "unknown"]);

export const toolInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/),
  category: categorySchema,
  priceModel: priceSchema,
  arabicSupport: arabicSchema,
  websiteUrl: z.string().url().max(500),
  shortDescription: z.string().trim().min(15).max(800),
  bestFor: z.string().trim().min(10).max(800),
  editorialNotes: z.string().trim().min(10).max(1500),
  limitations: z.string().trim().min(10).max(1000),
  colorTone: z.enum(["violet", "cyan", "indigo", "fuchsia", "rose"]),
  isFeatured: z.boolean(),
});

export const toolsRouter = router({
  list: publicProcedure.input(z.object({ category: categorySchema.optional(), priceModel: priceSchema.optional(), arabicSupport: arabicSchema.optional() }).optional()).query(({ input }) => listTools(input)),
  compare: publicProcedure.input(z.object({ slugs: z.array(z.string().min(2).max(160)).min(2).max(3) })).query(({ input }) => listToolsBySlugs(input.slugs)),
  adminList: adminProcedure.query(() => listTools()),
  create: adminProcedure.input(toolInputSchema).mutation(async ({ input }) => { await createTool(input); return { success: true }; }),
  update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: toolInputSchema })).mutation(async ({ input }) => { await updateTool(input.id, input.data); return { success: true }; }),
  delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteTool(input.id); return { success: true }; }),
});
