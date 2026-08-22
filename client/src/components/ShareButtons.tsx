import { canUseNativeShare, copyShareLink, createShareLinks, shareWithNativeDialog } from "@/lib/shareLinks";
import { Check, Copy, Facebook, Linkedin, MessageCircle, Send, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ShareButtonsProps = {
  title: string;
  path: string;
};

const shareOptions = [
  { key: "x" as const, label: "X", icon: Send, className: "hover:border-slate-200 hover:bg-slate-100 hover:text-slate-950" },
  { key: "facebook" as const, label: "Facebook", icon: Facebook, className: "hover:border-blue-300 hover:bg-blue-500 hover:text-white" },
  { key: "linkedin" as const, label: "LinkedIn", icon: Linkedin, className: "hover:border-sky-300 hover:bg-sky-600 hover:text-white" },
  { key: "whatsapp" as const, label: "WhatsApp", icon: MessageCircle, className: "hover:border-emerald-300 hover:bg-emerald-500 hover:text-white" },
];

export default function ShareButtons({ title, path }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);
  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;
  const links = useMemo(() => createShareLinks(title, url), [title, url]);

  useEffect(() => {
    setNativeShareAvailable(canUseNativeShare(navigator));
  }, []);

  async function copyArticleLink() {
    try {
      await copyShareLink(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  async function openNativeShareDialog() {
    try {
      await shareWithNativeDialog(
        { title, text: `اقرأ هذا المقال من AIToolBox: ${title}`, url },
        navigator.share?.bind(navigator),
      );
    } catch {
      // إلغاء المستخدم لواجهة المشاركة ليس خطأً يحتاج إلى تنبيه؛ تبقى البدائل ظاهرة دائماً.
    }
  }

  return (
    <div className="mt-7 flex flex-wrap items-center gap-2" aria-label="مشاركة المقال">
      <span className="ml-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Share2 className="h-4 w-4 text-violet-300" />شارك المقال</span>
      {nativeShareAvailable && <button type="button" onClick={openNativeShareDialog} className="flex h-9 items-center gap-1.5 rounded-xl border border-violet-300/35 bg-violet-400/10 px-3 text-xs font-bold text-violet-100 transition hover:bg-violet-400/20 md:hidden" aria-label="فتح خيارات المشاركة في الهاتف"><Share2 className="h-4 w-4" />مشاركة</button>}
      {shareOptions.map(option => {
        const Icon = option.icon;
        return (
          <a
            key={option.key}
            href={links[option.key]}
            target="_blank"
            rel="noopener noreferrer"
            title={`المشاركة عبر ${option.label}`}
            aria-label={`مشاركة المقال عبر ${option.label}`}
            className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition duration-200 ${option.className}`}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
      <button
        type="button"
        onClick={copyArticleLink}
        title="نسخ رابط المقال"
        aria-label="نسخ رابط المقال"
        className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-slate-300 transition hover:border-violet-300/60 hover:bg-violet-400/10 hover:text-violet-100"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
        {copied ? "تم النسخ" : "نسخ الرابط"}
      </button>
    </div>
  );
}
