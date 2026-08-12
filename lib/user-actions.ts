'use server';

import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { signIn, signOut, googleAuthEnabled } from '@/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function safeCallbackUrl(value: string, fallback = '/library') {
  return value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

function errorUrl(path: string, error: string, callbackUrl?: string) {
  const params = new URLSearchParams({ error });
  if (callbackUrl) params.set('callbackUrl', callbackUrl);
  return `${path}?${params.toString()}`;
}

export async function loginUserAction(formData: FormData) {
  const email = text(formData, 'email').toLowerCase();
  const password = text(formData, 'password');
  const callbackUrl = safeCallbackUrl(text(formData, 'callbackUrl'));

  if (!email || !password) {
    redirect(errorUrl('/login', 'يرجى إدخال البريد الإلكتروني وكلمة المرور.', callbackUrl));
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(errorUrl('/login', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', callbackUrl));
    }
    throw error;
  }
}

export async function googleSignInAction(formData: FormData) {
  const callbackUrl = safeCallbackUrl(text(formData, 'callbackUrl'));

  if (!googleAuthEnabled) {
    redirect(errorUrl('/login', 'تسجيل الدخول عبر Google غير مهيأ بعد.', callbackUrl));
  }

  await signIn('google', { redirectTo: callbackUrl });
}

export async function logoutUserAction() {
  await signOut({ redirectTo: '/' });
}

export async function signupUserAction(formData: FormData) {
  const name = text(formData, 'name');
  const email = text(formData, 'email').toLowerCase();
  const password = text(formData, 'password');
  const confirmPassword = text(formData, 'confirmPassword');
  const callbackUrl = safeCallbackUrl(text(formData, 'callbackUrl'));

  if (!name || !email || !password) {
    redirect(errorUrl('/signup', 'يرجى تعبئة جميع الحقول.', callbackUrl));
  }

  if (password.length < 8) {
    redirect(errorUrl('/signup', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.', callbackUrl));
  }

  if (password !== confirmPassword) {
    redirect(errorUrl('/signup', 'كلمتا المرور غير متطابقتين.', callbackUrl));
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(errorUrl('/signup', 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.', callbackUrl));
  }

  try {
    await prisma.user.create({
      data: { name, email, passwordHash: hashPassword(password) },
    });
  } catch {
    redirect(errorUrl('/signup', 'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.', callbackUrl));
  }

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(errorUrl('/login', 'تم إنشاء الحساب. يرجى تسجيل الدخول.', callbackUrl));
    }
    throw error;
  }
}
