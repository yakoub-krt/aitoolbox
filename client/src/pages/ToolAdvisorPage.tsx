import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { recommendTools, type AdvisorPreferences, type AdvisorTool } from "@/lib/toolAdvisor";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle2, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const goals = [
  { value: "writing", label: "الكتابة", detail: "محتوى، تلخيص، صياغة أفكار" },
  { value: "images", label: "الصور", detail: "تصميم، صور وتحرير بصري" },
  { value: "video", label: "الفيديو", detail: "مقاطع، مونتاج وإنتاج مرئي" },
  { value: "productivity", label: "الإنتاجية", detail: "تنظيم معرفة ومهام" },
  { value: "research", label: "البحث", detail: "استكشاف مصادر ومعلومات" },
] as const;

export default function ToolAdvisorPage() {
  const { data: tools, isLoading } = trpc.tools.list.useQuery();
  const [preferences, setPreferences] = useState<Partial<AdvisorPreferences>>({});
  const isReady = Boolean(preferences.goal && preferences.budget && preferences.arabic);
  const results = useMemo(
    () => isReady ? recommendTools((tools ?? []) as AdvisorTool[], preferences as AdvisorPreferences) : [],
    [tools, preferences, isReady],
  );

  function reset() { setPreferences({}); }

  return <BlogShell>
    <section className="border-b border-white/8 bg-[radial-gradient(circle_at_76%_5%,rgba(34,211,238,.16),transparent_30%),radial-gradient(circle_at_15%_30%,rgba(139,92,246,.22),transparent_35%)]">
      <div className="container max-w-5xl py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-100"><Sparkles className="h-3.5 w-3.5" />مستشار AIToolBox</span>
        <h1 className="mt-5 font-display text-4xl font-black leading-tight text-white md:text-5xl">اختر الأداة المناسبة لك</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">أجب عن ثلاثة أسئلة قصيرة، وسنرتب لك خيارات من الدليل حسب الهدف والميزانية وتفضيل العربية. النتيجة نقطة بداية وليست ضماناً؛ راجع صفحة الأداة قبل التسجيل.</p>
        <Button asChild variant="outline" className="mt-6 border-white/15 bg-white/[0.03] text-white hover:bg-white/10"><Link href="/tools">فتح دليل الأدوات للمقارنة <ArrowLeft className="mr-2 h-4 w-4" /></Link></Button>
      </div>
    </section>
    <section className="container max-w-5xl py-12">
      <div className="grid gap-7 lg:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-black text-white">ما الذي تحتاجه؟</h2><button onClick={reset} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"><RotateCcw className="h-3.5 w-3.5" />إعادة</button></div>
          <div className="mt-7"><p className="text-sm font-bold text-violet-200">1. هدفك الأساسي</p><div className="mt-3 grid gap-2">{goals.map(goal => <button key={goal.value} onClick={() => setPreferences({ ...preferences, goal: goal.value })} className={`rounded-2xl border p-3 text-right transition ${preferences.goal === goal.value ? "border-violet-300/70 bg-violet-400/15" : "border-white/10 bg-black/15 hover:border-white/25"}`}><span className="block font-bold text-white">{goal.label}</span><span className="mt-1 block text-xs text-slate-400">{goal.detail}</span></button>)}</div></div>
          <div className="mt-7"><p className="text-sm font-bold text-violet-200">2. الميزانية</p><div className="mt-3 grid grid-cols-2 gap-2">{([['free','أريد البدء مجاناً'],['flexible','لدي مرونة في الخطة']] as const).map(([value, label]) => <button key={value} onClick={() => setPreferences({ ...preferences, budget: value })} className={`rounded-xl border p-3 text-xs font-bold transition ${preferences.budget === value ? "border-violet-300/70 bg-violet-400/15 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>{label}</button>)}</div></div>
          <div className="mt-7"><p className="text-sm font-bold text-violet-200">3. العربية</p><div className="mt-3 grid gap-2">{([['required','أحتاج دعماً واضحاً للعربية'],['preferred','أفضل وجود دعم عربي'],['any','ليست شرطاً']] as const).map(([value, label]) => <button key={value} onClick={() => setPreferences({ ...preferences, arabic: value })} className={`rounded-xl border p-3 text-right text-xs font-bold transition ${preferences.arabic === value ? "border-violet-300/70 bg-violet-400/15 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}>{label}</button>)}</div></div>
        </div>
        <div className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-b from-cyan-400/[0.08] to-white/[0.025] p-6 md:p-8">
          <p className="text-sm font-bold text-cyan-200">نتيجتك</p>
          {isLoading ? <div className="mt-5 h-56 animate-pulse rounded-3xl bg-white/5" /> : !isReady ? <div className="mt-5 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 px-8 text-center"><Sparkles className="h-9 w-9 text-cyan-300" /><h2 className="mt-4 font-display text-2xl font-bold text-white">أجب عن الأسئلة الثلاثة</h2><p className="mt-2 text-sm leading-7 text-slate-400">ستظهر هنا أدوات مناسبة من دليل AIToolBox مع سبب الاقتراح.</p></div> : <div className="mt-5 space-y-4">{results.map(({ tool, reasons }, index) => <article key={tool.id} className="rounded-3xl border border-white/10 bg-[#080c1c]/75 p-5"><p className="text-xs font-bold text-cyan-200">الخيار {index + 1}</p><h2 className="mt-2 font-display text-2xl font-black text-white">{tool.name}</h2><p className="mt-2 text-sm leading-7 text-slate-300">{tool.shortDescription}</p><ul className="mt-4 space-y-2">{reasons.map(reason => <li key={reason} className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-300" />{reason}</li>)}</ul><div className="mt-5 flex flex-wrap gap-2"><a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300">الموقع الرسمي <ExternalLink className="h-3.5 w-3.5" /></a><Button asChild size="sm" variant="outline" className="border-white/15 text-slate-200 hover:bg-white/10 hover:text-white"><Link href="/tools">اختر أداة ثانية للمقارنة <ArrowLeft className="mr-1 h-3.5 w-3.5" /></Link></Button></div></article>)}</div>}
          <div className="mt-7 border-t border-white/10 pt-5 text-center text-xs text-slate-500">صُمم هذا المستشار بواسطة <span className="font-bold text-violet-200" dir="ltr">Yakoub Kartouche</span></div>
        </div>
      </div>
    </section>
  </BlogShell>;
}
