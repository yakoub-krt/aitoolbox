import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ExternalLink, Scale } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "wouter";

const labels = {
  category: { writing: "الكتابة", images: "الصور", video: "الفيديو", productivity: "الإنتاجية", research: "البحث" },
  price: { free: "مجاني", freemium: "خطة مجانية", paid: "مدفوع" },
  arabic: { yes: "يدعم العربية", partial: "دعم جزئي", unknown: "تحقق قبل الاستخدام" },
};

export default function CompareToolsPage() {
  const [location] = useLocation();
  const slugs = useMemo(() => (new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("tools") ?? "").split(",").filter(Boolean).slice(0, 3), [location]);
  const { data, isLoading } = trpc.tools.compare.useQuery({ slugs }, { enabled: slugs.length >= 2 });
  const tools = data?.filter((tool): tool is NonNullable<typeof tool> => tool !== undefined) ?? [];

  if (slugs.length < 2) return <BlogShell><section className="container py-24 text-center"><Scale className="mx-auto h-10 w-10 text-violet-300" /><h1 className="mt-5 font-display text-3xl font-black text-white">اختر أداتين للمقارنة</h1><p className="mt-3 text-slate-400">ارجع إلى الدليل واختر أداتين أو ثلاثاً، ثم اضغط زر المقارنة.</p><Button asChild className="mt-6 bg-violet-500 hover:bg-violet-400"><Link href="/tools">فتح دليل الأدوات</Link></Button></section></BlogShell>;

  const rows = [
    { label: "الفئة", value: (tool: typeof tools[number]) => labels.category[tool.category] },
    { label: "التسعير", value: (tool: typeof tools[number]) => labels.price[tool.priceModel] },
    { label: "العربية", value: (tool: typeof tools[number]) => labels.arabic[tool.arabicSupport] },
    { label: "الأفضل لـ", value: (tool: typeof tools[number]) => tool.bestFor },
    { label: "ملاحظات عملية", value: (tool: typeof tools[number]) => tool.editorialNotes },
    { label: "قيود يجب معرفتها", value: (tool: typeof tools[number]) => tool.limitations },
  ];

  return <BlogShell><section className="border-b border-white/8 bg-[radial-gradient(circle_at_15%_0%,rgba(139,92,246,.20),transparent_35%)]"><div className="container py-14"><Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-200"><ArrowRight className="h-4 w-4" />العودة إلى الدليل</Link><h1 className="mt-5 font-display text-4xl font-black text-white">مقارنة الأدوات</h1><p className="mt-3 text-slate-300">مقارنة حقائق الاستخدام والتسعير ودعم العربية، وليست تقييماً للمستخدمين أو ترتيباً مدفوعاً.</p></div></section><section className="container py-10">{isLoading ? <div className="h-96 animate-pulse rounded-3xl bg-white/5" /> : tools.length ? <div className="overflow-x-auto rounded-3xl border border-white/10"><table className="min-w-[760px] w-full border-collapse text-right"><thead><tr className="bg-white/[0.04]"><th className="p-5 text-sm text-slate-400">المعيار</th>{tools.map(tool => <th key={tool.id} className="p-5"><p className="font-display text-xl font-black text-white">{tool.name}</p><a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-cyan-200">الموقع الرسمي <ExternalLink className="h-3 w-3" /></a></th>)}</tr></thead><tbody className="divide-y divide-white/10">{rows.map(row => <tr key={row.label}><th className="w-40 bg-white/[0.02] p-5 align-top text-sm font-bold text-violet-200">{row.label}</th>{tools.map(tool => <td key={tool.id} className="p-5 align-top text-sm leading-7 text-slate-300">{row.value(tool)}</td>)}</tr>)}</tbody></table></div> : <div className="rounded-3xl border border-dashed border-white/15 p-14 text-center text-slate-400">لم نجد الأدوات المختارة. ارجع إلى الدليل وحاول مرة أخرى.</div>}</section></BlogShell>;
}
