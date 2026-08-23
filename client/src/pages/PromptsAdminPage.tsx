import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Plus, ShieldAlert, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";

type PromptForm = {
  id?: number;
  title: string;
  slug: string;
  category: "image_to_video" | "image_generation" | "image_editing" | "short_video" | "marketing" | "writing";
  language: "ar" | "en";
  useCase: string;
  description: string;
  promptText: string;
  toolHint: string;
  isFree: boolean;
  isPublished: boolean;
  colorTone: "violet" | "cyan" | "indigo" | "fuchsia" | "rose";
  sortOrder: number;
};

const blank: PromptForm = { title: "", slug: "", category: "image_to_video", language: "ar", useCase: "", description: "", promptText: "", toolHint: "", isFree: true, isPublished: true, colorTone: "violet", sortOrder: 100 };
const categories = { image_to_video: "صورة إلى فيديو", image_generation: "توليد الصور", image_editing: "تعديل الصور", short_video: "فيديو قصير", marketing: "إعلانات ومنتجات", writing: "كتابة ومقالات" };

function Content() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const [form, setForm] = useState<PromptForm>(blank);
  const [message, setMessage] = useState("");
  const { data: prompts } = trpc.prompts.adminList.useQuery(undefined, { enabled: isAdmin });
  const create = trpc.prompts.create.useMutation({ onSuccess: () => { setForm(blank); setMessage("تمت إضافة الـPrompt."); utils.prompts.adminList.invalidate(); utils.prompts.list.invalidate(); } });
  const update = trpc.prompts.update.useMutation({ onSuccess: () => { setForm(blank); setMessage("تم تحديث الـPrompt."); utils.prompts.adminList.invalidate(); utils.prompts.list.invalidate(); } });
  const remove = trpc.prompts.delete.useMutation({ onSuccess: () => { utils.prompts.adminList.invalidate(); utils.prompts.list.invalidate(); } });

  if (loading) return <div className="p-10 text-slate-400">جارٍ التحقق من الحساب…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-xl rounded-3xl border border-rose-400/20 bg-rose-400/5 p-8 text-center"><ShieldAlert className="mx-auto h-9 w-9 text-rose-300" /><h1 className="mt-4 font-display text-2xl font-bold text-white">إدارة Prompts للمشرف فقط</h1></div>;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = { ...form };
    delete data.id;
    if (form.id) update.mutate({ id: form.id, data });
    else create.mutate(data);
  }

  return <div className="mx-auto max-w-6xl space-y-8" dir="rtl">
    <div><p className="text-sm font-semibold text-violet-300">مكتبة AIToolBox</p><h1 className="mt-1 font-display text-3xl font-black text-white">إدارة Prompts</h1><p className="mt-2 text-sm text-slate-400">أنشئ Prompts عربية أو إنجليزية وحدد وصولها المجاني الآن، مع إمكان تحويلها لاحقاً إلى محتوى Pro.</p></div>
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2"><Input required value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className="border-white/10 bg-[#080b1c] text-white" placeholder="عنوان الـPrompt" /><Input required dir="ltr" value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") })} className="border-white/10 bg-[#080b1c] text-white" placeholder="prompt-slug" /></div>
        <div className="grid gap-4 md:grid-cols-4"><select value={form.category} onChange={event => setForm({ ...form, category: event.target.value as PromptForm["category"] })} className="h-10 rounded-md border border-white/10 bg-[#080b1c] px-3 text-sm text-white">{Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><select value={form.language} onChange={event => setForm({ ...form, language: event.target.value as PromptForm["language"] })} className="h-10 rounded-md border border-white/10 bg-[#080b1c] px-3 text-sm text-white"><option value="ar">العربية</option><option value="en">English</option></select><select value={form.colorTone} onChange={event => setForm({ ...form, colorTone: event.target.value as PromptForm["colorTone"] })} className="h-10 rounded-md border border-white/10 bg-[#080b1c] px-3 text-sm text-white"><option value="violet">بنفسجي</option><option value="cyan">سماوي</option><option value="indigo">نيلي</option><option value="fuchsia">فوشي</option><option value="rose">وردي</option></select><Input required type="number" min={0} value={form.sortOrder} onChange={event => setForm({ ...form, sortOrder: Number(event.target.value) })} className="border-white/10 bg-[#080b1c] text-white" placeholder="ترتيب العرض" /></div>
        <Input required value={form.useCase} onChange={event => setForm({ ...form, useCase: event.target.value })} className="border-white/10 bg-[#080b1c] text-white" placeholder="أفضل استخدام أو حالة استعمال" />
        <Textarea required value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className="border-white/10 bg-[#080b1c] text-white" placeholder="وصف مختصر لما ينجزه الـPrompt" />
        <Textarea required value={form.promptText} onChange={event => setForm({ ...form, promptText: event.target.value })} className="min-h-48 border-white/10 bg-[#080b1c] text-white" placeholder="نص الـPrompt كاملاً" />
        <Input required value={form.toolHint} onChange={event => setForm({ ...form, toolHint: event.target.value })} className="border-white/10 bg-[#080b1c] text-white" placeholder="ملاحظة عن الأداة المناسبة" />
        <div className="flex flex-wrap gap-5 text-sm text-slate-300"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isFree} onChange={event => setForm({ ...form, isFree: event.target.checked })} />مجاني حالياً</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublished} onChange={event => setForm({ ...form, isPublished: event.target.checked })} />منشور للعامة</label></div>
        <div className="flex flex-wrap items-center gap-3"><Button disabled={create.isPending || update.isPending} className="bg-violet-500 hover:bg-violet-400"><Plus className="ml-2 h-4 w-4" />{form.id ? "حفظ التعديل" : "إضافة Prompt"}</Button>{form.id && <Button type="button" variant="outline" onClick={() => setForm(blank)} className="border-white/15 text-slate-200">إلغاء</Button>}{message && <span className="text-sm text-emerald-200">{message}</span>}</div>
      </form>
    </section>
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"><div className="border-b border-white/10 px-6 py-5"><h2 className="font-display text-xl font-bold text-white">Prompts الحالية</h2></div>{prompts?.map(prompt => <div key={prompt.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-6 py-4 last:border-0"><div><p className="font-bold text-white">{prompt.title}</p><p className="mt-1 text-xs text-slate-500">/{prompt.slug} · {prompt.language} · {prompt.isFree ? "مجاني" : "Pro"} · {prompt.isPublished ? "منشور" : "مسودة"}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm({ id: prompt.id, title: prompt.title, slug: prompt.slug, category: prompt.category, language: prompt.language, useCase: prompt.useCase, description: prompt.description, promptText: prompt.promptText, toolHint: prompt.toolHint, isFree: prompt.isFree, isPublished: prompt.isPublished, colorTone: prompt.colorTone as PromptForm["colorTone"], sortOrder: prompt.sortOrder })} className="border-white/15 text-slate-200">تعديل</Button><Button size="sm" variant="outline" onClick={() => { if (confirm(`حذف ${prompt.title}؟`)) remove.mutate({ id: prompt.id }); }} className="border-rose-400/20 text-rose-200"><Trash2 className="ml-1 h-3.5 w-3.5" />حذف</Button></div></div>)}</section>
  </div>;
}

export default function PromptsAdminPage() { return <DashboardLayout><Content /></DashboardLayout>; }
