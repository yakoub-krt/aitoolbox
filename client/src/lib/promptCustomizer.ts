export type CustomizerTemplate = "product_video" | "product_ad" | "educational_reel";
export type CustomizerLanguage = "ar" | "en";

export type PromptCustomizerValues = {
  product: string;
  duration: string;
  format: string;
  cameraMove: string;
  background: string;
  placement: string;
  topic: string;
  tone: string;
  callToAction: string;
};

export const customizerTemplates: Record<CustomizerTemplate, { label: string; description: string }> = {
  product_video: { label: "صورة منتج إلى فيديو", description: "فيديو إعلاني قصير من صورة منتج" },
  product_ad: { label: "صورة إعلان لمنتج", description: "فكرة صورة تجارية مع مساحة للنص" },
  educational_reel: { label: "سيناريو Reel تعليمي", description: "فيديو قصير بخطاف ونقاط ومشاهد" },
};

export const defaultCustomizerValues: PromptCustomizerValues = {
  product: "سماعات لاسلكية سوداء",
  duration: "6–8",
  format: "9:16",
  cameraMove: "حركة كاميرا بطيئة من اليمين إلى اليسار",
  background: "خلفية استوديو بنفسجية داكنة",
  placement: "الجهة اليسرى",
  topic: "كيف تختار أداة ذكاء اصطناعي مناسبة",
  tone: "ودودة وخبيرة",
  callToAction: "احفظ الفيديو وجرّب الأداة",
};

export function buildCustomPrompt(template: CustomizerTemplate, language: CustomizerLanguage, values: PromptCustomizerValues) {
  if (template === "product_video") {
    return language === "ar"
      ? `حوّل صورة ${values.product} المرفقة إلى فيديو إعلاني عمودي مدته ${values.duration} ثوانٍ. ابدأ بلقطة قريبة للمنتج، ثم استخدم ${values.cameraMove} مع إضاءة استوديو ناعمة وانعكاسات واقعية. اجعل المشهد داخل ${values.background}. حافظ تماماً على شكل المنتج وشعاره وألوانه. النسبة ${values.format}، جودة عالية، من دون نص داخل الفيديو.`
      : `Transform the attached ${values.product} image into a ${values.duration}-second vertical commercial. Start with a close product shot, then use ${values.cameraMove} with soft studio lighting and realistic reflections. Place the scene in a ${values.background}. Preserve the exact product shape, logo, and colors. Use ${values.format}, high detail, and no on-screen text.`;
  }

  if (template === "product_ad") {
    return language === "ar"
      ? `أنشئ صورة إعلان احترافية لمنتج: ${values.product}. ضع المنتج في مركز المشهد مع إضاءة درامية فاخرة وخلفية ${values.background}. اجعل التفاصيل واقعية جداً مع عمق ميدان سينمائي وانعكاسات دقيقة. اترك مساحة نظيفة في ${values.placement} لإضافة عنوان لاحقاً. النسبة ${values.format}. لا تضف أي كتابة أو شعار غير موجود في المنتج.`
      : `Create a premium commercial image for ${values.product}. Place the product in the center with dramatic luxury lighting and a ${values.background}. Use highly realistic detail, cinematic depth of field, and accurate reflections. Leave clean negative space on the ${values.placement} for a title later. Use ${values.format}. Do not generate any text or logo not present on the product.`;
  }

  return language === "ar"
    ? `اكتب سيناريو فيديو Reel عربي مدته ${values.duration} ثانية عن: ${values.topic}. ابدأ بخطاف قوي في أول ثانيتين، ثم قدّم 3 نقاط عملية بجمل قصيرة. أضف اقتراحاً للمشهد البصري أو B-roll لكل نقطة. اجعل النبرة ${values.tone}. اختم بهذه الدعوة: ${values.callToAction}. أعطني الناتج في جدول: الوقت، النص المنطوق، النص الظاهر، المشهد المقترح.`
    : `Write a ${values.duration}-second educational Reel script about: ${values.topic}. Start with a strong hook in the first two seconds, then explain three practical points in short sentences. Add a visual or B-roll suggestion for each point. Use a ${values.tone} tone. End with this call to action: ${values.callToAction}. Format the response as a table with timing, voiceover, on-screen copy, and suggested visual.`;
}
