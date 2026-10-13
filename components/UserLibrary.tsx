'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState, useTransition } from 'react';
import {
  LuArrowDown,
  LuArrowUp,
  LuBookOpen,
  LuCheck,
  LuChevronDown,
  LuClock3,
  LuEllipsisVertical,
  LuFolderOpen,
  LuLibrary,
  LuPlus,
  LuSearch,
  LuTrash2,
} from 'react-icons/lu';
import {
  createShelfAction,
  deleteShelfAction,
  getLibraryShelvesAction,
  moveLibraryItemAction,
  removeLibraryItemAction,
  updateLibraryItemAction,
} from '@/lib/user-library-actions';
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ReadingStatus = 'SAVED' | 'READING' | 'COMPLETED';

export type LibraryItem = {
  id: string;
  entryId: string;
  slug: string;
  title: string;
  author: string;
  cover: string | null;
  entryType: string;
  isAvailable: boolean;
  status: ReadingStatus;
  progress: number;
  position: number;
  shelfId: string | null;
  updatedAt: string;
};

export type LibraryShelf = {
  id: string;
  name: string;
  position: number;
  itemCount: number;
};

const STATUS_LABEL: Record<ReadingStatus, string> = {
  SAVED: 'محفوظ',
  READING: 'أقرأ حاليا',
  COMPLETED: 'مكتمل',
};

const TABS = [
  { id: 'all', label: 'كل المحفوظات', icon: LuLibrary },
  { id: 'reading', label: 'قيد القراءة', icon: LuClock3 },
  { id: 'shelves', label: 'الرفوف', icon: LuFolderOpen },
] as const;

type ActionResult = { ok: boolean; error?: string };

