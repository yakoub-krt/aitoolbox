import ArticleCard, { ArticlePreview } from "@/components/ArticleCard";
import BlogShell from "@/components/BlogShell";
import ShareButtons from "@/components/ShareButtons";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CalendarDays, Clock3, RefreshCw, Tag } from "lucide-react";
import { Streamdown } from "streamdown";
import { Link, useRoute } from "wouter";

const dateFormat = new Intl.DateTimeFormat("ar", { dateStyle: "long" });

export default function ArticlePage() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug ?? "";
  const { data, isLoading, error } = trpc.blog.bySlug.useQuery({ slug });

  if (isLoading) return <BlogShell><div className="container py-24"><div className="h-8 w-1/3 animate-pulse rounded bg-white/10" /><div className="mt-8 h-80 animate-pulse rounded-3xl bg-white/5" /></div></BlogShell>;
  if (error) return <BlogShell><div className="container py-24 text-center"><h1 className="font-display text-3xl font-bold text-white">تعذر تحميل المقال</h1><p className="mt-3 text-slate-400">يرجى المحاولة مرة أخرى بعد قليل.</p><Link href="/" className="mt-5 inline-flex items-center gap-2 text-violet-200"><ArrowRight className="h-4 w-4" />العودة إلى المدونة</Link></div></BlogShell>;
  if (!data) return <BlogShell><div className="container py-24 text-center"><h1 className="font-display text-3xl font-bold text-white">لم نجد هذا المقال</h1><Link href="/" className="mt-5 inline-flex items-center gap-2 text-violet-200"><ArrowRight className="h-4 w-4" />العودة إلى المدونة</Link></div></BlogShell>;

  const { article, related } = data;
  const keywords = article.keywords.split(",").map(item => item.trim()).filter(Boolean);
  return <BlogShell>
    <article className="container max-w-4xl py-12 md:py-18">
      <Link href={article.sectionSlug ? `/sections/${article.sectionSlug}` : "/"} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white"><ArrowRight className="h-4 w-4" />{article.sectionName ?? "كل المقالات"}</Link>
      <h1 className="mt-6 font-display text-3xl font-black leading-[1.35] text-white md:text-5xl">{article.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-300">{article.excerpt}</p>
      <div className="mt-7 flex flex-wrap items-center gap-4 border-y border-white/10 py-4 text-xs text-slate-400"><span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-violet-300" />نُشر {dateFormat.format(new Date(article.publishedAt))}</span><span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-cyan-300" />{article.readingTime} دقائق قراءة</span>{article.lastReviewedAt && <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4 text-emerald-300" />آخر مراجعة {dateFormat.format(new Date(article.lastReviewedAt))}</span>}</div>
      <ShareButtons title={article.title} path={`/articles/${article.slug}`} />
      <div className="article-prose mt-10"><Streamdown>{article.content}</Streamdown></div>
      <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-7"><Tag className="h-4 w-4 text-slate-500" />{keywords.map(keyword => <Badge key={keyword} variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">{keyword}</Badge>)}</div>
    </article>
    {related.length > 0 && <section className="container pb-10"><div className="mb-6"><p className="text-sm font-semibold text-violet-300">أكمل التعلّم</p><h2 className="mt-2 font-display text-2xl font-bold text-white">مقالات ذات صلة</h2></div><div className="grid gap-5 md:grid-cols-3">{(related as ArticlePreview[]).map(item => <ArticleCard key={item.id} article={item} />)}</div></section>}
  </BlogShell>;
}
