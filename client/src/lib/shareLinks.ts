export type SharePlatform = "x" | "facebook" | "linkedin" | "whatsapp";

export function createShareLinks(title: string, url: string): Record<SharePlatform, string> {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const combinedText = encodeURIComponent(`${title} ${url}`);

  return {
    x: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${combinedText}`,
  };
}

export async function copyShareLink(
  url: string,
  writeText?: (text: string) => Promise<void>,
): Promise<void> {
  const clipboardWriter = writeText ?? navigator.clipboard?.writeText?.bind(navigator.clipboard);
  if (!clipboardWriter) throw new Error("نسخ الرابط غير مدعوم في هذا المتصفح.");
  await clipboardWriter(url);
}
