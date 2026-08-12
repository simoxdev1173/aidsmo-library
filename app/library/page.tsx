import UserLibrary from '@/components/UserLibrary';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/user-auth';

export const metadata = {
  title: 'مكتبتي | المكتبة الرقمية الذكية',
  description: 'إدارة الكتب والإصدارات المحفوظة في مكتبتك الشخصية.',
};

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const user = await requireUser('/library');
  const [items, shelves] = await Promise.all([
    prisma.userLibraryItem.findMany({
      where: { userId: user.id },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      include: {
        entry: {
          select: {
            id: true,
            slug: true,
            title: true,
            author: true,
            publisher: true,
            coverImagePath: true,
            entryType: true,
            status: true,
          },
        },
      },
    }),
    prisma.userShelf.findMany({
      where: { userId: user.id },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      include: { _count: { select: { items: true } } },
    }),
  ]);

  return (
    <UserLibrary
      initialItems={items.map((item) => ({
        id: item.id,
        entryId: item.entryId,
        slug: item.entry.slug,
        title: item.entry.title,
        author: item.entry.author ?? item.entry.publisher ?? 'المنظمة العربية للتنمية الصناعية والتقييس والتعدين',
        cover: item.entry.coverImagePath,
        entryType: item.entry.entryType,
        isAvailable: item.entry.status === 'PUBLISHED',
        status: item.status,
        progress: item.progress,
        position: item.position,
        shelfId: item.shelfId,
        updatedAt: item.updatedAt.toISOString(),
      }))}
      initialShelves={shelves.map((shelf) => ({
        id: shelf.id,
        name: shelf.name,
        position: shelf.position,
        itemCount: shelf._count.items,
      }))}
    />
  );
}
