import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { BellRing, CheckCircle2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setEmail("");
      setConsent(false);
      setMessage("تم تسجيل بريدك في قائمة تحديثات AIToolBox.");
    },
    onError: () => setMessage("تعذر تسجيل الاشتراك الآن. يرجى المحاولة لاحقاً."),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    subscribe.mutate({ email, consent: true });
  }

  return <div className={compact ? "mt-5" : "relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-l from-violet-500/16 via-[#15132f] to-[#0b1022] p-7 md:p-10"}>
    {!compact && <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full border border-cyan-300/20" />}
    <div className={compact ? "" : "relative max-w-2xl"}>
      {!compact && <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-400/10 px-3 py-1 text-xs font-bold text-violet-200"><BellRing className="h-3.5 w-3.5" />تحديثات عملية من دون إزعاج</span>}
      <h2 className={compact ? "text-base font-bold text-white" : "font-display text-2xl font-black text-white md:text-3xl"}>{compact ? "تابع أحدث الأدوات والمقارنات" : "صلك الجديد في الذكاء الاصطناعي أولاً"}</h2>
      <p className={compact ? "mt-2 text-xs leading-6 text-slate-400" : "mt-3 text-sm leading-7 text-slate-300"}>{compact ? "مقالات وأدوات ومقارنات جديدة في رسالة واضحة، مع خيار إلغاء الاشتراك دائماً." : "سجّل بريدك لتصلك مقالات وأدوات ومقارنات جديدة من AIToolBox. لا نطلب منك كلمة مرور أو معلومات مالية، ويمكنك إلغاء الاشتراك متى شئت."}</p>
      <form onSubmit={submit} className={compact ? "mt-4 flex gap-2" : "mt-6 flex flex-col gap-3 sm:flex-row"}>
        <div className="relative flex-1"><Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="h-11 border-white/10 bg-[#090d20]/80 pr-9 text-sm text-white placeholder:text-slate-500 focus-visible:ring-violet-400" placeholder="بريدك الإلكتروني" aria-label="البريد الإلكتروني للاشتراك" /></div>
        <Button disabled={subscribe.isPending || !consent} className="h-11 bg-violet-500 px-5 text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60">{subscribe.isPending ? "جارٍ التسجيل…" : "اشترك مجاناً"}</Button>
      </form>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-[11px] leading-5 text-slate-400"><input required checked={consent} onChange={event => setConsent(event.target.checked)} type="checkbox" className="mt-1 h-3.5 w-3.5 rounded border-white/20 bg-[#090d20] accent-violet-400" /><span>أوافق على حفظ بريدي لتلقي تحديثات AIToolBox وفق <Link href="/privacy" className="text-violet-300 underline underline-offset-2">سياسة الخصوصية</Link>.</span></label>
      {message && <p role="status" className="mt-3 flex items-center gap-1.5 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" />{message}</p>}
    </div>
  </div>;
}
