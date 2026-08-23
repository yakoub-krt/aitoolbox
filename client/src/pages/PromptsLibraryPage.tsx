import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { copyPromptText } from "@/lib/promptCopy";
import { trpc } from "@/lib/trpc";
import { Check, Clapperboard, Copy, Image, Megaphone, Sparkles, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";

const categoryLabels = {
  image_to_video: "صورة إلى فيديو",
  image_generation: "توليد الصور",
  image_editing: "تعديل الصور",
  short_video: "فيديو قصير",
  marketing: "إعلانات ومنتجات",
};

const categoryIcons = {
  image_to_video: Clapperboard,
  image_generation: Wand2,
  image_editing: Image,
  short_video: Sparkles,
  marketing: Megaphone,
};

type Category = keyof typeof categoryLabels;
type Language = "ar" | "en";

export default function PromptsLibraryPage() {
  const [category, setCategory] = useState<"" | Category>("");
  const [language, setLanguage] = useState<"" | Language>("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const queryInput = useMemo(() => ({ category: category || undefined, language: language || undefined }), [category, language]);
  const { data: prompts, isLoading, error } = trpc.prompts.list.useQuery(queryInput);

  async function copyPrompt(id: number, text: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard-unavailable");
      await copyPromptText(text, value => navigator.clipboard.writeText(value));
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(current => current === id ? null : current), 1800);
    } catch {
      setCopiedId(null);
    }
  }

  return <BlogShell>
    <section className="border-b border-white/8 bg-[radial-gradient(circle_at_76%_10%,rgba(34,211,238,.16),transparent_27%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,.22),transparent_34%)]">
      <div className="container grid gap-8 py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-100"><Sparkles className="h-3.5 w-3.5" />مجاناً في الإطلاق</div>
          <p className="mt-5 text-sm font-semibold text-violet-300">مكتبة AIToolBox</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-tight text-white md:text-5xl">Prompts عربية وإنجليزية جاهزة للتجربة</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">اختر المهمة، انسخ الـPrompt، ثم عدّل ما بين الأقواس ليناسب منتجك أو فكرتك أو الفيديو الذي تريد صنعه. جميع العناصر الظاهرة مجانية الآن.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#0d1228]/75 p-5 shadow-[0_16px_45px_rgba(0,0,0,.22)]">
          <p className="text-sm font-bold text-white">طريقة استعمال سريعة</p>
          <ol className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <li className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-400/15 text-xs font-black text-violet-100">1</span>اختر الـPrompt الأقرب لمهمتك.</li>
            <li className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-400/15 text-xs font-black text-violet-100">2</span>بدّل النص الموجود بين الأقواس بالمعلومات الخاصة بك.</li>
            <li className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-400/15 text-xs font-black text-violet-100">3</span>انسخه إلى الأداة المناسبة وراجع الناتج قبل نشره.</li>
          </ol>
        </div>
      </div>
    </section>

    <section className="container py-9">
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="تصفية المجال">
            <button onClick={() => setCategory("")} className={`rounded-full px-3.5 py-2 text-sm font-bold transition ${category === "" ? "bg-violet-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>كل المهام</button>
            {(Object.entries(categoryLabels) as [Category, string][]).map(([value, label]) => {
              const Icon = categoryIcons[value];
              return <button key={value} onClick={() => setCategory(value)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold transition ${category === value ? "bg-violet-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}><Icon className="h-3.5 w-3.5" />{label}</button>;
            })}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#090d20] p-1" aria-label="تصفية اللغة">
            <button onClick={() => setLanguage("")} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${language === "" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>الكل</button>
            <button onClick={() => setLanguage("ar")} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${language === "ar" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>العربية</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-3 py-2 text-xs font-bold transition ${language === "en" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>English</button>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-500">{prompts?.length ?? 0} Prompts مجانية متاحة الآن</p>
      </div>

      <div className="mt-8">
        {isLoading ? <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-3xl bg-white/[0.045]" />)}</div> : error ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/5 p-10 text-center text-rose-100">تعذر تحميل مكتبة الـPrompts حالياً.</div> : prompts?.length ? <div className="grid gap-5 lg:grid-cols-2">{prompts.map(prompt => {
          const Icon = categoryIcons[prompt.category];
          const copied = copiedId === prompt.id;
          return <article key={prompt.id} className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_12px_36px_rgba(0,0,0,.12)] transition hover:border-violet-300/40">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${prompt.colorTone === "cyan" ? "from-cyan-300 to-blue-600" : prompt.colorTone === "fuchsia" ? "from-fuchsia-400 to-violet-600" : prompt.colorTone === "rose" ? "from-rose-400 to-orange-400" : prompt.colorTone === "indigo" ? "from-indigo-300 to-cyan-500" : "from-violet-300 to-indigo-600"}`} />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300"><Icon className="h-3.5 w-3.5 text-violet-200" />{categoryLabels[prompt.category]}</span><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-bold text-emerald-100">مجاني</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-400">{prompt.language === "ar" ? "العربية" : "English"}</span></div><h2 dir={prompt.language === "en" ? "ltr" : "rtl"} className={`mt-4 font-display text-2xl font-black text-white ${prompt.language === "en" ? "text-left" : "text-right"}`}>{prompt.title}</h2></div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-400/10 text-violet-200"><Icon className="h-5 w-5" /></span>
            </div>
            <p dir={prompt.language === "en" ? "ltr" : "rtl"} className={`mt-4 text-sm leading-7 text-slate-300 ${prompt.language === "en" ? "text-left" : "text-right"}`}>{prompt.description}</p>
            <p className="mt-4 text-sm font-bold text-violet-200">{prompt.language === "ar" ? "مناسب لـ: " : "Best for: "}<span className="font-normal text-slate-300">{prompt.useCase}</span></p>
            <pre dir={prompt.language === "en" ? "ltr" : "rtl"} className={`mt-5 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#080b1b] p-4 font-sans text-sm leading-7 text-slate-200 ${prompt.language === "en" ? "text-left" : "text-right"}`}>{prompt.promptText}</pre>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-6 text-slate-500">{prompt.toolHint}</p><Button onClick={() => copyPrompt(prompt.id, prompt.promptText)} className={`shrink-0 ${copied ? "bg-emerald-500 hover:bg-emerald-500" : "bg-violet-500 hover:bg-violet-400"}`}>{copied ? <><Check className="ml-2 h-4 w-4" />تم النسخ</> : <><Copy className="ml-2 h-4 w-4" />نسخ الـPrompt</>}</Button></div>
          </article>;
        })}</div> : <div className="rounded-3xl border border-dashed border-white/15 p-14 text-center"><Sparkles className="mx-auto h-8 w-8 text-violet-300" /><h2 className="mt-4 font-display text-xl font-bold text-white">لا توجد Prompts مطابقة</h2><button onClick={() => { setCategory(""); setLanguage(""); }} className="mt-3 text-sm text-violet-200">إعادة ضبط الفلاتر</button></div>}
      </div>
    </section>
  </BlogShell>;
}
