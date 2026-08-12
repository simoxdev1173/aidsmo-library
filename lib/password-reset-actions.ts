'use server';

import { createHash, randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { passwordResetDeliveryConfigured, sendPasswordResetEmail } from '@/lib/password-reset-email';

const RESET_PREFIX = 'password-reset:';
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function normalizedEmail(value: string) {
  return value.trim().toLowerCase();
}

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function safeCallbackUrl(value: string, fallback = '/library') {
  return value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

function resetIdentifier(email: string) {
  return `${RESET_PREFIX}${normalizedEmail(email)}`;
}

function tokenDigest(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function appOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configured) return 'http://localhost:3000';

  try {
    return new URL(configured).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

function forgotPasswordUrl(params: Record<string, string>) {
  return `/forgot-password?${new URLSearchParams(params).toString()}`;
}

function resetPasswordUrl(params: Record<string, string>) {
  return `/reset-password?${new URLSearchParams(params).toString()}`;
}

export async function isPasswordResetTokenValid(email: string, token: string) {
  if (!validEmail(normalizedEmail(email)) || token.length < 32 || token.length > 128) return false;

  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: resetIdentifier(email),
        token: tokenDigest(token),
      },
    },
    select: { expires: true },
  });

  return Boolean(record && record.expires.getTime() > Date.now());
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = normalizedEmail(text(formData, 'email'));
  const callbackUrl = safeCallbackUrl(text(formData, 'callbackUrl'));

  if (!validEmail(email)) {
    redirect(forgotPasswordUrl({ error: 'يرجى إدخال بريد إلكتروني صالح.', callbackUrl }));
  }

  if (!passwordResetDeliveryConfigured()) {
    redirect(forgotPasswordUrl({ error: 'خدمة استعادة كلمة المرور غير مهيأة حالياً. يرجى التواصل مع إدارة المكتبة.', callbackUrl }));
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true, name: true },
  });

  // Always show the same response so this form cannot be used to enumerate accounts.
  if (!user?.email) {
    redirect(forgotPasswordUrl({ status: 'sent', callbackUrl }));
  }

  const identifier = resetIdentifier(email);
  const recentToken = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: 'desc' },
  });

  if (recentToken && recentToken.expires.getTime() > Date.now() + RESET_TOKEN_TTL_MS - RESEND_COOLDOWN_MS) {
    redirect(forgotPasswordUrl({ status: 'sent', callbackUrl }));
  }

  const rawToken = randomBytes(32).toString('base64url');
  const hashedToken = tokenDigest(rawToken);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({ data: { identifier, token: hashedToken, expires } }),
  ]);

  const resetUrl = new URL('/reset-password', appOrigin());
  resetUrl.searchParams.set('email', email);
  resetUrl.searchParams.set('token', rawToken);
  resetUrl.searchParams.set('callbackUrl', callbackUrl);

  let previewUrl: string | null | undefined;
  try {
    ({ previewUrl } = await sendPasswordResetEmail({
      email,
      name: user.name,
      resetUrl: resetUrl.toString(),
    }));
  } catch {
    await prisma.verificationToken.deleteMany({ where: { identifier, token: hashedToken } });
    redirect(forgotPasswordUrl({ error: 'تعذر إرسال رابط الاستعادة الآن. يرجى المحاولة بعد قليل.', callbackUrl }));
  }

  const params: Record<string, string> = { status: 'sent', callbackUrl };
  if (process.env.NODE_ENV !== 'production' && previewUrl) {
    params.previewToken = rawToken;
    params.previewEmail = email;
  }
  redirect(forgotPasswordUrl(params));
}

export async function resetPasswordAction(formData: FormData) {
  const email = normalizedEmail(text(formData, 'email'));
  const token = text(formData, 'token');
  const password = text(formData, 'password');
  const confirmPassword = text(formData, 'confirmPassword');
  const callbackUrl = safeCallbackUrl(text(formData, 'callbackUrl'));
  const resetParams = { email, token, callbackUrl };

  if (password.length < 8 || password.length > 128) {
    redirect(resetPasswordUrl({ ...resetParams, error: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.' }));
  }

  if (password !== confirmPassword) {
    redirect(resetPasswordUrl({ ...resetParams, error: 'كلمتا المرور غير متطابقتين.' }));
  }

  const identifier = resetIdentifier(email);
  const hashedToken = tokenDigest(token);
  let updated = false;

  try {
    await prisma.$transaction(async (transaction) => {
      const consumed = await transaction.verificationToken.deleteMany({
        where: {
          identifier,
          token: hashedToken,
          expires: { gt: new Date() },
        },
      });

      if (consumed.count !== 1) throw new Error('INVALID_RESET_TOKEN');

      await transaction.user.update({
        where: { email },
        data: { passwordHash: hashPassword(password) },
      });

      await transaction.verificationToken.deleteMany({ where: { identifier } });
    });
    updated = true;
  } catch {
    updated = false;
  }

  if (!updated) {
    redirect(resetPasswordUrl({ status: 'invalid', callbackUrl }));
  }

  redirect(`/login?${new URLSearchParams({ reset: 'success', callbackUrl }).toString()}`);
}
