export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function normalizeHeadingText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

export function createHeadingAnchor(text: string) {
  const anchor = text
    .normalize("NFKD")
    .toLocaleLowerCase("ar")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[^\u0621-\u064A\u0660-\u0669\u0671-\u06FFa-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return anchor || "section";
}

export function getArticleHeadings(markdown: string): ArticleHeading[] {
  const seenAnchors = new Map<string, number>();
  const matches = markdown.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm);

  return Array.from(matches).map((match) => {
    const level = match[1].length as 2 | 3;
    const text = normalizeHeadingText(match[2]);
    const baseId = createHeadingAnchor(text);
    const seenCount = seenAnchors.get(baseId) ?? 0;
    seenAnchors.set(baseId, seenCount + 1);

    return {
      id: seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`,
      text,
      level,
    };
  });
}

export function getHeadingIdAtPosition(headings: ArticleHeading[], text: string, occurrence: number) {
  const matchingHeadings = headings.filter((heading) => heading.text === normalizeHeadingText(text));
  return matchingHeadings[occurrence]?.id ?? createHeadingAnchor(text);
}
