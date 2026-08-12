import 'server-only';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export function passwordResetDeliveryConfigured() {
  if (process.env.NODE_ENV !== 'production') return true;
  return Boolean(process.env.RESEND_API_KEY && process.env.AUTH_EMAIL_FROM);
}

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name?: string | null;
  resetUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== 'production') {
      return { previewUrl: resetUrl };
    }
    throw new Error('Password reset email delivery is not configured.');
  }

  const safeName = escapeHtml(name?.trim() || 'قارئ المكتبة');
  const safeUrl = escapeHtml(resetUrl);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'إعادة تعيين كلمة مرور المكتبة الرقمية',
      text: `مرحباً ${name?.trim() || 'بك'}،\n\nاستخدم الرابط التالي لإعادة تعيين كلمة المرور خلال 30 دقيقة:\n${resetUrl}\n\nإذا لم تطلب ذلك، فتجاهل هذه الرسالة.`,
      html: `
        <div dir="rtl" style="background:#f4f8fb;padding:32px;font-family:Arial,sans-serif;color:#0a2540">
          <div style="max-width:560px;margin:auto;background:#fff;border:1px solid #d9e3ee;border-radius:20px;padding:32px">
            <p style="margin:0;color:#8b681c;font-size:13px;font-weight:700">المكتبة الرقمية الذكية</p>
            <h1 style="margin:12px 0 8px;font-size:24px">إعادة تعيين كلمة المرور</h1>
            <p style="margin:0 0 20px;line-height:1.8;color:#475569">مرحباً ${safeName}، استخدم الزر أدناه لإنشاء كلمة مرور جديدة. ينتهي الرابط بعد 30 دقيقة ويمكن استخدامه مرة واحدة فقط.</p>
            <a href="${safeUrl}" style="display:inline-block;background:#0b4e84;color:#fff;text-decoration:none;border-radius:999px;padding:13px 24px;font-weight:700">إنشاء كلمة مرور جديدة</a>
            <p style="margin:24px 0 0;font-size:12px;line-height:1.7;color:#64748b">إذا لم تطلب إعادة تعيين كلمة المرور، فتجاهل هذه الرسالة وسيبقى حسابك كما هو.</p>
          </div>
        </div>
      `,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Password reset email failed with status ${response.status}.`);
  }

  return { previewUrl: null };
}
