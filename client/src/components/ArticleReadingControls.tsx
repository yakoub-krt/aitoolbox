import { getArticleReadingProgress, shouldShowReturnToToc } from "@/lib/readingProgress";
import { ArrowUp, ListTree } from "lucide-react";
import { useEffect, useState } from "react";

type ArticleReadingControlsProps = {
  articleId: string;
  tocId: string;
};

export default function ArticleReadingControls({ articleId, tocId }: ArticleReadingControlsProps) {
  const [progress, setProgress] = useState(0);
  const [showReturnButton, setShowReturnButton] = useState(false);

  useEffect(() => {
    const updateReadingState = () => {
      const article = document.getElementById(articleId);
      if (!article) return;

      const articleTop = window.scrollY + article.getBoundingClientRect().top;
      setProgress(getArticleReadingProgress({
        scrollY: window.scrollY,
        articleTop,
        articleHeight: article.offsetHeight,
        viewportHeight: window.innerHeight,
      }));
      setShowReturnButton(shouldShowReturnToToc(window.scrollY, articleTop));
    };

    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);
    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [articleId]);

  const returnToTableOfContents = () => {
    const tableOfContents = document.getElementById(tocId);
    if (!tableOfContents) return;
    const targetTop = window.scrollY + tableOfContents.getBoundingClientRect().top - 104;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-white/10" aria-label="تقدّم القراءة" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full bg-gradient-to-l from-cyan-400 via-violet-400 to-fuchsia-400 transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <button
        type="button"
        onClick={returnToTableOfContents}
        aria-label="العودة إلى أعلى المقال وجدول المحتويات"
        title="العودة إلى جدول المحتويات"
        className={`fixed bottom-5 right-4 z-30 flex h-12 items-center gap-2 rounded-full border border-violet-300/30 bg-[#11162e]/95 px-4 text-sm font-bold text-violet-100 shadow-[0_12px_30px_rgba(0,0,0,.35)] backdrop-blur transition-all duration-200 hover:border-violet-200 hover:bg-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-300/70 active:scale-[.97] sm:right-6 ${showReturnButton ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-400/15"><ArrowUp className="h-4 w-4" aria-hidden="true" /></span>
        <span className="hidden sm:inline">إلى المحتويات</span>
        <ListTree className="h-4 w-4 text-cyan-200 sm:hidden" aria-hidden="true" />
      </button>
    </>
  );
}
