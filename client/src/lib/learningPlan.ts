export type LearningPlanResource = { label: string; href: string; external?: boolean };

export type LearningDay = {
  id: number;
  icon: "shield" | "prompt" | "study" | "write" | "image" | "video" | "workflow";
  title: string;
  focus: string;
  duration: string;
  outcome: string;
  task: string;
  check: string;
  safetyNote?: string;
  resources: LearningPlanResource[];
};

export const learningPlanDays: LearningDay[] = [
  { id: 1, icon: "shield", title: "ابدأ بذكاء وأمان", focus: "اختيار مهمة واحدة وفهم حدود الأداة", duration: "20 دقيقة", outcome: "مهمة واضحة وقاعدة خصوصية شخصية", task: "اختر مهمة حقيقية صغيرة تريد تسريعها، مثل تلخيص درس أو كتابة رسالة. اكتب ما الذي تريد إنجازه، لمن، وما شكل النتيجة التي تحتاجها.", check: "أنشئ قاعدة بسيطة: لا تضع كلمات مرور أو معلومات مالية أو بيانات أشخاص حساسة داخل أي أداة.", safetyNote: "اعتبر الناتج مسودة تساعدك على التفكير، لا حقيقة جاهزة دائماً.", resources: [{ label: "دليل الخصوصية واختيار الأداة", href: "/articles/ai-privacy-guide" }, { label: "دليل الأدوات", href: "/tools" }] },
  { id: 2, icon: "prompt", title: "اكتب Prompt واضحاً", focus: "السياق، الهدف، والشكل المطلوب", duration: "25 دقيقة", outcome: "Prompt قابل لإعادة الاستعمال", task: "اكتب طلباً من أربع أجزاء: الدور، المهمة، السياق، وشكل النتيجة. جرّبه مرتين ثم حسّن جزءاً واحداً فقط في كل مرة.", check: "اطلب نتيجة في جدول أو نقاط أو خطوات عندما يكون الشكل مهماً لك.", resources: [{ label: "دليل الكتابة بالعربية", href: "/articles/ai-writing-arabic" }, { label: "مكتبة Prompts", href: "/prompts" }, { label: "مخصّص الـPrompt", href: "/prompt-customizer" }] },
  { id: 3, icon: "study", title: "تعلّم وتلخيص بوعي", focus: "فهم النص قبل الاعتماد على الملخص", duration: "30 دقيقة", outcome: "ملخص منظم وأسئلة مراجعة", task: "اختر نصاً قصيراً غير حساس. اطلب ملخصاً من خمس نقاط ثم اطلب ثلاثة أسئلة مراجعة. قارن نقطتين على الأقل مع النص الأصلي.", check: "ضع علامة على أي معلومة لا تستطيع التحقق منها من المصدر الأصلي.", resources: [{ label: "تلخيص PDF والمحاضرات", href: "/articles/ai-pdf-summary-tools" }, { label: "أدوات للطلاب", href: "/articles/ai-tools-for-students" }] },
  { id: 4, icon: "write", title: "اكتب ثم حرّر", focus: "تحويل المسودة إلى نص أفضل", duration: "35 دقيقة", outcome: "قطعة قصيرة بعد مراجعة بشرية", task: "أنشئ مخططاً لمقال أو رسالة أو وصف خدمة، ثم اطلب مسودة أولى. راجع الأسماء والأرقام والأسلوب بنفسك، وأعد الصياغة لتشبه لغتك.", check: "لا تنشر نصاً دون قراءة نهائية وتصحيح الادعاءات والأمثلة.", resources: [{ label: "مقال متكامل من المُخصّص", href: "/prompt-customizer" }, { label: "أدوات المستقلين", href: "/articles/ai-tools-for-freelancers" }] },
  { id: 5, icon: "image", title: "اصنع فكرة بصرية", focus: "وصف الصورة والغرض منها", duration: "30 دقيقة", outcome: "وصف بصري قابل للتعديل", task: "اختر فكرة لمنشور أو منتج. حدّد الموضوع، الأسلوب، الإضاءة، ونسبة العرض. أنشئ نسخة أولى ثم غيّر عنصراً واحداً مثل الخلفية أو التكوين.", check: "لا تستخدم صور الأشخاص أو العلامات التجارية بطريقة توحي بموافقتهم إن لم تكن تملك الحق.", resources: [{ label: "دليل توليد الصور", href: "/articles/ai-image-tools" }, { label: "Prompts الصور", href: "/prompts?category=image_generation" }] },
  { id: 6, icon: "video", title: "خطّط لمقطع قصير", focus: "فكرة، سيناريو، ومراجعة المشهد", duration: "35 دقيقة", outcome: "سيناريو قصير قابل للتصوير أو التوليد", task: "اكتب فكرة فيديو مدتها 30 ثانية، ثم استخدم قالب Reel لصياغة خطاف و3 نقاط ومشاهد مقترحة. راجع الزمن والنص الظاهر قبل التنفيذ.", check: "تحقق من حقوق الصوت والصور، واذكر بوضوح عند الحاجة أن المحتوى مولّد أو محرر بالذكاء الاصطناعي.", resources: [{ label: "أدوات الفيديو والصوت", href: "/articles/ai-video-audio-tools" }, { label: "سيناريو Reel من المُخصّص", href: "/prompt-customizer" }] },
  { id: 7, icon: "workflow", title: "ابنِ سير عملك الأول", focus: "اختيار أداة واحدة وتقييم النتيجة", duration: "40 دقيقة", outcome: "سير عمل صغير يمكن تكراره", task: "اختر مهمة متكررة من أسبوعك. حدد المدخلات والخطوات والمراجعة البشرية والنتيجة النهائية. جرّب أداة واحدة فقط وقارن بين النتيجة والوقت الذي وفرته فعلاً.", check: "احتفظ بما نجح، وعدّل ما لم ينجح. لا تحتاج إلى أتمتة كل شيء دفعة واحدة.", resources: [{ label: "مستشار اختيار الأداة", href: "/advisor" }, { label: "مقارنة ChatGPT وGemini وClaude", href: "/articles/chatgpt-gemini-claude-comparison" }, { label: "أدوات الإنتاجية", href: "/articles/ai-productivity-tools" }] },
];

export const learningProgressKey = "aitoolbox-learning-plan-v1";

export function normalizeCompletedDays(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(day => Number.isInteger(day) && day >= 1 && day <= learningPlanDays.length))).sort((a, b) => a - b);
}

export function toggleCompletedDay(days: number[], day: number): number[] {
  return days.includes(day) ? days.filter(item => item !== day) : normalizeCompletedDays([...days, day]);
}

export function calculateLearningProgress(days: number[]): number {
  return Math.round((normalizeCompletedDays(days).length / learningPlanDays.length) * 100);
}
