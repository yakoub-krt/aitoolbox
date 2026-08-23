import ArticleCard, { ArticlePreview } from "@/components/ArticleCard";
import BlogShell from "@/components/BlogShell";
import CopySuccessToast from "@/components/CopySuccessToast";
import NewsletterForm from "@/components/NewsletterForm";
import SuggestionForm from "@/components/SuggestionForm";
import AdSlot from "@/components/AdSlot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { copyPromptText } from "@/lib/promptCopy";
import { ArrowLeft, BookOpenCheck, Bot, Copy, Flame, Image, PenTool, PlaySquare, Scale, Sparkles, TimerReset, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const sectionDetails = [
  { slug: "writing", name: "الكتابة", icon: PenTool, description: "كتابة عربية، تلخيص، تدقيق وصياغة أوامر." },
  { slug: "photos", name: "الصور", icon: Image, description: "تصميم، توليد صور وتحرير بصري عملي." },
  { slug: "video", name: "الفيديو", icon: PlaySquare, description: "تفريغ، تعليق صوتي ومقاطع ذكية." },
  { slug: "comparisons", name: "المقارنات", icon: Scale, description: "اختبارات مباشرة تساعدك على الاختيار." },
  { slug: "productivity", name: "الإنتاجية", icon: TimerReset, description: "مهام، دراسة وأتمتة واعية." },
];

function ArticleGridSkeleton() {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-[1.6rem] border border-white/5 bg-white/[0.035]" />)}</div>;
}

export default function Home() {
  const { data: articles, isLoading } = trpc.blog.list.useQuery();
  const { data: sections } = trpc.blog.sections.useQuery();
  const { data: tools } = trpc.tools.list.useQuery();
  const { data: popularPrompts, isLoading: popularLoading } = trpc.prompts.popular.useQuery({ limit: 3 });
  const utils = trpc.useUtils();
  const recordCopy = trpc.prompts.recordCopy.useMutation({ onSuccess: () => utils.prompts.popular.invalidate() });
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const featured = articles?.[0] as ArticlePreview | undefined;
  const recent = (articles?.slice(1, 7) ?? []) as ArticlePreview[];

  async function copyPopularPrompt(id: number, promptText: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
      await copyPromptText(promptText, value => navigator.clipboard.writeText(value));
      const sessionKey = `aitoolbox-prompt-copy-${id}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "1");
        recordCopy.mutate({ id });
      }
      setCopiedPromptId(id);
      window.setTimeout(() => setCopiedPromptId(current => current === id ? null : current), 1800);
    } catch { setCopiedPromptId(null); }
  }

  return (
    <BlogShell>
      <section className="relative isolate overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-80 [background:radial-gradient(circle_at_15%_20%,rgba(139,92,246,.25),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(34,211,238,.16),transparent_25%),linear-gradient(110deg,#070918,#0b0d25_52%,#050612)]" />
        <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <Badge className="mb-6 border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-violet-100 hover:bg-violet-400/10"><Sparkles className="ml-1.5 h-3.5 w-3.5" />دليلك العملي للأدوات الذكية</Badge>
            <h1 className="max-w-3xl font-display text-4xl font-black leading-[1.2] text-white md:text-6xl">استخدم الذكاء الاصطناعي <span className="text-gradient">بذكاء أكبر</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">شروحات عربية واضحة، اختبارات واقعية، ومقارنات عملية تساعدك في العثور على الأداة التي تخدم هدفك فعلاً.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="bg-violet-500 px-6 text-white hover:bg-violet-400"><Link href="/sections/comparisons">استكشف المقارنات <ArrowLeft className="mr-2 h-4 w-4" /></Link></Button><Button asChild size="lg" variant="outline" className="border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10 hover:text-white"><Link href="/advisor">اختر أداتك المناسبة</Link></Button><Button asChild size="lg" variant="outline" className="border-cyan-300/25 bg-cyan-300/[0.07] text-cyan-50 hover:bg-cyan-300/[0.15] hover:text-white"><Link href="/learning-plan"><BookOpenCheck className="ml-2 h-4 w-4" />خطة تعلم 7 أيام</Link></Button></div>
          </div>
          <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.12] to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(31,24,78,.45)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold text-white"><Bot className="h-5 w-5 text-cyan-300" />مختبر AIToolBox</span><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">محدّث باستمرار</span></div>
            <div className="space-y-3">{["اختبر الأداة بالمهمة نفسها", "راجع اللغة والخصوصية والسعر", "اختر ما يناسب سير عملك"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0e22]/70 p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-xs font-black text-violet-200">0{index + 1}</span><span className="text-sm text-slate-200">{item}</span></div>)}</div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-gradient-to-l from-cyan-300 to-violet-500" /></div>
          </div>
        </div>
      </section>

      <section className="container"><AdSlot placement="home" /></section>

      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-violet-300">ابدأ من هدفك</p><h2 className="mt-2 font-display text-3xl font-bold text-white">الأقسام الرئيسية</h2></div><span className="hidden text-sm text-slate-500 md:block">{sections?.length ?? 5} مسارات عملية</span></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sectionDetails.map(detail => { const Icon = detail.icon; return <Link key={detail.slug} href={`/sections/${detail.slug}`} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:border-violet-400/45 hover:bg-violet-400/[0.08]"><span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500/25 to-cyan-400/15 text-violet-200"><Icon className="h-5 w-5" /></span><h3 className="font-bold text-white">{detail.name}</h3><p className="mt-2 text-xs leading-6 text-slate-400">{detail.description}</p></Link> })}
        </div>
      </section>

      <section className="container pb-16"><div className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_12%_20%,rgba(34,211,238,.16),transparent_35%),linear-gradient(110deg,#10142b,#0a0c1b)] p-7 md:p-10"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="flex items-center gap-2 text-sm font-bold text-cyan-200"><Wrench className="h-4 w-4" />اختيارات من الدليل</p><h2 className="mt-3 font-display text-3xl font-black text-white">أفضل أدوات الذكاء الاصطناعي لعام 2026</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">قائمة تحريرية منظمة حسب المهمة، تعتمد على المعلومات العملية المتاحة في دليل الأدوات وليست قائمة تقييمات مستخدمين.</p></div><Button asChild className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"><Link href="/best-ai-tools">عرض أفضل الأدوات <ArrowLeft className="mr-2 h-4 w-4" /></Link></Button></div>{tools?.length ? <div className="mt-8 grid gap-3 md:grid-cols-3">{tools.slice(0, 3).map(tool => <Link key={tool.id} href="/tools" className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-cyan-300/50"><p className="font-display text-lg font-black text-white">{tool.name}</p><p className="mt-2 text-xs leading-6 text-slate-400">{tool.bestFor}</p></Link>)}</div> : null}</div></section>

      <section className="container pb-16"><div className="rounded-[2rem] border border-orange-300/20 bg-[radial-gradient(circle_at_86%_20%,rgba(251,146,60,.17),transparent_28%),linear-gradient(115deg,#171026,#0b0c1d)] p-7 md:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-bold text-orange-200"><Flame className="h-4 w-4" />يتحدث عنها الزوار</p><h2 className="mt-3 font-display text-3xl font-black text-white">Prompts الأكثر شيوعاً</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">ترتيب يتحدث من النسخ الفعلية داخل AIToolBox؛ لا نعتمد تقييمات أو استخداماً مُنشأً مسبقاً.</p></div><Button asChild variant="outline" className="border-orange-200/25 bg-white/[0.04] text-orange-50 hover:bg-white/10 hover:text-white"><Link href="/prompts">استكشف المكتبة <ArrowLeft className="mr-2 h-4 w-4" /></Link></Button></div>{popularLoading ? <div className="mt-7 grid gap-3 md:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl bg-white/[0.05]" />)}</div> : popularPrompts?.length ? <div className="mt-7 grid gap-3 md:grid-cols-3">{popularPrompts.map((prompt, index) => <article key={prompt.id} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5"><span className="absolute left-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-orange-300/15 text-xs font-black text-orange-100">{index + 1}</span><p className="text-xs font-bold text-orange-200">{prompt.category === "writing" ? "كتابة ومقالات" : prompt.category === "marketing" ? "إعلانات ومحتوى" : "صور وفيديو"}</p><h3 className="mt-2 font-display text-xl font-black text-white">{prompt.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-400">{prompt.description}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">{prompt.copyCount} نسخ فعلي</span><Button size="sm" onClick={() => copyPopularPrompt(prompt.id, prompt.promptText)} className={copiedPromptId === prompt.id ? "bg-emerald-500 hover:bg-emerald-500" : "bg-orange-400 text-slate-950 hover:bg-orange-300"}>{copiedPromptId === prompt.id ? "تم النسخ" : <><Copy className="ml-1.5 h-3.5 w-3.5" />نسخ</>}</Button></div></article>)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-orange-200/20 bg-black/15 p-7 text-center"><Flame className="mx-auto h-7 w-7 text-orange-200" /><p className="mt-3 font-bold text-white">ستظهر هنا الـPrompts الأكثر نسخاً فعلياً.</p><p className="mt-2 text-sm text-slate-400">ابدأ بتجربة المكتبة، وسيُحدَّث هذا القسم مع استخدام الزوار.</p><Link href="/prompts" className="mt-4 inline-flex text-sm font-bold text-orange-200 hover:text-white">الذهاب إلى مكتبة Prompts</Link></div>}</div></section>

      <section className="container pb-16">
        <div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-semibold text-cyan-300">من AIToolBox</p><h2 className="mt-2 font-display text-3xl font-bold text-white">أحدث ما نُشر</h2></div><Link href="/search" className="flex items-center gap-1 text-sm font-semibold text-violet-200 hover:text-white">كل المقالات <ArrowLeft className="h-4 w-4" /></Link></div>
        {isLoading ? <ArticleGridSkeleton /> : featured ? <><ArticleCard article={featured} featured /><div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recent.map(article => <ArticleCard key={article.id} article={article} />)}</div></> : <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-slate-400">ستظهر المقالات هنا فور تجهيزها.</div>}
      </section>
      <section className="container pb-4"><NewsletterForm /></section><CopySuccessToast visible={copiedPromptId !== null} />
      <section className="container pb-4"><SuggestionForm /></section>
    </BlogShell>
  );
}
