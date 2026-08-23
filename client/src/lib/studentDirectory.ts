export type StudentTool = { name: string; url: string; useCase: string; note: string; accent: "violet" | "cyan" | "amber" | "emerald" };
export type StudentSpecialty = { id: "science" | "humanities" | "computing" | "business"; title: string; shortTitle: string; description: string; focus: string[]; tools: StudentTool[] };

export const studentSpecialties: StudentSpecialty[] = [
  {
    id: "science", title: "العلوم والهندسة", shortTitle: "علوم وهندسة", description: "للمسائل، التجارب، النماذج، وفهم المفاهيم الكمية خطوة بخطوة.", focus: ["رياضيات", "فيزياء", "كيمياء", "هندسة"],
    tools: [
      { name: "Wolfram|Alpha", url: "https://www.wolframalpha.com/", useCase: "تحقق من خطوات مسألة أو رسم علاقة رياضية.", note: "لا تنسخ الناتج؛ اشرح كل خطوة بيدك.", accent: "cyan" },
      { name: "Desmos", url: "https://www.desmos.com/calculator", useCase: "ارسم الدوال واستكشف أثر تغيير المتغيرات.", note: "مفيد لفهم الرسم لا لتجاوز الحل.", accent: "violet" },
      { name: "NotebookLM", url: "https://notebooklm.google.com/", useCase: "اسأل عن ملفات محاضراتك أو ملاحظاتك الخاصة.", note: "راجع المصدر قبل اعتماد أي تلخيص.", accent: "emerald" },
    ],
  },
  {
    id: "humanities", title: "الآداب واللغات والعلوم الإنسانية", shortTitle: "لغات وإنسانيات", description: "للتحليل، التلخيص النقدي، الكتابة المسؤولة، وتطوير اللغة.", focus: ["لغة عربية", "لغات", "تاريخ", "فلسفة"],
    tools: [
      { name: "LanguageTool", url: "https://languagetool.org/", useCase: "راجع القواعد والوضوح في مسودتك بعد أن تكتبها بنفسك.", note: "اقبل الاقتراح المناسب فقط وحافظ على صوتك.", accent: "amber" },
      { name: "DeepL", url: "https://www.deepl.com/translator", useCase: "قارن ترجمتين وفهم الجمل الصعبة أو المفردات الجديدة.", note: "لا تسلّم ترجمة آلية بلا مراجعة بشرية.", accent: "cyan" },
      { name: "Perplexity", url: "https://www.perplexity.ai/", useCase: "ابحث عن نقاط انطلاق ومصادر تحتاج إلى قراءة وتحقق.", note: "افتح المصدر الأصلي وتأكد من التاريخ والسياق.", accent: "violet" },
    ],
  },
  {
    id: "computing", title: "البرمجة وعلوم الحاسوب", shortTitle: "برمجة وحوسبة", description: "لتجربة الأفكار، قراءة الشيفرة، وتصحيح الفهم عبر أمثلة صغيرة.", focus: ["برمجة", "خوارزميات", "بيانات", "أمن سيبراني"],
    tools: [
      { name: "GitHub Copilot", url: "https://github.com/features/copilot", useCase: "اطلب شرح دالة أو اختباراً أو تلميحاً لتصحيح خطأ.", note: "اقرأ الشيفرة وشغّل الاختبارات قبل استعمالها.", accent: "violet" },
      { name: "Replit", url: "https://replit.com/", useCase: "نفّذ مثالاً صغيراً وغيّر متغيراً واحداً لتفهم النتيجة.", note: "لا تشغّل شيفرة مجهولة أو تضع أسراراً في مشروع عام.", accent: "emerald" },
      { name: "ChatGPT", url: "https://chatgpt.com/", useCase: "اطلب شرحاً تدريجياً أو أسئلة تقيس فهم الخوارزمية.", note: "تحقق من المخرجات التقنية في الوثائق أو بيئة اختبار.", accent: "cyan" },
    ],
  },
  {
    id: "business", title: "الأعمال والتصميم والعروض", shortTitle: "أعمال وتصميم", description: "لتحويل فكرة أو بحث موثق إلى عرض بصري وخطة مشروع قابلة للمراجعة.", focus: ["إدارة", "تسويق", "تصميم", "عروض"],
    tools: [
      { name: "Canva", url: "https://www.canva.com/", useCase: "اصنع مخططاً بصرياً أو شريحة بسيطة بعد ترتيب الفكرة.", note: "راجع الحقوق والمصادر قبل النشر أو العرض.", accent: "emerald" },
      { name: "Gamma", url: "https://gamma.app/", useCase: "ابدأ هيكل عرض ثم حرره بصوتك وأمثلتك.", note: "تحقق من الحقائق والصور قبل التسليم.", accent: "amber" },
      { name: "Notion", url: "https://www.notion.com/", useCase: "نظم المهام، الملاحظات، وخطة مشروع دراسي صغير.", note: "استخدمه للتنظيم ولا تضع بيانات حساسة.", accent: "violet" },
    ],
  },
];

export function getStudentSpecialty(id: StudentSpecialty["id"]) { return studentSpecialties.find(specialty => specialty.id === id) ?? studentSpecialties[0]; }
export function countStudentTools() { return studentSpecialties.reduce((sum, specialty) => sum + specialty.tools.length, 0); }
