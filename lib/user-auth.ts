import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return user;
}

export async function getUserSession() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, image: true },
  });

  if (!user?.email) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name?.trim() || user.email.split('@')[0],
    image: user.image,
  };
}

export async function requireUser(callbackUrl = '/library') {
  const user = await getUserSession();

  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return user;
}
