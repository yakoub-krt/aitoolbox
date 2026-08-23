export const freeAlternativeCategories = [
  { id: "image", label: "الصورة والتصميم" },
  { id: "office", label: "الملفات والمكتب" },
  { id: "research", label: "البحث والمراجع" },
  { id: "planning", label: "التخطيط والرسم" },
  { id: "audio", label: "الصوت" },
  { id: "video", label: "الفيديو" },
] as const;

export type FreeAlternativeCategory = (typeof freeAlternativeCategories)[number]["id"];
export type FreeAlternative = {
  id: string;
  name: string;
  url: string;
  category: FreeAlternativeCategory;
  description: string;
  bestFor: string;
  availability: string;
  note: string;
  keywords: string[];
  accent: "violet" | "cyan" | "emerald" | "amber" | "rose" | "indigo";
};

export const freeAlternatives: FreeAlternative[] = [
  {
    id: "photopea", name: "Photopea", url: "https://www.photopea.com/", category: "image",
    description: "محرر صور يعمل في المتصفح لتعديل الصور والطبقات وملفات PSD دون تثبيت برنامج.",
    bestFor: "تعديل سريع لملف تصميم أو صورة قبل نشرها.", availability: "خدمة ويب مجانية للاستخدام الأساسي.",
    note: "راجع سياسة الخصوصية وشروط الاستخدام قبل رفع أي ملف حساس.", keywords: ["photoshop", "psd", "صور", "تصميم", "متصفح"], accent: "cyan",
  },
  {
    id: "gimp", name: "GIMP", url: "https://www.gimp.org/", category: "image",
    description: "برنامج مجاني ومفتوح المصدر لتحرير الصور على أنظمة تشغيل متعددة.",
    bestFor: "تعديل الصور بتفاصيل أكبر والعمل دون اتصال بعد التثبيت.", availability: "برنامج مجاني ومفتوح المصدر.",
    note: "اختر نسخة التنزيل الموافقة لنظامك من الموقع الرسمي فقط.", keywords: ["صور", "تحرير", "تصميم", "مفتوح المصدر"], accent: "violet",
  },
  {
    id: "inkscape", name: "Inkscape", url: "https://inkscape.org/", category: "image",
    description: "أداة مجانية ومفتوحة المصدر للرسم المتجهي والشعارات والرسوم القابلة للتكبير.",
    bestFor: "الأيقونات والرسوم والشعارات البسيطة بصيغة متجهية.", availability: "برنامج مجاني ومفتوح المصدر.",
    note: "احفظ نسخاً من ملفاتك المصدرية قبل تصديرها للنشر.", keywords: ["vector", "شعار", "رسم متجهي", "تصميم"], accent: "emerald",
  },
  {
    id: "libreoffice", name: "LibreOffice", url: "https://www.libreoffice.org/", category: "office",
    description: "حزمة مكتبية مفتوحة المصدر للوثائق والجداول والعروض التقديمية.",
    bestFor: "إنشاء مسودات وتقارير وجداول وعروض دون اشتراك مدفوع.", availability: "حزمة مكتبية مجانية ومفتوحة المصدر.",
    note: "اختبر تنسيق الملف عند مشاركته مع مستخدمي برامج مكتبية أخرى.", keywords: ["documents", "جداول", "عروض", "word", "excel", "office"], accent: "indigo",
  },
  {
    id: "zotero", name: "Zotero", url: "https://www.zotero.org/", category: "research",
    description: "أداة مجانية لتنظيم المراجع والاقتباسات ومواد البحث في مكتبة شخصية.",
    bestFor: "جمع المصادر وكتابة المراجع بطريقة منظمة في بحث أو مشروع.", availability: "أداة مجانية؛ راجع حدود خدمات التخزين الاختيارية عند الحاجة.",
    note: "تأكد دائماً من بيانات المصدر الأصلي قبل إدراج أي استشهاد.", keywords: ["مراجع", "بحث", "citation", "bibliography", "دراسة"], accent: "amber",
  },
  {
    id: "excalidraw", name: "Excalidraw", url: "https://excalidraw.com/", category: "planning",
    description: "لوحة رسم مبسطة في المتصفح للمخططات الأولية والشرح البصري للأفكار.",
    bestFor: "رسم خريطة فكرة أو مخطط تدفق قبل البدء في التصميم أو البرمجة.", availability: "أداة ويب مجانية للرسم والتخطيط.",
    note: "صدّر الرسم أو احفظه بانتظام؛ لا تعتمد على جلسة متصفح مؤقتة وحدها.", keywords: ["مخطط", "رسم", "wireframe", "تخطيط", "أفكار"], accent: "rose",
  },
  {
    id: "audacity", name: "Audacity", url: "https://www.audacityteam.org/", category: "audio",
    description: "برنامج مجاني ومفتوح المصدر لتسجيل الصوت وتحريره على الحاسوب.",
    bestFor: "تنظيف تسجيل صوتي أو قصه وتجهيز مقطع أولي لمحتوى تعليمي.", availability: "برنامج مجاني ومفتوح المصدر.",
    note: "احتفظ بالملف الأصلي قبل تطبيق أي معالجة لا يمكن التراجع عنها.", keywords: ["صوت", "podcast", "تسجيل", "تحرير", "audio"], accent: "cyan",
  },
  {
    id: "kdenlive", name: "Kdenlive", url: "https://kdenlive.org/", category: "video",
    description: "محرر فيديو مجاني ومفتوح المصدر متعدد المنصات للمشروعات البسيطة والمتوسطة.",
    bestFor: "ترتيب اللقطات وإضافة العناوين وتصدير نسخة أولى لفيديو.", availability: "برنامج مجاني ومفتوح المصدر.",
    note: "ابدأ بمشروع قصير، وتحقق من إعدادات التصدير قبل رفع النسخة النهائية.", keywords: ["فيديو", "مونتاج", "editing", "youtube", "تصدير"], accent: "violet",
  },
];

export function getFreeAlternativeCategoryLabel(category: FreeAlternativeCategory) {
  return freeAlternativeCategories.find(item => item.id === category)?.label ?? "أداة مجانية";
}

export function filterFreeAlternatives(category: FreeAlternativeCategory | "", search: string) {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  return freeAlternatives.filter(item => {
    const inCategory = !category || item.category === category;
    const searchable = [item.name, item.description, item.bestFor, item.availability, ...item.keywords].join(" ").toLocaleLowerCase();
    return inCategory && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
}
