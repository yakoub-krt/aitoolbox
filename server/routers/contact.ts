import { z } from "zod";
import { createContactMessage } from "../blogDb";
import { publicProcedure, router } from "../_core/trpc";

export const contactRouter = router({
  submit: publicProcedure
    .input(z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(320), message: z.string().trim().min(10).max(3000) }))
    .mutation(async ({ input }) => {
      await createContactMessage(input);
      return { success: true };
    }),
});
