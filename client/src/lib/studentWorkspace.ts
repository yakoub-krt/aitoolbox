export type StudyDuration = 25 | 35 | 45;

export type StudyStep = { time: string; title: string; detail: string; tone: "violet" | "cyan" | "emerald" | "amber" };

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

export function buildConceptPrompt(concept: string, level: string) {
  const subject = concept.trim() || "[اكتب المفهوم]";
  return `اشرح مفهوم «${subject}» لطالب بمستوى ${level}. ابدأ بتعريف من سطرين، ثم مثال واقعي، ثم تشبيه بسيط، ثم ثلاثة أسئلة قصيرة أتأكد بها من الفهم. لا تخترع حقائق أو مراجع؛ وضّح ما يحتاج تحققاً.`;
}

export function buildFlashcards(topic: string) {
  const subject = topic.trim() || "موضوعك";
  return [
    { question: `ما الفكرة الأساسية في ${subject}؟`, answer: "اكتبها بجملة واحدة من فهمك، ثم قارنها بالمصدر." },
    { question: `ما مثال واقعي يوضح ${subject}؟`, answer: "اختر مثالاً من الدرس أو من حياتك، واشرح سبب ارتباطه بالمفهوم." },
    { question: `ما النقطة التي ما زلت بحاجة لمراجعتها؟`, answer: "اكتبها بوضوح وحولها إلى سؤال صغير للجلسة التالية." },
  ];
}