export default function UserLibrary({
  initialItems,
  initialShelves,
}: {
  initialItems: LibraryItem[];
  initialShelves: LibraryShelf[];
}) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('all');
  const [activeShelfId, setActiveShelfId] = useState<string | null>(null);
  const [shelves, setShelves] = useState(initialShelves);
  const [shelvesSource, setShelvesSource] = useState(initialShelves);
  const [searchQuery, setSearchQuery] = useState('');
  const [newShelfName, setNewShelfName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (shelvesSource !== initialShelves) {
    setShelvesSource(initialShelves);
    setShelves(initialShelves);
  }

  const runAction = (operation: () => Promise<ActionResult>) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await operation();
        if (!result.ok) {
          setError(result.error ?? 'تعذر تنفيذ العملية. حاول مرة أخرى.');
          return;
        }
      } catch {
        setError('تعذر الاتصال بالخادم. حاول مرة أخرى.');
      }
    });
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('ar');
    return initialItems.filter((item) => {
      if (activeTab === 'reading' && item.status !== 'READING') return false;
      if (activeShelfId && item.shelfId !== activeShelfId) return false;
      return !query || `${item.title} ${item.author}`.toLocaleLowerCase('ar').includes(query);
    });
  }, [activeShelfId, activeTab, initialItems, searchQuery]);

  const selectTab = (tab: (typeof TABS)[number]['id']) => {
    setActiveTab(tab);
    setActiveShelfId(null);
  };

  const openShelf = (shelfId: string) => {
    setActiveShelfId(shelfId);
    setActiveTab('all');
    setSearchQuery('');
  };

  const createShelf = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newShelfName;
    runAction(async () => {
      const result = await createShelfAction(name);
      if (result.ok) {
        const shelf = result.shelf;
        setShelves((previous) => previous.some((item) => item.id === shelf.id) ? previous : [...previous, shelf]);
        setNewShelfName('');
      }
      return result;
    });
  };

  const activeShelf = shelves.find((shelf) => shelf.id === activeShelfId);
  const readingCount = initialItems.filter((item) => item.status === 'READING').length;
  const shelfQuery = searchQuery.trim().toLocaleLowerCase('ar');
  const visibleShelves = shelfQuery
    ? shelves.filter((shelf) => shelf.name.toLocaleLowerCase('ar').includes(shelfQuery))
    : shelves;

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC]">
      <header className="relative overflow-hidden bg-[#082F50] px-4 pb-12 pt-32 sm:px-6 sm:pb-14 sm:pt-36">
        <Image src="/library-3d-scene.png" alt="" fill priority sizes="100vw" className="object-cover object-[center_45%] opacity-45" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,43,70,0.84),rgba(6,43,70,0.68)_50%,rgba(6,43,70,0.84))]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#C29C41]/45 bg-white/10 text-[#E8C96A] sm:size-14" aria-hidden="true"><LuLibrary className="size-6 sm:size-7" /></span>
            <div>
              <p className="text-xs font-bold text-[#E8C96A]">مكتبتك الشخصية</p>
              <h1 className="mt-1 text-3xl font-bold leading-tight text-white sm:text-4xl">مكتبتي</h1>
            </div>
          </div>
          <Link href="/search" className="inline-flex min-h-12 w-fit cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C29C41] bg-[#C29C41] px-5 text-sm font-bold text-[#082F50] shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#E8C96A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C96A]"><LuPlus className="size-4" aria-hidden="true" />استكشف الإصدارات</Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#C29C41]" aria-hidden="true" />
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-10">
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 md:flex-row md:items-start lg:gap-8">
          <aside aria-label="تصفح مكتبتي" className="border-b border-[#D9E3EE] pb-5 md:w-56 md:shrink-0 md:border-b-0 md:border-e md:pb-0 md:pe-5 lg:w-72">
            <label htmlFor="library-sidebar-search" className="sr-only">{activeTab === 'shelves' ? 'البحث في الرفوف' : 'البحث في المحفوظات'}</label>
            <div className="relative">
              <LuSearch className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
              <input id="library-sidebar-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={activeTab === 'shelves' ? 'ابحث في الرفوف' : 'ابحث في المحفوظات'} className="min-h-11 w-full rounded-lg border border-[#D9E3EE] bg-white pe-3 ps-10 text-sm text-[#082F50] outline-none placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/20" />
            </div>

            <p className="mb-2 mt-6 px-3 text-xs font-bold text-[#64748B]">الأقسام</p>
            <nav className="grid grid-cols-3 gap-1 md:grid-cols-1" aria-label="أقسام مكتبتي">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const count = tab.id === 'all' ? initialItems.length : tab.id === 'reading' ? readingCount : shelves.length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => selectTab(tab.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-s-[3px] px-2 py-2 text-center text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] motion-reduce:transition-none md:min-h-12 md:flex-row md:justify-start md:gap-3 md:px-3 md:text-start md:text-sm',
                      active ? 'border-[#C29C41] bg-[#E9F2F8] text-[#082F50]' : 'border-transparent text-[#475569] hover:bg-[#E9F2F8]/70 hover:text-[#082F50]',
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="leading-tight">{tab.label}</span>
                    <span className={cn('text-[0.68rem] tabular-nums md:ms-auto', active ? 'text-[#805E1B]' : 'text-[#64748B]')}>{count.toLocaleString('ar')}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 md:flex-1">

        {activeShelf && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D9E3EE] bg-white px-4 py-3">
            <span className="flex items-center gap-2 font-semibold text-[#082F50]"><LuFolderOpen className="text-[#9A7421]" aria-hidden="true" />رف: {activeShelf.name}</span>
            <button type="button" onClick={() => setActiveShelfId(null)} className="min-h-9 cursor-pointer text-sm font-semibold text-[#0B5688] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">عرض كل المحفوظات</button>
          </div>
        )}

        {activeTab === 'shelves' ? (
          <section aria-label="الرفوف">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-[#082F50]">رفوفك</h2>
                <p className="mt-1 text-sm text-[#64748B]">نظّم الإصدارات في مجموعات يسهل الرجوع إليها.</p>
              </div>
              <span className="rounded-full border border-[#D9E3EE] bg-white px-3 py-1.5 text-xs font-bold tabular-nums text-[#475569]">عدد الرفوف: {shelves.length.toLocaleString('ar')}</span>
            </div>

            <form onSubmit={createShelf} className="mb-8 rounded-2xl border border-[#D9E3EE] bg-[#EDF4F8] p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#082F50] text-[#E8C96A]" aria-hidden="true"><LuPlus className="size-5" /></span>
                <div>
                  <h3 className="text-sm font-bold text-[#082F50]">إنشاء رف جديد</h3>
                  <p className="text-xs text-[#475569]">امنح مجموعتك اسماً لتجد إصداراتها بسهولة.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <label className="min-w-0">
                  <span className="mb-2 block text-xs font-semibold text-[#082F50]">اسم الرف</span>
                  <input
                    value={newShelfName}
                    onChange={(event) => setNewShelfName(event.target.value)}
                    maxLength={60}
                    placeholder="مثال: الطاقة المتجددة"
                    className="h-11 w-full rounded-lg border border-[#D9E3EE] bg-white px-4 text-sm text-[#082F50] outline-none placeholder:text-[#64748B] focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/20"
                  />
                </label>
                <button type="submit" disabled={isPending || !newShelfName.trim()} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#082F50] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0A527E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] disabled:cursor-not-allowed disabled:bg-[#D9E3EE] disabled:text-[#475569] sm:w-auto">
                  <LuPlus className="size-4" aria-hidden="true" /> إنشاء الرف
                </button>
              </div>
            </form>

            <div className="space-y-3">
              {visibleShelves.map((shelf) => (
                <article key={shelf.id} className="flex flex-col gap-4 rounded-2xl border border-[#D9E3EE] bg-white p-4 transition-colors duration-200 hover:border-[#C29C41]/60 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <button type="button" onClick={() => openShelf(shelf.id)} className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#FFF8E8] text-[#9A7421]"><LuFolderOpen className="size-6" aria-hidden="true" /></span>
                    <span className="min-w-0"><span className="block truncate text-base font-bold text-[#082F50]">{shelf.name}</span><span className="mt-1 block text-xs text-[#64748B]">{shelf.itemCount.toLocaleString('ar')} {shelf.itemCount === 1 ? 'إصدار' : 'إصدارات'}</span></span>
                  </button>
                  <div className="flex items-center justify-between gap-3 border-t border-[#E7ECF2] pt-3 sm:justify-end sm:border-t-0 sm:pt-0">
                    <button type="button" onClick={() => openShelf(shelf.id)} className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-[#C29C41]/50 px-4 text-sm font-semibold text-[#082F50] transition-colors hover:bg-[#FFF8E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">عرض الإصدارات</button>
                    <button type="button" disabled={isPending} onClick={() => { if (window.confirm(`حذف رف «${shelf.name}»؟ ستبقى الإصدارات محفوظة في مكتبتك.`)) runAction(async () => { const result = await deleteShelfAction(shelf.id); if (result.ok) setShelves((previous) => previous.filter((item) => item.id !== shelf.id)); return result; }); }} className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-50"><LuTrash2 className="size-4" aria-hidden="true" />حذف</button>
                  </div>
                </article>
              ))}
              {!visibleShelves.length && <EmptyState title={shelfQuery ? 'لا توجد رفوف مطابقة' : 'لا توجد رفوف بعد'} description={shelfQuery ? 'جرّب اسماً آخر أو امسح البحث لعرض جميع الرفوف.' : 'أنشئ رفك الأول لتنظيم الإصدارات حسب الموضوع أو المشروع.'} />}
            </div>
          </section>
        ) : (
          <section aria-busy={isPending}>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#082F50]">{activeShelf ? 'إصدارات الرف' : activeTab === 'reading' ? 'قيد القراءة' : 'إصداراتك المحفوظة'}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{filteredItems.length.toLocaleString('ar')} {filteredItems.length === 1 ? 'إصدار' : 'إصدارات'}</p>
              </div>
            </div>
            <div className="grid w-full max-w-[800px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {filteredItems.map((book) => {
                const siblingItems = initialItems.filter((item) => item.shelfId === book.shelfId);
                const siblingIndex = siblingItems.findIndex((item) => item.id === book.id);
                const shelfName = shelves.find((shelf) => shelf.id === book.shelfId)?.name;

                return (
                  <article
                    key={book.id}
                    className={cn(
                      'group relative flex w-full min-w-0 flex-col rounded-2xl border border-[#0B5688]/10 bg-white p-2.5 shadow-[0_4px_18px_rgba(8,47,80,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/35 hover:shadow-[0_16px_35px_rgba(8,47,80,0.12)] motion-reduce:transform-none',
                      isPending && 'opacity-70',
                    )}
                  >
                    <div className="relative">
                      <Link href={book.isAvailable ? `/book/${book.slug}` : '#'} aria-disabled={!book.isAvailable} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-[#E9F2F8] ring-1 ring-black/5">
                        {book.cover ? (
                          <Image src={book.cover} alt={book.title} fill sizes="(max-width: 640px) 46vw, (max-width: 1023px) 30vw, (max-width: 1279px) 20vw, 260px" className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
                        ) : (
                          <span className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-[#0A527E]"><LuBookOpen className="size-8 text-[#C29C41]" /><span className="line-clamp-4 text-xs font-bold leading-5">{book.title}</span></span>
                        )}
                        <span className="absolute bottom-2 start-2 rounded-full border border-white/15 bg-[#082F50]/88 px-2.5 py-1 text-[0.62rem] font-bold text-white shadow-sm backdrop-blur-md">{STATUS_LABEL[book.status]}</span>
                        {!book.isAvailable && <span className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-red-950/88 px-2 py-1.5 text-center text-[0.68rem] font-bold text-white">غير متاح حاليا</span>}
                      </Link>
                      <BookOptions key={`${book.id}-${book.status}-${book.shelfId ?? 'none'}`} book={book} shelves={shelves} onShelvesLoaded={setShelves} isPending={isPending} canMoveUp={siblingIndex > 0} canMoveDown={siblingIndex >= 0 && siblingIndex < siblingItems.length - 1} runAction={runAction} />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col px-1 pb-1 pt-3">
                      <Link href={book.isAvailable ? `/book/${book.slug}` : '#'} className="line-clamp-2 min-h-10 text-sm font-bold leading-6 text-[#082F50] transition hover:text-[#0B5688] sm:text-base">{book.title}</Link>
                      <p className="mt-1 truncate text-xs text-[#64748B] sm:text-sm">{book.author}</p>
                      {shelfName && <p className="mt-2 flex min-w-0 items-center gap-1 text-[0.68rem] font-semibold text-[#805E1B]"><LuFolderOpen className="size-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{shelfName}</span></p>}
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredItems.length && (
              <EmptyState
                title={searchQuery ? 'لا توجد نتائج في مكتبتك' : activeShelf ? 'هذا الرف فارغ' : activeTab === 'reading' ? 'لا توجد إصدارات قيد القراءة' : 'مكتبتك فارغة'}
                description={searchQuery ? 'جرّب عنواناً أو اسم مؤلف آخر، أو امسح البحث لعرض المحفوظات.' : activeShelf ? 'انقل إصداراً إلى هذا الرف من قائمة الخيارات على غلاف الإصدار.' : activeTab === 'reading' ? 'غيّر حالة أحد إصداراتك إلى «أقرأ حاليا» من قائمة الخيارات على غلافه.' : 'استكشف الإصدارات واحفظ ما تريد الرجوع إليه.'}
                showBrowse={!searchQuery && !activeShelfId && activeTab === 'all'}
              />
            )}
          </section>
        )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BookOptions({
  book,
  shelves,
  onShelvesLoaded,
  isPending,
  canMoveUp,
  canMoveDown,
  runAction,
}: {
  book: LibraryItem;
  shelves: LibraryShelf[];
  onShelvesLoaded: (shelves: LibraryShelf[]) => void;
  isPending: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  runAction: (operation: () => Promise<ActionResult>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<'status' | 'shelf' | null>(null);
  const [selectedShelfId, setSelectedShelfId] = useState(book.shelfId ?? '__none__');
  const [shelvesError, setShelvesError] = useState<string | null>(null);
  const [shelvesPending, startShelvesTransition] = useTransition();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setActivePicker(null);
      return;
    }
    setSelectedShelfId(book.shelfId ?? '__none__');
    setShelvesError(null);
    startShelvesTransition(async () => {
      try {
        onShelvesLoaded(await getLibraryShelvesAction());
      } catch {
        setShelvesError('تعذر تحديث الرفوف. افتح القائمة مرة أخرى.');
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          aria-label={`خيارات ${book.title}`}
          className="absolute end-2 top-2 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#082F50]/78 text-white shadow-[0_6px_18px_rgba(8,47,80,0.28)] backdrop-blur-md transition hover:border-[#C29C41] hover:bg-[#082F50] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#082F50] disabled:opacity-50"
        >
          <LuEllipsisVertical className="size-5" aria-hidden="true" />
        </button>
      </PopoverTrigger>

      <PopoverContent dir="rtl" className="w-[min(19rem,calc(100vw-1.5rem))] p-0">
        <div className="relative border-b border-[#0B5688]/10 bg-[#F8FAFC] px-4 py-3.5">
          <span className="absolute inset-y-0 start-0 w-1 bg-[#C29C41]" aria-hidden="true" />
          <p className="text-xs font-bold text-[#8B681C]">إدارة الإصدار</p>
          <p className="mt-1 line-clamp-1 text-sm font-bold text-[#082F50]">{book.title}</p>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <span className="text-[0.68rem] font-bold text-[#64748B]">حالة القراءة</span>
            <button type="button" disabled={isPending} aria-expanded={activePicker === 'status'} aria-controls={`library-status-options-${book.id}`} onClick={() => setActivePicker(activePicker === 'status' ? null : 'status')} className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-[#D9E3EE] bg-white px-3 text-xs font-bold text-[#082F50] hover:border-[#C29C41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] disabled:opacity-50">
              {STATUS_LABEL[book.status]}<LuChevronDown className="size-4 text-[#64748B]" aria-hidden="true" />
            </button>
            {activePicker === 'status' && (
              <div id={`library-status-options-${book.id}`} className="space-y-1 rounded-xl border border-[#D9E3EE] bg-[#F8FAFC] p-1">
                {Object.entries(STATUS_LABEL).map(([status, label]) => (
                  <button key={status} type="button" disabled={isPending} onClick={() => { setActivePicker(null); if (status !== book.status) runAction(() => updateLibraryItemAction(book.id, { status })); }} className="flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-start text-xs font-semibold text-[#082F50] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#C29C41] disabled:opacity-50">
                    {label}{status === book.status && <LuCheck className="size-4 text-[#9A7421]" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-[0.68rem] font-bold text-[#64748B]">الرف</span>
            <button type="button" disabled={isPending || shelvesPending} aria-expanded={activePicker === 'shelf'} aria-controls={`library-shelf-options-${book.id}`} onClick={() => setActivePicker(activePicker === 'shelf' ? null : 'shelf')} className="flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border border-[#D9E3EE] bg-white px-3 text-xs font-bold text-[#082F50] hover:border-[#C29C41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41] disabled:opacity-50">
              <span className="truncate">{shelves.find((shelf) => shelf.id === selectedShelfId)?.name ?? 'بدون رف'}</span><LuChevronDown className="size-4 shrink-0 text-[#64748B]" aria-hidden="true" />
            </button>
            {activePicker === 'shelf' && (
              <div id={`library-shelf-options-${book.id}`} className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-[#D9E3EE] bg-[#F8FAFC] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[{ id: '__none__', name: 'بدون رف' }, ...shelves].map((shelf) => (
                  <button key={shelf.id} type="button" disabled={isPending} onClick={() => {
                    setActivePicker(null);
                    if (shelf.id === selectedShelfId) return;
                    setSelectedShelfId(shelf.id);
                    runAction(async () => {
                      try {
                        const result = await updateLibraryItemAction(book.id, { shelfId: shelf.id === '__none__' ? null : shelf.id });
                        if (!result.ok) setSelectedShelfId(book.shelfId ?? '__none__');
                        return result;
                      } catch (error) {
                        setSelectedShelfId(book.shelfId ?? '__none__');
                        throw error;
                      }
                    });
                  }} className="flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-start text-xs font-semibold text-[#082F50] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#C29C41] disabled:opacity-50">
                    <span className="truncate">{shelf.name}</span>{shelf.id === selectedShelfId && <LuCheck className="size-4 shrink-0 text-[#9A7421]" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
            {shelvesPending && <span className="block text-[0.68rem] text-[#64748B]">جار تحديث الرفوف...</span>}
            {shelvesError && <span role="alert" className="block text-[0.68rem] text-red-700">{shelvesError}</span>}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-[#082F50]/[0.07] pt-4" aria-label="ترتيب الكتاب">
            <button
              type="button"
              disabled={!canMoveUp || isPending}
              onClick={() => runAction(() => moveLibraryItemAction(book.id, 'up'))}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E3EE] text-xs font-bold text-[#0B5688] transition hover:border-[#C29C41]/60 hover:bg-[#FFF8E8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <LuArrowUp /> للأعلى
            </button>
            <button
              type="button"
              disabled={!canMoveDown || isPending}
              onClick={() => runAction(() => moveLibraryItemAction(book.id, 'down'))}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E3EE] text-xs font-bold text-[#0B5688] transition hover:border-[#C29C41]/60 hover:bg-[#FFF8E8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <LuArrowDown /> للأسفل
            </button>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (window.confirm('إزالة هذا الكتاب من مكتبتك؟')) {
                setOpen(false);
                runAction(() => removeLibraryItemAction(book.id));
              }
            }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-xs font-bold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-40"
          >
            <LuTrash2 /> إزالة من مكتبتي
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EmptyState({ title, description, showBrowse = false }: { title: string; description: string; showBrowse?: boolean }) {
  return (
    <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-white px-5 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#FFF8E8] text-[#9A7421]"><LuLibrary className="size-6" aria-hidden="true" /></span>
      <h2 className="text-lg font-bold text-[#082F50]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">{description}</p>
      {showBrowse && <Link href="/search" className="mt-5 inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-[#082F50] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0A527E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C29C41]">استكشف الإصدارات</Link>}
    </div>
  );
}
