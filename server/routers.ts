import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { blogRouter } from "./routers/blog";
import { contactRouter } from "./routers/contact";
import { newsletterRouter } from "./routers/newsletter";
import { toolsRouter } from "./routers/tools";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  blog: blogRouter,
  admin: adminRouter,
  contact: contactRouter,
  newsletter: newsletterRouter,
  tools: toolsRouter,
});

export type AppRouter = typeof appRouter;
