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

export type NativeSharePayload = {
  title: string;
  text: string;
  url: string;
};

type NativeShareNavigator = {
  share?: (payload: NativeSharePayload) => Promise<void>;
};

export function canUseNativeShare(browserNavigator: NativeShareNavigator | undefined): boolean {
  return typeof browserNavigator?.share === "function";
}

export async function shareWithNativeDialog(
  payload: NativeSharePayload,
  share?: (payload: NativeSharePayload) => Promise<void>,
): Promise<void> {
  if (!share) throw new Error("المشاركة الأصلية غير مدعومة في هذا المتصفح.");
  await share(payload);
}
