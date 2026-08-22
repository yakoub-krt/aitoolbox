import ArticleCard, { ArticlePreview } from "@/components/ArticleCard";
import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { FormEvent, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const initial = new URLSearchParams(location.split("?")[1] ?? "").get("q") ?? "";
  const [value, setValue] = useState(initial);
  const input = useMemo(() => initial ? { query: initial } : undefined, [initial]);
  const { data: articles, isLoading, error } = trpc.blog.list.useQuery(input);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const query = value.trim(); setLocation(query ? `/search?q=${encodeURIComponent(query)}` : "/search"); }
  return <BlogShell><section className="container py-14"><p className="text-sm font-semibold text-violet-300">البحث الداخلي</p><h1 className="mt-2 font-display text-4xl font-black text-white">ابحث في AIToolBox</h1><form onSubmit={submit} className="mt-8 flex max-w-2xl gap-3"><div className="relative flex-1"><Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><Input className="h-13 border-white/10 bg-white/[0.04] pr-11 text-base text-white placeholder:text-slate-500 focus-visible:ring-violet-400" value={value} onChange={event => setValue(event.target.value)} placeholder="مثال: تلخيص PDF أو كتابة بالعربية" autoFocus /></div><Button className="h-13 bg-violet-500 px-6 hover:bg-violet-400">بحث</Button></form><div className="mt-11">{initial && <p className="mb-6 text-sm text-slate-400">نتائج البحث عن: <span className="font-bold text-slate-100">{initial}</span></p>}{isLoading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/5" />)}</div> : error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-14 text-center text-rose-100">تعذر تنفيذ البحث حالياً. يرجى المحاولة مرة أخرى.</div> : articles?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{(articles as ArticlePreview[]).map(article => <ArticleCard key={article.id} article={article} />)}</div> : <div className="rounded-3xl border border-dashed border-white/15 p-14 text-center text-slate-400">{initial ? "لم نجد نتائج مطابقة. جرّب كلمة أبسط أو اسم أداة آخر." : "اكتب كلمة أو اسم أداة لعرض المقالات المناسبة."}</div>}</div></section></BlogShell>;
}
