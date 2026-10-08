'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { requireUser } from '@/lib/user-auth';
import { saveUpload } from '@/lib/uploads';

const profilePath = '/profile';
const field = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
};
const errorPath = (message: string, section: 'personal' | 'password' = 'personal') =>
  `${profilePath}?section=${section}&error=${encodeURIComponent(message)}`;
const savedPath = (section: string) =>
  `${profilePath}?section=${section === 'password' ? 'password' : 'personal'}&saved=${section}`;

export async function updateProfileAction(formData: FormData) {
  const session = await requireUser(profilePath);
  const current = await prisma.user.findUnique({ where: { id: session.id }, select: { email: true, passwordHash: true } });
  if (!current) redirect(errorPath('تعذر العثور على الحساب.'));

  const name = field(formData, 'name');
  const email = field(formData, 'email').toLowerCase();
  if (name.length < 2 || name.length > 100) redirect(errorPath('يجب أن يكون الاسم بين حرفين و100 حرف.'));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) redirect(errorPath('عنوان البريد الإلكتروني غير صالح.'));

  const changingEmail = email !== current.email?.toLowerCase();
  if (changingEmail) {
    if (!current.passwordHash) redirect(errorPath('تغيير البريد لحساب Google يتطلب تعيين كلمة مرور أولاً عبر استعادة كلمة المرور.'));
    if (!verifyPassword(field(formData, 'currentPassword'), current.passwordHash)) {
      redirect(errorPath('كلمة المرور الحالية غير صحيحة.'));
    }
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing && existing.id !== session.id) redirect(errorPath('هذا البريد الإلكتروني مستخدم بالفعل.'));
  }

  const upload = formData.get('image');
  let image: string | null = null;
  if (upload instanceof File && upload.size > 0) {
    try {
      image = await saveUpload(upload, 'avatars');
    } catch (error) {
      redirect(errorPath(error instanceof Error ? error.message : 'تعذر رفع الصورة.'));
    }
  }

  try {
    await prisma.user.update({
      where: { id: session.id },
      data: { name, ...(changingEmail ? { email, emailVerified: null } : {}), ...(image ? { image } : {}) },
    });
  } catch {
    redirect(errorPath('تعذر حفظ البيانات. تأكد من أن البريد الإلكتروني غير مستخدم.'));
  }

  revalidatePath('/', 'layout');
  redirect(savedPath('profile'));
}

export async function removeProfilePictureAction() {
  const session = await requireUser(profilePath);
  await prisma.user.update({ where: { id: session.id }, data: { image: null } });
  revalidatePath('/', 'layout');
  redirect(savedPath('image'));
}

export async function changeProfilePasswordAction(formData: FormData) {
  const session = await requireUser(profilePath);
  const current = await prisma.user.findUnique({ where: { id: session.id }, select: { passwordHash: true } });
  if (!current?.passwordHash) redirect(errorPath('عيّن كلمة مرور عبر صفحة استعادة كلمة المرور أولاً.', 'password'));

  const oldPassword = field(formData, 'currentPassword');
  const password = field(formData, 'password');
  const confirmPassword = field(formData, 'confirmPassword');
  if (!verifyPassword(oldPassword, current.passwordHash)) redirect(errorPath('كلمة المرور الحالية غير صحيحة.', 'password'));
  if (password.length < 8 || password.length > 128) redirect(errorPath('يجب أن تكون كلمة المرور الجديدة بين 8 و128 حرفاً.', 'password'));
  if (password !== confirmPassword) redirect(errorPath('كلمتا المرور الجديدتان غير متطابقتين.', 'password'));
  if (verifyPassword(password, current.passwordHash)) redirect(errorPath('اختر كلمة مرور جديدة مختلفة عن الحالية.', 'password'));

  await prisma.user.update({ where: { id: session.id }, data: { passwordHash: hashPassword(password) } });
  revalidatePath(profilePath);
  redirect(savedPath('password'));
}
