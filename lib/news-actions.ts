'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { announceNews } from '@/lib/notifications';

export async function addNewsAction(formData: FormData) {
  await requireAdmin();

  const raw = formData.get('message');
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message || message.length > 500) {
    redirect('/dashboard/events?error=invalid');
  }

  const recipients = await announceNews(message);
  revalidatePath('/notifications');
  revalidatePath('/', 'layout');
  redirect(`/dashboard/events?sent=${recipients}`);
}
