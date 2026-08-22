import { z } from "zod";
import { listSubscribers, subscribeEmail, unsubscribeByToken } from "../blogDb";
import { syncSubscriberToResend, unsubscribeRemoteContact } from "../resendService";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

export const newsletterRouter = router({
  subscribe: publicProcedure.input(z.object({ email: z.string().trim().email().max(320) })).mutation(async ({ input }) => {
    const subscription = await subscribeEmail(input.email);
    try {
      await syncSubscriberToResend(subscription.email);
    } catch {
      // يبقى الاشتراك محفوظاً محلياً حتى لو لم تتوفر خدمة البريد أثناء التسجيل.
    }
    return { success: true };
  }),
  unsubscribe: publicProcedure.input(z.object({ token: z.string().length(64) })).mutation(async ({ input }) => {
    const subscriber = await unsubscribeByToken(input.token);
    if (subscriber) {
      try {
        await unsubscribeRemoteContact(subscriber.email);
      } catch {
        // حالة إلغاء الاشتراك المحلية هي المرجع وتمنع الإرسال اللاحق من الموقع.
      }
    }
    return { success: true };
  }),
  listSubscribers: adminProcedure.query(() => listSubscribers()),
});
