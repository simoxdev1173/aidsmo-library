'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createSlug } from '@/lib/slug';

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalField(formData: FormData, key: string) {
  return field(formData, key) || null;
}

function checkedUrl(value: string | null, label: string, allowLocalPath = false) {
  if (!value) return null;
  if (allowLocalPath && value.startsWith('/') && !value.startsWith('//')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return parsed.toString();
  } catch {
    // A localized validation message is returned below.
  }
  throw new Error(`رابط ${label} غير صالح. استخدم رابطاً يبدأ بـ https:// أو مسار صورة محلياً.`);
}

function readProfile(formData: FormData) {
  const name = field(formData, 'name');
  const ministry = field(formData, 'ministry');
  const country = field(formData, 'country');
  if (!name || !ministry || !country) {
    throw new Error('الاسم والجهة والدولة حقول مطلوبة.');
  }

  const sortOrderValue = field(formData, 'sortOrder');
  const sortOrder = sortOrderValue ? Number(sortOrderValue) : 0;
  if (!Number.isInteger(sortOrder)) throw new Error('ترتيب العرض يجب أن يكون رقماً صحيحاً.');

  const email = optionalField(formData, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('عنوان البريد الإلكتروني غير صالح.');
  }

  return {
    name,
    sourceProfileName: optionalField(formData, 'sourceProfileName'),
    role: optionalField(formData, 'role'),
    ministry,
    country,
    imageUrl: checkedUrl(optionalField(formData, 'imageUrl'), 'الصورة', true),
    phone: optionalField(formData, 'phone'),
    fax: optionalField(formData, 'fax'),
    email,
    websiteUrl: checkedUrl(optionalField(formData, 'websiteUrl'), 'الموقع'),
    vCardUrl: checkedUrl(optionalField(formData, 'vCardUrl'), 'بطاقة vCard'),
    bio: optionalField(formData, 'bio'),
    sourceNote: optionalField(formData, 'sourceNote'),
    sortOrder,
    isActive: formData.get('isActive') === 'on',
  };
}

async function uniqueSlug(value: string, currentId?: string) {
  const base = createSlug(value);
  let slug = base;
  let suffix = 2;
  while (await prisma.executiveBoardMember.findFirst({
    where: { slug, ...(currentId ? { id: { not: currentId } } : {}) },
    select: { id: true },
  })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

export async function createExecutiveBoardMember(formData: FormData) {
  await requireAdmin();
  let data: ReturnType<typeof readProfile>;
  try {
    data = readProfile(formData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ بيانات العضو.';
    redirect(`/dashboard/executive-board/new?error=${encodeURIComponent(message)}`);
  }

  const preferredSlug = field(formData, 'slug') || `${data.name}-${data.country}`;
  const member = await prisma.executiveBoardMember.create({
    data: { ...data, slug: await uniqueSlug(preferredSlug) },
  });
  revalidatePath('/archive/org/executive-board');
  revalidatePath('/dashboard/executive-board');
  redirect(`/dashboard/executive-board/${member.id}?saved=created`);
}

export async function updateExecutiveBoardMember(formData: FormData) {
  await requireAdmin();
  const id = field(formData, 'id');
  const current = await prisma.executiveBoardMember.findUnique({ where: { id } });
  if (!current) redirect('/dashboard/executive-board?error=not-found');

  let data: ReturnType<typeof readProfile>;
  try {
    data = readProfile(formData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ بيانات العضو.';
    redirect(`/dashboard/executive-board/${id}?error=${encodeURIComponent(message)}`);
  }

  const preferredSlug = field(formData, 'slug') || `${data.name}-${data.country}`;
  const slug = await uniqueSlug(preferredSlug, id);
  const member = await prisma.executiveBoardMember.update({ where: { id }, data: { ...data, slug } });
  revalidatePath('/archive/org/executive-board');
  revalidatePath(`/archive/org/executive-board/${current.slug}`);
  revalidatePath(`/archive/org/executive-board/${member.slug}`);
  revalidatePath('/dashboard/executive-board');
  redirect(`/dashboard/executive-board/${id}?saved=updated`);
}
