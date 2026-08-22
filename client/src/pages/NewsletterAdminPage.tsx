import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { MailCheck, ShieldAlert, Users } from "lucide-react";

const dateFormat = new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" });

function NewsletterAdminContent() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: subscribers, isLoading } = trpc.newsletter.listSubscribers.useQuery(undefined, { enabled: isAdmin });
  if (loading) return <div className="p-10 text-slate-400">جارٍ التحقق من الحساب…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-center"><ShieldAlert className="mx-auto h-9 w-9 text-rose-300" /><h1 className="mt-4 font-display text-2xl font-bold text-white">هذه الصفحة للمشرف فقط</h1></div>;
  const activeCount = subscribers?.filter(subscriber => subscriber.status === "subscribed").length ?? 0;
  return <div className="mx-auto max-w-5xl space-y-7" dir="rtl"><div><p className="text-sm font-semibold text-violet-300">النشرة البريدية</p><h1 className="mt-2 font-display text-3xl font-black text-white">المشتركون</h1><p className="mt-2 text-sm text-slate-400">يستلم المشتركون النشطون تحديثاً تلقائياً عند نشر مقال جديد بعد تفعيل Resend.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><Users className="h-6 w-6 text-violet-300" /><p className="mt-4 text-3xl font-black text-white">{activeCount}</p><p className="mt-1 text-sm text-slate-400">مشتركون نشطون</p></div><div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><MailCheck className="h-6 w-6 text-cyan-300" /><p className="mt-4 text-3xl font-black text-white">{subscribers?.length ?? 0}</p><p className="mt-1 text-sm text-slate-400">إجمالي التسجيلات</p></div></div><section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"><div className="border-b border-white/10 px-6 py-5"><h2 className="font-display text-xl font-bold text-white">قائمة المشتركين</h2></div>{isLoading ? <div className="p-8 text-slate-400">جارٍ تحميل المشتركين…</div> : subscribers?.length ? <div className="divide-y divide-white/8">{subscribers.map(subscriber => <div key={subscriber.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"><div><p className="font-medium text-white" dir="ltr">{subscriber.email}</p><p className="mt-1 text-xs text-slate-500">سجّل في {dateFormat.format(new Date(subscriber.consentAt))}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${subscriber.status === "subscribed" ? "bg-emerald-400/10 text-emerald-200" : "bg-slate-400/10 text-slate-400"}`}>{subscriber.status === "subscribed" ? "نشط" : "ألغى الاشتراك"}</span></div>)}</div> : <div className="p-10 text-center text-slate-400">لا يوجد مشتركون بعد.</div>}</section></div>;
}

export default function NewsletterAdminPage() { return <DashboardLayout><NewsletterAdminContent /></DashboardLayout>; }
