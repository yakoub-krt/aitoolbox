import { ArrowLeft, Clock3 } from "lucide-react";
import { Link } from "wouter";

export type ArticlePreview = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverTone: string;
  readingTime: number;
  publishedAt: Date;
  sectionName: string | null;
  sectionSlug: string | null;
};

const tones: Record<string, string> = {
  violet: "from-violet-500/90 via-purple-500/45 to-indigo-950",
  cyan: "from-cyan-400/75 via-blue-500/40 to-slate-950",
  indigo: "from-indigo-400/75 via-violet-600/40 to-slate-950",
  fuchsia: "from-fuchsia-500/80 via-purple-600/45 to-slate-950",
  rose: "from-rose-400/80 via-fuchsia-600/40 to-slate-950",
};

export function ArticleArtwork({ tone, small = false }: { tone: string; small?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tones[tone] ?? tones.violet} ${small ? "h-28" : "h-48"}`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/30" />
      <div className="absolute right-10 top-8 h-20 w-20 rounded-2xl border border-white/25 bg-white/10 shadow-[0_0_45px_rgba(255,255,255,.18)] backdrop-blur" />
      <div className="absolute bottom-5 left-7 h-20 w-44 rotate-[-25deg] rounded-full border border-white/15 bg-gradient-to-r from-white/20 to-transparent" />
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:26px_26px]" />
    </div>
  );
}

export default function ArticleCard({ article, featured = false }: { article: ArticlePreview; featured?: boolean }) {
  return (
    <article className={`group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.06] ${featured ? "grid md:grid-cols-[1.05fr_.95fr]" : ""}`}>
      <ArticleArtwork tone={article.coverTone} small={!featured} />
      <div className={`${featured ? "p-7 md:p-9" : "p-5"}`}>
        {article.sectionName && <Link href={`/sections/${article.sectionSlug}`} className="mb-3 inline-flex rounded-full bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200 transition hover:bg-violet-400/20">{article.sectionName}</Link>}
        <h2 className={`${featured ? "text-2xl md:text-3xl" : "text-lg"} font-display font-bold leading-snug text-white`}>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-400">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{article.readingTime} دقائق قراءة</span>
          <Link href={`/articles/${article.slug}`} className="flex items-center gap-1 font-semibold text-violet-200 hover:text-white">اقرأ المقال <ArrowLeft className="h-4 w-4" /></Link>
        </div>
      </div>
    </article>
  );
}
