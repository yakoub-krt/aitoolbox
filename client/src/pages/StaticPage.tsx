import BlogShell from "@/components/BlogShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

const content: Record<string, { eyebrow: string; title: string; body: React.ReactNode }> = {
  "/about": { eyebrow: "عن AIToolBox", title: "نساعدك على اتخاذ قرار تقني أوضح", body: <><p>AIToolBox مدونة عربية مستقلة تشرح أدوات الذكاء الاصطناعي والبرمجيات العملية بلغة مباشرة. نركز على ما يمكن للأداة أن تنجزه فعلاً، وما تحتاجه من مراجعة بشرية، ومن تناسبه.</p><h2>منهجنا</h2><p>نبدأ بالمهمة التي يريد القارئ إنجازها، ثم نقارن الأدوات باستخدام معايير واضحة مثل سهولة الاستخدام، اللغة العربية، الخصوصية، القيمة مقابل السعر، وقيود كل خيار. نراجع المقالات عند تغير المزايا المهمة.</p></> },
  "/privacy": { eyebrow: "الخصوصية", title: "سياسة خصوصية مبسطة", body: <><p>نستخدم بيانات الاستخدام الأساسية لتحسين أداء الموقع وفهم الصفحات المفيدة. لا نبيع بياناتك الشخصية، ولا نطلب منك رفع ملفات حساسة عبر المدونة.</p><h2>رسائل التواصل</h2><p>عند إرسال رسالة، نخزّن الاسم والبريد الإلكتروني ونص الرسالة بهدف الرد والمتابعة. يمكنك طلب حذف رسالتك عبر صفحة التواصل.</p><h2>روابط وخدمات خارجية</h2><p>قد تقودك بعض الروابط إلى مواقع أدوات خارجية لها سياسات خصوصية خاصة بها. نوصي دائماً بمراجعة سياسة الأداة قبل إنشاء حساب أو رفع بيانات.</p></> },
  "/affiliate-disclosure": { eyebrow: "الشفافية", title: "إفصاح الروابط التابعة", body: <><p>قد تحتوي بعض المقالات على روابط إحالة أو روابط تابعة. إذا اشتركت في خدمة أو اشتريت منتجاً عبر أحد هذه الروابط، قد نتلقى عمولة من دون تكلفة إضافية عليك.</p><h2>استقلالية التقييم</h2><p>لا تحدد العمولة ترتيب الأداة أو تقييمها. نوضح الإيجابيات والقيود ونقدّم، كلما أمكن، بديلاً مجانياً أو طريقة يدوية لإنجاز المهمة.</p><h2>كيف نميّز الرابط التابع؟</h2><p>سيظهر إفصاح واضح قرب الرابط أو في بداية المقال الذي يتضمنه، حتى تتمكن من اتخاذ قرارك بشفافية.</p></> },
};

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const submit = trpc.contact.submit.useMutation({ onSuccess: () => { setStatus("وصلت رسالتك بنجاح. سنراجعها في أقرب وقت."); setForm({ name: "", email: "", message: "" }); }, onError: error => setStatus(error.message) });
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStatus(""); submit.mutate(form); }
  return <form onSubmit={handleSubmit} className="mt-9 grid gap-4"><Input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className="h-12 border-white/10 bg-white/[0.04] text-white" placeholder="الاسم" /><Input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className="h-12 border-white/10 bg-white/[0.04] text-white" placeholder="البريد الإلكتروني" /><Textarea required value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} className="min-h-36 border-white/10 bg-white/[0.04] text-white" placeholder="كيف يمكننا مساعدتك؟" /><Button disabled={submit.isPending} className="w-fit bg-violet-500 px-7 hover:bg-violet-400">{submit.isPending ? "جارٍ الإرسال…" : "إرسال الرسالة"}</Button>{status && <p className="text-sm text-violet-200">{status}</p>}</form>;
}

export default function StaticPage() {
  const [location] = useLocation();
  const page = content[location];
  const isContact = location === "/contact";
  const title = isContact ? "تواصل مع فريق AIToolBox" : page?.title ?? "صفحة غير متاحة";
  const eyebrow = isContact ? "التواصل" : page?.eyebrow ?? "AIToolBox";
  return <BlogShell><section className="container max-w-3xl py-16"><p className="text-sm font-semibold text-violet-300">{eyebrow}</p><h1 className="mt-3 font-display text-4xl font-black leading-tight text-white">{title}</h1>{isContact ? <><p className="mt-5 leading-8 text-slate-300">لديك اقتراح لمقال، ملاحظة عن أداة، أو استفسار عام؟ أرسل رسالتك عبر النموذج أدناه.</p><ContactForm /></> : <div className="static-prose mt-9">{page?.body}</div>}</section></BlogShell>;
}
