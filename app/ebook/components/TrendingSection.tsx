import { getTrendingLibraryRows } from '@/lib/library-data';
import LibraryCarouselRow from './TrendingCarousel';
import TrendingIntro from './TrendingIntro';
import styles from './TrendingShelves.module.css';

export default async function TrendingBooks() {
  const libraryRows = await getTrendingLibraryRows();
  if (libraryRows.length === 0) return null;

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <TrendingIntro shelfIds={libraryRows.map((row) => row.id)} />
        {libraryRows.map((row) => <LibraryCarouselRow key={row.id} row={row} />)}
      </div>
    </section>
  );
}
