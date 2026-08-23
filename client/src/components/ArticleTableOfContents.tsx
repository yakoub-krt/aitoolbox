import type { ArticleHeading } from "@/lib/articleToc";
import { ListTree } from "lucide-react";
import { useEffect, useState } from "react";

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export default function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    setActiveId(headings[0]?.id ?? "");

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav id="article-toc" aria-labelledby="article-toc-title" className="mt-8 scroll-mt-28 rounded-2xl border border-violet-300/20 bg-violet-500/[0.07] p-5 shadow-[0_12px_32px_rgba(0,0,0,.12)]">
      <div className="flex items-center gap-2 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/15 text-violet-200"><ListTree className="h-4 w-4" aria-hidden="true" /></span>
        <div>
          <h2 id="article-toc-title" className="font-display text-base font-bold">محتويات المقال</h2>
          <p className="mt-0.5 text-xs text-slate-400">انتقل مباشرة إلى القسم الذي تحتاجه</p>
        </div>
      </div>
      <ol className="mt-4 grid gap-1.5 border-r border-violet-300/20 pr-3">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id} className={heading.level === 3 ? "mr-3" : ""}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(heading.id)}
                className={`block rounded-lg px-3 py-2 text-sm leading-6 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300/70 ${isActive ? "bg-violet-400/15 font-bold text-violet-100" : "text-slate-300 hover:bg-white/[0.05] hover:text-white"}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
