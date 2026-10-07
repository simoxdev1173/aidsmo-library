import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { hashPassword } from '../lib/password';
import { E2E_BOOK_SLUG, E2E_BOOK_TITLE, E2E_USER_EMAIL, E2E_USER_PASSWORD } from './fixtures';

async function seed() {
  const connectionString = process.env.E2E_DATABASE_URL;
  if (!connectionString) return;

  const databaseName = decodeURIComponent(new URL(connectionString).pathname.slice(1));
  if (!databaseName.endsWith('_e2e')) {
    throw new Error('E2E_DATABASE_URL must point to a separate database whose name ends in _e2e.');
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const category = await prisma.category.upsert({
      where: { slug: 'e2e-browser-tests' },
      update: {},
      create: { name: 'Browser tests', slug: 'e2e-browser-tests', isNavVisible: false },
    });
    await prisma.libraryEntry.upsert({
      where: { slug: E2E_BOOK_SLUG },
      update: { title: E2E_BOOK_TITLE, categoryId: category.id, status: 'PUBLISHED' },
      create: {
        title: E2E_BOOK_TITLE,
        slug: E2E_BOOK_SLUG,
        categoryId: category.id,
        entryType: 'BOOK',
        status: 'PUBLISHED',
        author: 'AIDSMO E2E',
        publishedAt: new Date(),
      },
    });
    const user = await prisma.user.upsert({
      where: { email: E2E_USER_EMAIL },
      update: { passwordHash: hashPassword(E2E_USER_PASSWORD) },
      create: {
        email: E2E_USER_EMAIL,
        name: 'E2E Reader',
        passwordHash: hashPassword(E2E_USER_PASSWORD),
      },
    });
    await prisma.userLibraryItem.deleteMany({ where: { userId: user.id } });
    await prisma.userShelf.deleteMany({ where: { userId: user.id } });
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
