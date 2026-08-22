import ArticleCard, { ArticlePreview } from "@/components/ArticleCard";
import BlogShell from "@/components/BlogShell";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { Link, useRoute } from "wouter";

export default function SectionPage() {
  const [, params] = useRoute("/sections/:slug");
  const slug = params?.slug ?? "";
  const input = useMemo(() => ({ sectionSlug: slug }), [slug]);
  const { data: articles, isLoading, error } = trpc.blog.list.useQuery(input);
  const { data: sections } = trpc.blog.sections.useQuery();
  const section = sections?.find(item => item.slug === slug);

  return <BlogShell>
    <section className="border-b border-white/8 bg-[radial-gradient(circle_at_75%_0%,rgba(139,92,246,.22),transparent_38%)]"><div className="container py-16"><p className="text-sm font-semibold text-violet-300">قسم AIToolBox</p><h1 className="mt-3 font-display text-4xl font-black text-white">{section?.name ?? "المقالات"}</h1><p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{section?.description ?? "مجموعة من المقالات العملية والمراجعات العربية."}</p></div></section>
    <section className="container py-12">{isLoading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-72 animate-pulse rounded-3xl bg-white/5" />)}</div> : error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-10 text-center text-rose-100">تعذر تحميل مقالات هذا القسم. يرجى المحاولة مرة أخرى.</div> : articles?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{(articles as ArticlePreview[]).map(article => <ArticleCard key={article.id} article={article} />)}</div> : <div className="rounded-3xl border border-dashed border-white/15 p-14 text-center"><h2 className="font-display text-2xl font-bold text-white">لا توجد مقالات في هذا القسم بعد</h2><Link href="/" className="mt-4 inline-block text-violet-200">استكشف جميع المقالات</Link></div>}</section>
  </BlogShell>;
}
