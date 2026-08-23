export type SiteNavigationItem = {
  label: string;
  path: string;
};

export const publicNavigationItems: SiteNavigationItem[] = [
  { label: "الكتابة", path: "/sections/writing" },
  { label: "الصور", path: "/sections/photos" },
  { label: "الفيديو", path: "/sections/video" },
  { label: "المقارنات", path: "/sections/comparisons" },
  { label: "الإنتاجية", path: "/sections/productivity" },
  { label: "دليل الأدوات", path: "/tools" },
  { label: "بدائل مجانية", path: "/free-alternatives" },
  { label: "Prompts", path: "/prompts" },
  { label: "المقارنة", path: "/compare" },
  { label: "الأفضل", path: "/best-ai-tools" },
  { label: "محفوظاتي", path: "/saved" },
  { label: "اختيار الأداة", path: "/advisor" },
  { label: "للطلاب", path: "/student-directory" },
];

const primaryPaths = new Set(["/tools", "/prompts", "/compare", "/advisor", "/student-directory"]);

export const primaryNavigationItems = publicNavigationItems.filter(item => primaryPaths.has(item.path));
export const discoveryNavigationItems = publicNavigationItems.filter(item => !primaryPaths.has(item.path));
