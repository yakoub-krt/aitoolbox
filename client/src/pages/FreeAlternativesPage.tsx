import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterFreeAlternatives, freeAlternativeCategories, FreeAlternativeCategory, getFreeAlternativeCategoryLabel } from "@/lib/freeAlternatives";
import { AudioLines, BookOpenCheck, ExternalLink, FileText, Image, Lightbulb, ListFilter, Palette, PenTool, Search, Video, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const categoryIcons = { image: Palette, office: FileText, research: BookOpenCheck, planning: PenTool, audio: AudioLines, video: Video };
const accentStyles = {
  violet: "border-violet-300/20 bg-violet-400/[0.055] text-violet-100",
  cyan: "border-cyan-300/20 bg-cyan-300/[0.055] text-cyan-100",
  emerald: "border-emerald-300/20 bg-emerald-300/[0.055] text-emerald-100",
  amber: "border-amber-300/20 bg-amber-300/[0.055] text-amber-100",
  rose: "border-rose-300/20 bg-rose-300/[0.055] text-rose-100",
  indigo: "border-indigo-300/20 bg-indigo-300/[0.055] text-indigo-100",
};

export default function FreeAlternativesPage() {
  const [category, setCategory] = useState<FreeAlternativeCategory | "">("");
  const [search, setSearch] = useState("");
  const results = useMemo(() => filterFreeAlternatives(category, search), [category, search]);
  const hasFilters = Boolean(category || search.trim());
  const clearFilters = () => { setCategory(""); setSearch(""); };

  return <BlogShell>
    <section className="border-b border-white/8 bg-[radial-gradient(circle_at_16%_16%,rgba(139,92,246,.24),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(34,211,238,.18),transparent_26%),#070a1c]">
      <div className="container grid gap-8 py-14 lg:grid-cols-[1.13fr_.87fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs font-bold text-emerald-100"><Lightbulb className="h-3.5 w-3.5" />روابط رسمية منتقاة</p>
          <p className="mt-6 text-sm font-bold text-violet-200">دليل AIToolBox</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-[1.15] text-white md:text-5xl">مواقع وبدائل مجانية <span className="text-gradient">تخدم مهمتك</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">بدائل عملية للتصميم والوثائق والبحث والرسم والصوت والفيديو. اختر الأداة حسب ما تريد إنجازه، ثم راجع خطتها وشروطها الحالية من الموقع الرسمي قبل بدء العمل.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-violet-500 text-white hover:bg-violet-400"><a href="#directory">استكشف البدائل <ListFilter className="mr-2 h-4 w-4" /></a></Button><Button asChild variant="outline" className="border-white/15 bg-white/[0.035] text-slate-100 hover:bg-white/10 hover:text-white"><Link href="/tools">دليل أدوات الذكاء الاصطناعي</Link></Button></div>
        </div>
        <aside className="rounded-[1.8rem] border border-white/10 bg-[#0c1128]/80 p-6 shadow-[0_18px_55px_rgba(0,0,0,.2)]">
          <p className="text-sm font-bold text-white">كيف تستخدم هذا الدليل؟</p>
          <ol className="mt-5 grid gap-4 text-sm leading-7 text-slate-300">
            <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-400/15 text-xs font-black text-violet-100">1</span><span>ابحث باسم الأداة أو ابدأ من الفئة التي تطابق المهمة.</span></li>
            <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-300/10 text-xs font-black text-cyan-100">2</span><span>افتح الرابط الرسمي واقرأ حدود الخطة والملكية والخصوصية.</span></li>
            <li className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-xs font-black text-emerald-100">3</span><span>جرّب بمشروع صغير واحتفظ بنسخة من ملفك قبل أي تحويل أو تصدير.</span></li>
          </ol>
        </aside>
      </div>
    </section>

    <section id="directory" className="container py-10">
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 md:p-5">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-200" />
          <Input value={search} onChange={event => setSearch(event.target.value)} className="h-12 border-white/10 bg-[#090d20] pr-11 text-white placeholder:text-slate-500" placeholder="ابحث باسم موقع أو مهمة: مراجع، مونتاج، شعار…" aria-label="البحث في المواقع والبدائل المجانية" />
          {search && <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="مسح البحث"><X className="h-4 w-4" /></button>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="تصفية البدائل حسب المهمة">
          <button type="button" aria-pressed={category === ""} onClick={() => setCategory("")} className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${category === "" ? "bg-violet-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>كل المهام</button>
          {freeAlternativeCategories.map(item => {
            const Icon = categoryIcons[item.id];
            return <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition ${category === item.id ? "bg-violet-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}><Icon className="h-3.5 w-3.5" />{item.label}</button>;
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-500">{results.length} من المواقع والبدائل المجانية المنتقاة</p>{hasFilters && <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-bold text-violet-200 transition hover:text-white"><X className="h-3.5 w-3.5" />مسح البحث والفلاتر</button>}</div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {results.map(item => {
          const Icon = categoryIcons[item.category];
          return <article key={item.id} data-alternative-id={item.id} className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_12px_36px_rgba(0,0,0,.12)] transition hover:border-violet-300/40">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-violet-400 via-cyan-300 to-emerald-300" />
            <div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${accentStyles[item.accent]}`}><Icon className="h-3.5 w-3.5" />{getFreeAlternativeCategoryLabel(item.category)}</span><span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-2.5 py-1 text-[11px] font-bold text-emerald-100">مجاني</span></div><h2 className="mt-4 font-display text-2xl font-black text-white" dir="ltr">{item.name}</h2></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-violet-100"><Icon className="h-5 w-5" /></span></div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            <div className="mt-5 grid gap-3 rounded-2xl border border-white/8 bg-[#090d20]/75 p-4 text-sm"><p><span className="font-bold text-violet-200">مناسب لـ: </span><span className="text-slate-300">{item.bestFor}</span></p><p><span className="font-bold text-cyan-200">التوفر: </span><span className="text-slate-300">{item.availability}</span></p></div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-slate-400"><Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-200" />{item.note}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.09]">افتح الموقع الرسمي <ExternalLink className="h-4 w-4" /></a>
          </article>;
        })}
      </div>
      {!results.length && <div className="mt-7 rounded-3xl border border-dashed border-white/15 p-14 text-center"><Image className="mx-auto h-8 w-8 text-violet-300" /><h2 className="mt-4 font-display text-xl font-bold text-white">لا توجد نتائج مطابقة</h2><p className="mt-2 text-sm leading-7 text-slate-400">جرّب كلمة أخرى أو امسح الفلاتر لرؤية كامل الدليل.</p><button onClick={clearFilters} className="mt-4 text-sm font-bold text-violet-200">إعادة ضبط الفلاتر</button></div>}
      <div className="mt-10 rounded-[1.7rem] border border-cyan-300/15 bg-cyan-300/[0.045] p-6 md:flex md:items-center md:justify-between md:gap-8"><div><p className="text-sm font-bold text-cyan-100">هل تبحث عن أداة ذكاء اصطناعي متخصصة؟</p><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">انتقل إلى دليل الأدوات أو استخدم المستشار لاختيار نقطة بداية بحسب المهمة والميزانية ودعم العربية.</p></div><div className="mt-4 flex shrink-0 flex-wrap gap-3 md:mt-0"><Link href="/advisor" className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-400">اختيار الأداة</Link><Link href="/tools" className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:bg-white/10">دليل الأدوات</Link></div></div>
    </section>
  </BlogShell>;
}
