import { Resend } from "resend";
import { getArticleForNewsletter, listNewsletterRecipients, markNewsletterSent, updateSubscriberResendContact } from "./blogDb";

type NewsletterArticle = NonNullable<Awaited<ReturnType<typeof getArticleForNewsletter>>>;
type Recipient = Awaited<ReturnType<typeof listNewsletterRecipients>>[number];

const BATCH_SIZE = 100;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export function buildNewsletterEmail(article: NewsletterArticle, recipient: Recipient, siteUrl: string) {
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const unsubscribeUrl = `${siteUrl}/unsubscribe/${recipient.unsubscribeToken}`;
  const safeTitle = escapeHtml(article.title);
  const safeExcerpt = escapeHtml(article.excerpt);
  const subject = `جديد AIToolBox: ${article.title}`;
  return {
    subject,
    text: `نشرنا مقالاً جديداً في AIToolBox\n\n${article.title}\n${article.excerpt}\n\nاقرأ المقال: ${articleUrl}\n\nلإلغاء الاشتراك: ${unsubscribeUrl}`,
    html: `<div dir="rtl" style="background:#070918;color:#e2e8f0;padding:32px;font-family:Arial,sans-serif;line-height:1.8"><div style="max-width:620px;margin:0 auto;background:#11152a;border:1px solid #2b3158;border-radius:20px;padding:32px"><p style="margin:0;color:#b9a8ff;font-weight:bold">AIToolBox · تحديث جديد</p><h1 style="color:#fff;font-size:28px;line-height:1.5">${safeTitle}</h1><p style="color:#cbd5e1">${safeExcerpt}</p><a href="${articleUrl}" style="display:inline-block;background:#8b5cf6;color:#fff;text-decoration:none;padding:12px 22px;border-radius:12px;font-weight:bold">اقرأ المقال</a><hr style="border:0;border-top:1px solid #2b3158;margin:28px 0"/><p style="font-size:12px;color:#94a3b8">وصلتك هذه الرسالة لأنك اشتركت في تحديثات AIToolBox. <a href="${unsubscribeUrl}" style="color:#c4b5fd">إلغاء الاشتراك</a></p></div></div>`,
  };
}

function chunk<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
}

export async function syncSubscriberToResend(email: string) {
  const resend = getResendClient();
  if (!resend) return null;
  const { data, error } = await resend.contacts.create({ email, unsubscribed: false });
  if (error) return null;
  if (data?.id) await updateSubscriberResendContact(email, data.id);
  return data?.id ?? null;
}

export async function unsubscribeRemoteContact(email: string) {
  const resend = getResendClient();
  if (!resend) return;
  await resend.contacts.update({ email, unsubscribed: true });
}

export async function sendArticleNewsletter(article: NewsletterArticle, siteUrl: string) {
  if (!isResendConfigured()) return { sent: false, reason: "not_configured" as const, recipientCount: 0 };
  if (article.newsletterSentAt) return { sent: false, reason: "already_sent" as const, recipientCount: 0 };

  const recipients = await listNewsletterRecipients();
  if (recipients.length === 0) {
    await markNewsletterSent(article.id);
    return { sent: true, reason: "no_recipients" as const, recipientCount: 0 };
  }

  const resend = getResendClient();
  if (!resend) return { sent: false, reason: "not_configured" as const, recipientCount: 0 };
  const from = process.env.RESEND_FROM_EMAIL!;

  for (const group of chunk(recipients, BATCH_SIZE)) {
    const emails = group.map(recipient => {
      const message = buildNewsletterEmail(article, recipient, siteUrl);
      return { from, to: recipient.email, subject: message.subject, html: message.html, text: message.text };
    });
    const { error } = await resend.batch.send(emails);
    if (error) throw new Error(error.message || "تعذر إرسال تحديث البريد الإلكتروني.");
  }

  await markNewsletterSent(article.id);
  return { sent: true, reason: "delivered" as const, recipientCount: recipients.length };
}
