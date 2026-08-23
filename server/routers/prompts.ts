import { z } from "zod";
import { createPrompt, deletePrompt, listPrompts, promptCategories, promptLanguages, updatePrompt } from "../promptDb";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const categorySchema = z.enum(promptCategories);
const languageSchema = z.enum(promptLanguages);

export const promptInputSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9-]+$/),
  category: categorySchema,
  language: languageSchema,
  useCase: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10).max(800),
  promptText: z.string().trim().min(20).max(6000),
  toolHint: z.string().trim().min(2).max(180),
  isFree: z.boolean(),
  isPublished: z.boolean(),
  colorTone: z.enum(["violet", "cyan", "indigo", "fuchsia", "rose"]),
  sortOrder: z.number().int().min(0).max(10000),
});

export const promptsRouter = router({
  list: publicProcedure.input(z.object({ category: categorySchema.optional(), language: languageSchema.optional(), search: z.string().trim().max(100).optional() }).optional()).query(({ input }) => listPrompts(input)),
  adminList: adminProcedure.query(() => listPrompts({}, true)),
  create: adminProcedure.input(promptInputSchema).mutation(async ({ input }) => { await createPrompt(input); return { success: true }; }),
  update: adminProcedure.input(z.object({ id: z.number().int().positive(), data: promptInputSchema })).mutation(async ({ input }) => { await updatePrompt(input.id, input.data); return { success: true }; }),
  delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deletePrompt(input.id); return { success: true }; }),
});
