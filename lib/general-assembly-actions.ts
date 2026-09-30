'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createSlug } from '@/lib/slug';
import { saveUpload } from '@/lib/uploads';

const dashboardPath = '/dashboard/general-assembly';
const publicPath = '/archive/org/general-assembly';
const field = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};
const optional = (formData: FormData, key: string) => field(formData, key) || null;

function checkedUrl(value: string | null, label: string, allowLocalPath = false) {
  if (!value) return null;
  if (allowLocalPath && value.startsWith('/') && !value.startsWith('//')) return value;
  try { const url = new URL(value); if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString(); } catch {}
  throw new Error(`رابط ${label} غير صالح.`);
}

async function readProfile(formData: FormData) {
  const name = field(formData, 'name'), ministry = field(formData, 'ministry'), country = field(formData, 'country');
  if (!name || !ministry || !country) throw new Error('الاسم والجهة والدولة حقول مطلوبة.');
  const orderText = field(formData, 'sortOrder'), sortOrder = orderText ? Number(orderText) : 0;
  if (!Number.isInteger(sortOrder)) throw new Error('ترتيب العرض يجب أن يكون رقماً صحيحاً.');
  const email = optional(formData, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('عنوان البريد الإلكتروني غير صالح.');
  const websiteUrl = checkedUrl(optional(formData, 'websiteUrl'), 'الموقع');
  const vCardUrl = checkedUrl(optional(formData, 'vCardUrl'), 'بطاقة vCard');
  const imageFile = formData.get('imageFile');
  const imageUrl = imageFile instanceof File && imageFile.size > 0
    ? await saveUpload(imageFile, 'covers')
    : checkedUrl(optional(formData, 'imageUrl'), 'الصورة', true);
  return {
    name, sourceProfileName: optional(formData, 'sourceProfileName'), role: optional(formData, 'role'), ministry, country,
    imageUrl, phone: optional(formData, 'phone'), fax: optional(formData, 'fax'), email,
    websiteUrl, vCardUrl,
    bio: optional(formData, 'bio'), sourceNote: optional(formData, 'sourceNote'), sortOrder, isActive: formData.get('isActive') === 'on',
  };
}

async function uniqueSlug(value: string, currentId?: string) {
  const base = createSlug(value); let slug = base, suffix = 2;
  while (await prisma.generalAssemblyMember.findFirst({ where: { slug, ...(currentId ? { id: { not: currentId } } : {}) }, select: { id: true } })) slug = `${base}-${suffix++}`;
  return slug;
}

export async function createGeneralAssemblyMember(formData: FormData) {
  await requireAdmin();
  let data: Awaited<ReturnType<typeof readProfile>>;
  try { data = await readProfile(formData); } catch (error) { redirect(`${dashboardPath}/new?error=${encodeURIComponent(error instanceof Error ? error.message : 'تعذر حفظ البيانات.')}`); }
  const member = await prisma.generalAssemblyMember.create({ data: { ...data, slug: await uniqueSlug(field(formData, 'slug') || `${data.name}-${data.country}`) } });
  revalidatePath(publicPath); revalidatePath(dashboardPath);
  redirect(`${dashboardPath}/${member.id}?saved=created`);
}

export async function updateGeneralAssemblyMember(formData: FormData) {
  await requireAdmin();
  const id = field(formData, 'id');
  const current = await prisma.generalAssemblyMember.findUnique({ where: { id } });
  if (!current) redirect(`${dashboardPath}?error=not-found`);
  let data: Awaited<ReturnType<typeof readProfile>>;
  try { data = await readProfile(formData); } catch (error) { redirect(`${dashboardPath}/${id}?error=${encodeURIComponent(error instanceof Error ? error.message : 'تعذر حفظ البيانات.')}`); }
  const slug = await uniqueSlug(field(formData, 'slug') || `${data.name}-${data.country}`, id);
  const member = await prisma.generalAssemblyMember.update({ where: { id }, data: { ...data, slug } });
  revalidatePath(publicPath); revalidatePath(`${publicPath}/${current.slug}`); revalidatePath(`${publicPath}/${member.slug}`); revalidatePath(dashboardPath);
  redirect(`${dashboardPath}/${id}?saved=updated`);
}
