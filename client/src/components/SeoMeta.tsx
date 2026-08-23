import { useEffect } from "react";
import { useLocation } from "wouter";

const publicSiteUrl = "https://aitoolbox-mauve-eight.vercel.app";

type SeoEntry = {
  title: string;
  description: string;
  keywords: string;
};

const seoByPath: Record<string, SeoEntry> = {
  "/": {
    title: "AIToolBox | أدوات الذكاء الاصطناعي بالعربية",
    description: "دليل عربي عملي لاختيار أدوات الذكاء الاصطناعي، المقارنات، الـPrompts، وخطط التعلم للمستخدم العربي.",
    keywords: "أدوات الذكاء الاصطناعي, ذكاء اصطناعي بالعربية, مقارنة أدوات AI, Prompts عربية",
  },
  "/tools": {
    title: "دليل أدوات الذكاء الاصطناعي | AIToolBox",
    description: "قارن أدوات الذكاء الاصطناعي حسب المهمة والتسعير ودعم العربية قبل أن تبدأ أو تدفع.",
    keywords: "دليل أدوات AI, مقارنة ChatGPT Gemini Claude, أدوات ذكاء اصطناعي عربية",
  },
  "/prompts": {
    title: "Prompts عربية وإنجليزية جاهزة | AIToolBox",
    description: "مكتبة Prompts مجانية بالعربية والإنجليزية للكتابة والصور والفيديو والمحتوى.",
    keywords: "Prompts عربية, أوامر ذكاء اصطناعي, Prompt للصور, Prompt للكتابة",
  },
  "/about": {
    title: "من نحن | AIToolBox",
    description: "تعرّف إلى منهج AIToolBox التحريري وهدفه في تبسيط أدوات الذكاء الاصطناعي للمستخدم العربي.",
    keywords: "من نحن AIToolBox, مدونة ذكاء اصطناعي عربية, مراجعة أدوات AI",
  },
  "/contact": {
    title: "اتصل بنا | AIToolBox",
    description: "تواصل مع AIToolBox لإرسال اقتراح محتوى أو تصحيح معلومة أو استفسار عام حول أدوات الذكاء الاصطناعي.",
    keywords: "اتصل بنا AIToolBox, اقتراح مقال ذكاء اصطناعي, تصحيح معلومات AI",
  },
  "/privacy": {
    title: "سياسة الخصوصية | AIToolBox",
    description: "سياسة الخصوصية والبيانات وملفات الارتباط في AIToolBox.",
    keywords: "سياسة الخصوصية, AIToolBox, ملفات تعريف الارتباط",
  },
  "/terms": {
    title: "شروط الاستخدام | AIToolBox",
    description: "شروط استخدام AIToolBox والمحتوى التعليمي والروابط الخارجية.",
    keywords: "شروط الاستخدام, AIToolBox, أدوات الذكاء الاصطناعي",
  },
};

function entryForPath(path: string): SeoEntry {
  if (seoByPath[path]) return seoByPath[path];
  if (path.startsWith("/articles/")) return { title: "مقالات الذكاء الاصطناعي | AIToolBox", description: "مقال عملي بالعربية عن استخدام أدوات الذكاء الاصطناعي بوعي ووضوح.", keywords: "مقالات ذكاء اصطناعي, أدوات AI, ذكاء اصطناعي بالعربية" };
  if (path.startsWith("/sections/")) return { title: "موضوعات الذكاء الاصطناعي | AIToolBox", description: "استكشف موضوعات ومقارنات أدوات الذكاء الاصطناعي باللغة العربية.", keywords: "موضوعات AI, أدوات ذكاء اصطناعي, مقارنة أدوات" };
  return seoByPath["/"];
}

function setMeta(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setProperty(property: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export default function SeoMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location.split("?")[0] || "/";
    const entry = entryForPath(path);
    const canonicalUrl = `${publicSiteUrl}${path}`;
    const isPrivateRoute = path.startsWith("/admin") || path.startsWith("/unsubscribe/");
    document.title = entry.title;
    setMeta("description", entry.description);
    setMeta("keywords", entry.keywords);
    setMeta("robots", isPrivateRoute ? "noindex, nofollow" : "index, follow");
    setProperty("og:title", entry.title);
    setProperty("og:description", entry.description);
    setProperty("og:type", "website");
    setProperty("og:locale", "ar_AR");
    setProperty("og:url", canonicalUrl);
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location]);

  return null;
}
