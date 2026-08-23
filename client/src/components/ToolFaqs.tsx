import { trpc } from "@/lib/trpc";
import { HelpCircle } from "lucide-react";

export default function ToolFaqs({ toolId }: { toolId: number }) {
  const { data: faqs } = trpc.engagement.toolFaqs.useQuery({ toolId });
  if (!faqs?.length) return null;
  return <div className="mt-5 border-t border-white/8 pt-4"><p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-300"><HelpCircle className="h-3.5 w-3.5 text-cyan-300" />أسئلة شائعة</p>{faqs.map(faq => <details key={faq.id} className="group border-b border-white/8 py-2.5 last:border-0"><summary className="cursor-pointer list-none text-xs font-semibold text-slate-200">{faq.question}</summary><p className="mt-2 text-xs leading-6 text-slate-400">{faq.answer}</p></details>)}</div>;
}
