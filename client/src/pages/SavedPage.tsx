import BlogShell from "@/components/BlogShell";
import { getLocalSavedItems } from "@/components/SaveButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Bookmark, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function SavedPage() {
  const { isAuthenticated } = useAuth();
  const [localItems, setLocalItems] = useState<ReturnType<typeof getLocalSavedItems>>([]);
  const { data: cloudItems } = trpc.engagement.saved.useQuery(undefined, { enabled: isAuthenticated });
  useEffect(() => setLocalItems(getLocalSavedItems()), []);
  const hasItems = localItems.length || cloudItems?.articles.length || cloudItems?.tools.length;
  return <BlogShell><section className="container max-w-4xl py-16"><p className="text-sm font-semibold text-violet-300">مكتبتي</p><h1 className="mt-2 font-display text-4xl font-black text-white">العناصر المحفوظة</h1><p className="mt-4 text-slate-300">احتفظ بالمقالات والأدوات التي تريد الرجوع إليها. تُحفظ اختياراتك محلياً، وتُزامن مع حسابك عند تسجيل الدخول.</p>{!hasItems ? <div className="mt-10 rounded-3xl border border-dashed border-white/15 p-14 text-center"><Bookmark className="mx-auto h-9 w-9 text-violet-300" /><h2 className="mt-4 font-display text-2xl font-bold text-white">لم تحفظ شيئاً بعد</h2><Button asChild className="mt-5 bg-violet-500 hover:bg-violet-400"><Link href="/tools">استكشف دليل الأدوات</Link></Button></div> : <div className="mt-10 grid gap-5 md:grid-cols-2">{localItems.map(item => <Link key={`${item.kind}-${item.id}`} href={item.href} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-violet-300/50"><p className="text-xs font-bold text-violet-200">{item.kind === "tool" ? "أداة" : "مقال"}</p><h2 className="mt-2 font-bold text-white">{item.label}</h2><span className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400">فتح <ExternalLink className="h-3 w-3" /></span></Link>)}{cloudItems?.articles.map(item => <Link key={`cloud-article-${item.id}`} href={`/articles/${item.slug}`} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><p className="text-xs font-bold text-violet-200">مقال محفوظ في حسابك</p><h2 className="mt-2 font-bold text-white">{item.title}</h2></Link>)}{cloudItems?.tools.map(item => <Link key={`cloud-tool-${item.id}`} href="/tools" className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><p className="text-xs font-bold text-violet-200">أداة محفوظة في حسابك</p><h2 className="mt-2 font-bold text-white">{item.name}</h2></Link>)}</div>}</section></BlogShell>;
}
