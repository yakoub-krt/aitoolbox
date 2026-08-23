export type StudyDuration = 25 | 35 | 45;
export type StudyStep = { time: string; title: string; detail: string; tone: "violet" | "cyan" | "emerald" | "amber" };
export type ReviewMode = "استرجاع وفهم" | "اختيار متعدد" | "تطبيق ومقارنة";
export type ReviewQuestion = { id: number; prompt: string; hint: string; modelAnswer: string };
export type Flashcard = { id: number; question: string; answer: string };

export function buildStudyPlan(topic: string, duration: StudyDuration): StudyStep[] {
  const subject = topic.trim() || "موضوع الدرس";
  const review = duration === 25 ? 5 : 8;
  const practice = duration === 45 ? 15 : 10;
  const focus = duration - review - practice - 7;
  return [
    { time: "03 د", title: "حضّر هدفاً واحداً", detail: `اكتب: بعد الجلسة أريد أن أفهم أو أطبق «${subject}». أبعد الإشعارات وجهّز المصدر الأساسي.`, tone: "violet" },
    { time: `${focus} د`, title: "افهم من المصدر أولاً", detail: "اقرأ أو شاهد جزءاً صغيراً، ثم اكتب ثلاث نقاط بكلماتك قبل استعمال أي أداة.", tone: "cyan" },
    { time: `${practice} د`, title: "اختبر نفسك", detail: "استخدم أسئلة مراجعة قصيرة. أجب دون النظر للملاحظات، ثم عد فقط للنقاط غير الواضحة.", tone: "emerald" },
    { time: `${review} د`, title: "صحّح وخطّط للعودة", detail: "سجّل نقطة أتقنتها ونقطة تحتاج مراجعة، وحدد متى ستعود لها في جلسة لاحقة.", tone: "amber" },
  ];
}

export function buildReviewPrompt(topic: string, style: string) {
  const subject = topic.trim() || "[اكتب موضوع الدرس]";
  return `أنا أدرس «${subject}». أنشئ ${style} تساعدني على الفهم والاسترجاع، لا على تسليم واجب جاهز. ابدأ بأسئلة بسيطة ثم أصعب تدريجياً. لا تعرض الإجابة إلا بعد أن أجيب، ثم اشرح الخطأ باختصار. إذا احتجت معلومة غير مذكورة فاسألني أولاً.`;
}

export function buildReviewQuestions(topic: string, mode: ReviewMode, count: number): ReviewQuestion[] {
  const subject = topic.trim() || "هذا الموضوع";
  const patterns = mode === "اختيار متعدد"
    ? ["أي وصف يعبّر عن الفكرة الأساسية؟", "أي مثال يطبق المفهوم بصورة صحيحة؟", "ما الخيار الذي يحتوي على خطأ شائع؟", "ما التسلسل الأكثر منطقية للخطوات؟", "ما السبب الأهم للنتيجة؟"]
    : mode === "تطبيق ومقارنة"
      ? ["كيف تطبق الفكرة على مثال جديد؟", "بماذا تختلف عن مفهوم قريب منها؟", "ما قرارك في موقف واقعي ولماذا؟", "ما الدليل الذي تحتاجه للتحقق؟", "ما النتيجة إذا تغير شرط أساسي؟"]
      : ["ما التعريف الذي تكتبه بكلماتك؟", "ما الفكرة الأساسية التي لا تريد نسيانها؟", "ما مثال واقعي يوضحها؟", "ما العلاقة بين أجزائها؟", "ما الخطأ الشائع عند فهمها؟"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    prompt: `${patterns[index % patterns.length]} حول «${subject}»`,
    hint: "ارجع إلى عنوان الدرس أو مثال واحد من مصدرك إذا توقفت.",
    modelAnswer: "اكتب إجابتك أولاً. بعد ذلك قارنها بالمصدر، وصحح كلمة أو مثالاً واحداً فقط إن احتجت.",
  }));
}

export function buildConceptPrompt(concept: string, level: string) {
  const subject = concept.trim() || "[اكتب المفهوم]";
  return `اشرح مفهوم «${subject}» لطالب بمستوى ${level}. ابدأ بتعريف من سطرين، ثم مثال واقعي، ثم تشبيه بسيط، ثم ثلاثة أسئلة قصيرة أتأكد بها من الفهم. لا تخترع حقائق أو مراجع؛ وضّح ما يحتاج تحققاً.`;
}

export function buildConceptMap(concept: string, level: string) {
  const subject = concept.trim() || "المفهوم الذي تدرسه";
  return {
    definition: `عرّف «${subject}» بجملتين على مستوى ${level}، من المصدر أو من شرح موثوق.`,
    example: `اكتب موقفاً أو مسألة صغيرة يظهر فيها ${subject} بصورة عملية.`,
    connection: "اربط المفهوم بفكرة سبق أن درستها: ما المتشابه؟ وما المختلف؟",
    check: `اسأل نفسك: هل أستطيع شرح ${subject} لشخص آخر بلا مصطلحات معقدة؟`,
  };
}

export function buildFlashcards(topic: string): Flashcard[] {
  const subject = topic.trim() || "موضوعك";
  return [
    { id: 1, question: `ما الفكرة الأساسية في ${subject}؟`, answer: "اكتبها بجملة واحدة من فهمك، ثم قارنها بالمصدر." },
    { id: 2, question: `ما مثال واقعي يوضح ${subject}؟`, answer: "اختر مثالاً من الدرس أو من حياتك، واشرح سبب ارتباطه بالمفهوم." },
    { id: 3, question: "ما النقطة التي ما زلت بحاجة لمراجعتها؟", answer: "اكتبها بوضوح وحولها إلى سؤال صغير للجلسة التالية." },
  ];
}
