import BlogShell from "@/components/BlogShell";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, MailX } from "lucide-react";
import { useEffect } from "react";
import { Link, useRoute } from "wouter";

export default function UnsubscribePage() {
  const [, params] = useRoute("/unsubscribe/:token");
  const unsubscribe = trpc.newsletter.unsubscribe.useMutation();
  const token = params?.token;
  useEffect(() => { if (token && !unsubscribe.isPending && !unsubscribe.isSuccess) unsubscribe.mutate({ token }); }, [token]);
  return <BlogShell><section className="container max-w-2xl py-24 text-center"><MailX className="mx-auto h-10 w-10 text-violet-300" /><h1 className="mt-5 font-display text-3xl font-black text-white">إدارة الاشتراك</h1>{unsubscribe.isPending && <p className="mt-4 text-slate-400">جارٍ تحديث تفضيلاتك…</p>}{unsubscribe.isSuccess && <><CheckCircle2 className="mx-auto mt-6 h-8 w-8 text-emerald-300" /><p className="mt-3 text-slate-300">تم إلغاء اشتراكك بنجاح. لن تصلك تحديثات AIToolBox البريدية لاحقاً.</p></>}{unsubscribe.isError && <p className="mt-4 text-rose-200">تعذر تحديث الاشتراك. يرجى المحاولة مرة أخرى.</p>}<Link href="/" className="mt-8 inline-block text-sm font-bold text-violet-200 hover:text-white">العودة إلى المدونة</Link></section></BlogShell>;
}
