import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArchiveEmptyPage from '@/components/archive/ArchiveEmptyPage';
import { getArchivePage, type ArchivePagePath } from '@/lib/archive-pages';

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getArchivePage(`/archive${slug?.length ? `/${slug.join('/')}` : ''}`);
  return { title: page ? `${page.title} | الأرشيف` : 'الصفحة غير موجودة' };
}

export default async function ArchivePlaceholderPage({ params }: Props) {
  const { slug } = await params;
  const path = `/archive${slug?.length ? `/${slug.join('/')}` : ''}`;
  if (!getArchivePage(path)) notFound();

  return <ArchiveEmptyPage path={path as ArchivePagePath} />;
}
