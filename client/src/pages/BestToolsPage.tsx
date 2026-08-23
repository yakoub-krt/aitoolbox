import BlogShell from "@/components/BlogShell";
import SaveButton from "@/components/SaveButton";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "wouter";

const categories = [
  { key: "writing", title: "للكتابة", description: "للمسودات والتحرير والتلخيص وصياغة الأفكار." },
  { key: "images", title: "للصور والتصميم", description: "للتصميم وتوليد الصور وتجهيز المخرجات البصرية." },
  { key: "video", title: "للفيديو", description: "للتحرير وإنشاء المقاطع وعمليات الإنتاج المرئي." },
  { key: "productivity", title: "للإنتاجية", description: "لتنظيم المعرفة والمهام وسير العمل." },
  { key: "research", title: "للبحث", description: "للبحث والاستكشاف وتجميع المعرفة." },
] as const;

export default function BestToolsPage() {
  const { data: tools, isLoading } = trpc.tools.list.useQuery();
  return <BlogShell><section className="border-b border-white/8 bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,.15),transparent_32%),radial-gradient(circle_at_15%_20%,rgba(139,92,246,.22),transparent_35%)]"><div className="container max-w-5xl py-16"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100"><Sparkles className="h-3.5 w-3.5" />اختيارات تحريرية محدثة</span><h1 className="mt-5 font-display text-4xl font-black leading-tight text-white md:text-5xl">أفضل أدوات الذكاء الاصطناعي لعام 2026</h1><p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">نقطة بداية منظمة لاختيار الأداة حسب المهمة. هذه القائمة تستند إلى المعلومات الفعلية في دليل AIToolBox، ولا تستخدم تقييمات مستخدمين أو ترتيباً مدفوعاً.</p><Button asChild variant="outline" className="mt-7 border-white/15 bg-white/[0.03] text-white hover:bg-white/10"><Link href="/tools">تصفّح الدليل كاملاً <ArrowLeft className="mr-2 h-4 w-4" /></Link></Button></div></section><section className="container max-w-5xl py-12">{isLoading ? <div className="space-y-5">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-3xl bg-white/5" />)}</div> : <div className="space-y-10">{categories.map(category => { const group = tools?.filter(tool => tool.category === category.key) ?? []; if (!group.length) return null; return <section key={category.key}><div className="mb-5"><h2 className="font-display text-2xl font-black text-white">{category.title}</h2><p className="mt-1 text-sm text-slate-400">{category.description}</p></div><div className="grid gap-4 md:grid-cols-2">{group.map(tool => <article key={tool.id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-xl font-black text-white">{tool.name}</h3><p className="mt-2 text-sm leading-7 text-slate-300">{tool.shortDescription}</p></div><SaveButton item={{ kind: "tool", id: tool.id, label: tool.name, href: "/tools" }} /></div><p className="mt-4 text-sm font-bold text-violet-200">مناسب لـ: <span className="font-normal text-slate-300">{tool.bestFor}</span></p><p className="mt-3 text-xs leading-6 text-slate-400">{tool.limitations}</p><a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-200 hover:text-white">الموقع الرسمي <ExternalLink className="h-3.5 w-3.5" /></a></article>)}</div></section>; })}</div>}</section></BlogShell>;
}
