import { z } from "zod";
import { createSuggestion, createToolFaq, deleteToolFaq, listSavedItems, listSuggestions, listToolFaqs, saveItem, unsaveItem, updateSuggestionStatus, updateToolFaq } from "../engagementDb";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

const savedItemSchema = z.discriminatedUnion("kind", [z.object({ kind: z.literal("article"), id: z.number().int().positive() }), z.object({ kind: z.literal("tool"), id: z.number().int().positive() })]);
const faqInput = z.object({ toolId: z.number().int().positive(), question: z.string().trim().min(6).max(255), answer: z.string().trim().min(15).max(4000), sortOrder: z.number().int().min(0).max(1000).default(0) });

export const engagementRouter = router({
  toolFaqs: publicProcedure.input(z.object({ toolId: z.number().int().positive() })).query(({ input }) => listToolFaqs(input.toolId)),
  submitSuggestion: publicProcedure.input(z.object({ title: z.string().trim().min(4).max(180), details: z.string().trim().min(10).max(3000), category: z.enum(["tool", "comparison", "article", "other"]) })).mutation(async ({ input }) => { await createSuggestion(input); return { success: true }; }),
  save: protectedProcedure.input(savedItemSchema).mutation(async ({ ctx, input }) => { await saveItem(ctx.user.id, input); return { success: true }; }),
  unsave: protectedProcedure.input(savedItemSchema).mutation(async ({ ctx, input }) => { await unsaveItem(ctx.user.id, input); return { success: true }; }),
  saved: protectedProcedure.query(({ ctx }) => listSavedItems(ctx.user.id)),
  adminSuggestions: adminProcedure.query(() => listSuggestions()),
  updateSuggestionStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["pending", "reviewed", "implemented"]) })).mutation(async ({ input }) => { await updateSuggestionStatus(input.id, input.status); return { success: true }; }),
  adminCreateFaq: adminProcedure.input(faqInput).mutation(async ({ input }) => { await createToolFaq(input); return { success: true }; }),
  adminUpdateFaq: adminProcedure.input(z.object({ id: z.number().int().positive(), data: faqInput.omit({ toolId: true }) })).mutation(async ({ input }) => { await updateToolFaq(input.id, input.data); return { success: true }; }),
  adminDeleteFaq: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteToolFaq(input.id); return { success: true }; }),
});
