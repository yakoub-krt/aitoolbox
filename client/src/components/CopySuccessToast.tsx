import { CheckCircle2, Sparkles } from "lucide-react";

export default function CopySuccessToast({ visible, message = "تم نسخ الـPrompt إلى الحافظة" }: { visible: boolean; message?: string }) {
  if (!visible) return null;

  return <div role="status" aria-label={message} aria-live="polite" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-200/40 bg-emerald-500/95 px-4 py-3 text-sm font-bold text-white shadow-[0_16px_38px_rgba(16,185,129,.35)] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"><span className="relative flex h-6 w-6 items-center justify-center"><span className="absolute inset-0 rounded-full bg-white/30 animate-ping motion-reduce:animate-none" /><CheckCircle2 className="relative h-5 w-5" /><Sparkles className="absolute -left-2 -top-2 h-3 w-3 text-emerald-100" /></span>{message}</div>;
}
