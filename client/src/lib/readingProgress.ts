export function clampProgress(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getArticleReadingProgress({
  scrollY,
  articleTop,
  articleHeight,
  viewportHeight,
}: {
  scrollY: number;
  articleTop: number;
  articleHeight: number;
  viewportHeight: number;
}) {
  const scrollableDistance = articleHeight - viewportHeight;
  if (scrollableDistance <= 0) return scrollY > articleTop ? 100 : 0;
  return clampProgress(((scrollY - articleTop) / scrollableDistance) * 100);
}

export function shouldShowReturnToToc(scrollY: number, articleTop: number) {
  return scrollY > articleTop + 280;
}
