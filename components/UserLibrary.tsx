'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  LuArrowDown,
  LuArrowUp,
  LuBookOpen,
  LuCheck,
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
  moveLibraryItemAction,
  removeLibraryItemAction,
  updateLibraryItemAction,
} from '@/lib/user-library-actions';
import { cn } from '@/utils/cn';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  { id: 'all', label: 'جميع الكتب', icon: LuLibrary },
  { id: 'reading', label: 'أقرأ حاليا', icon: LuClock3 },
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('all');
  const [activeShelfId, setActiveShelfId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newShelfName, setNewShelfName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runAction = (operation: () => Promise<ActionResult>) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await operation();
        if (!result.ok) {
          setError(result.error ?? 'تعذر تنفيذ العملية. حاول مرة أخرى.');
          return;
        }
        router.refresh();
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
    if (tab !== 'all') setActiveShelfId(null);
  };

  const openShelf = (shelfId: string) => {
    setActiveShelfId(shelfId);
    setActiveTab('all');
  };

  const createShelf = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newShelfName;
    runAction(async () => {
      const result = await createShelfAction(name);
      if (result.ok) setNewShelfName('');
      return result;
    });
  };

  const activeShelf = initialShelves.find((shelf) => shelf.id === activeShelfId);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC]">
      <header className="relative overflow-hidden bg-gradient-to-br from-[#022A4E] to-[#034582] px-4 pb-10 pt-28 shadow-lg sm:px-6 sm:pb-12 sm:pt-32">
        <div className="pointer-events-none absolute -end-20 -top-20 size-72 rounded-full bg-[#C29C41]/10 blur-[80px]" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#E8C96A]">مكتبتي الشخصية</p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">مرحباً بعودتك</h1>
            <p className="mt-2 text-sm text-[#B9DDF5] sm:text-base">
              {initialItems.length ? `${initialItems.length} عناصر محفوظة، مرتبة كما تحب.` : 'احفظ إصداراتك المفضلة لتظهر هنا على جميع أجهزتك.'}
            </p>
          </div>

          <form action="/search" method="get" className="relative block w-full md:w-80">
            <label htmlFor="library-search" className="sr-only">ابحث في مكتبتك</label>
            <input
              id="library-search"
              name="q"
              type="search"
              minLength={2}
              maxLength={120}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث في مكتبتك..."
              className="h-12 w-full rounded-full border border-white/20 bg-white/95 pe-4 ps-11 text-sm text-[#0A2540] shadow-sm outline-none transition focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/40"
            />
            <button type="submit" aria-label="البحث في فهرس المكتبة" className="absolute start-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#0B4E84] transition hover:bg-[#F0F7FC] focus:outline-none focus:ring-2 focus:ring-[#C29C41]">
              <LuSearch className="size-4" />
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <nav className="mb-7 overflow-x-auto border-b border-[#0A2540]/10" aria-label="أقسام مكتبتي">
          <div className="flex min-w-max gap-7">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id && !activeShelfId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={cn(
                    'relative flex min-h-11 items-center gap-2 pb-3 text-sm font-bold transition',
                    active ? 'text-[#0B4E84]' : 'text-[#64748B] hover:text-[#0A2540]',
                  )}
                >
                  <Icon className={cn('size-4.5', active && 'text-[#C29C41]')} />
                  {tab.label}
                  {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#C29C41]" />}
                </button>
              );
            })}
          </div>
        </nav>

        {activeShelf && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#C29C41]/25 bg-[#FFF8E8] px-4 py-3">
            <span className="flex items-center gap-2 font-bold text-[#0A2540]"><LuFolderOpen className="text-[#C29C41]" /> {activeShelf.name}</span>
            <button type="button" onClick={() => setActiveShelfId(null)} className="text-sm font-bold text-[#0369A1] hover:text-[#8A6A1D]">عرض جميع الكتب</button>
          </div>
        )}

        {activeTab === 'shelves' ? (
          <section aria-label="الرفوف">
            <form onSubmit={createShelf} className="mb-7 flex flex-col gap-3 rounded-2xl border border-[#0369A1]/10 bg-white p-4 shadow-sm sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">اسم الرف الجديد</span>
                <input
                  value={newShelfName}
                  onChange={(event) => setNewShelfName(event.target.value)}
                  maxLength={60}
                  placeholder="مثال: أبحاث الطاقة المتجددة"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#C29C41] focus:ring-2 focus:ring-[#C29C41]/20"
                />
              </label>
              <button disabled={isPending} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B4E84] px-5 text-sm font-bold text-white transition hover:bg-[#083C67] disabled:opacity-60">
                <LuPlus /> إنشاء رف
              </button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {initialShelves.map((shelf) => (
                <article key={shelf.id} className="group rounded-2xl border border-[#0369A1]/10 bg-white p-5 shadow-sm transition hover:border-[#C29C41]/40 hover:shadow-md">
                  <button type="button" onClick={() => openShelf(shelf.id)} className="w-full text-start">
                    <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#F0F7FC] text-[#0369A1]"><LuFolderOpen className="size-5" /></span>
                    <h2 className="font-bold text-[#0A2540] group-hover:text-[#0369A1]">{shelf.name}</h2>
                    <p className="mt-1 text-sm text-[#64748B]">{shelf.itemCount} عناصر محفوظة</p>
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (window.confirm(`حذف رف «${shelf.name}»؟ ستبقى الكتب محفوظة في مكتبتك.`)) {
                        runAction(() => deleteShelfAction(shelf.id));
                      }
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <LuTrash2 /> حذف الرف
                  </button>
                </article>
              ))}
              {!initialShelves.length && <EmptyState title="لا توجد رفوف بعد" description="أنشئ رفك الأول لتنظيم الكتب حسب الموضوع أو المشروع." />}
            </div>
          </section>
        ) : (
          <section aria-busy={isPending}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {filteredItems.map((book) => {
                const siblingItems = filteredItems.filter((item) => item.shelfId === book.shelfId);
                const siblingIndex = siblingItems.findIndex((item) => item.id === book.id);

                return (
                  <article
                    key={book.id}
                    className={cn(
                      'group relative flex min-w-0 flex-col rounded-2xl border border-[#0369A1]/10 bg-white p-2 shadow-[0_4px_18px_rgba(10,37,64,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C29C41]/35 hover:shadow-[0_16px_35px_rgba(10,37,64,0.12)] motion-reduce:transform-none',
                      isPending && 'opacity-70',
                    )}
                  >
                    <div className="relative">
                      <Link
                        href={book.isAvailable ? `/book/${book.slug}` : '#'}
                        aria-disabled={!book.isAvailable}
                        className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-[#EAF2F8] ring-1 ring-black/5"
                      >
                        {book.cover ? (
                          <Image
                            src={book.cover}
                            alt={book.title}
                            fill
                            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 20vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                          />
                        ) : (
                          <span className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-[#0B4E84]">
                            <LuBookOpen className="size-8 text-[#C29C41]" />
                            <span className="line-clamp-4 text-xs font-bold leading-5">{book.title}</span>
                          </span>
                        )}
                        <span className="absolute bottom-2 start-2 rounded-full border border-white/15 bg-[#0A2540]/88 px-2.5 py-1 text-[0.62rem] font-bold text-white shadow-sm backdrop-blur-md">
                          {STATUS_LABEL[book.status]}
                        </span>
                        {!book.isAvailable && (
                          <span className="absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-red-950/88 px-2 py-1.5 text-center text-[0.68rem] font-bold text-white">
                            غير متاح حاليا
                          </span>
                        )}
                      </Link>

                      <BookOptions
                        key={`${book.id}-${book.status}-${book.progress}-${book.shelfId ?? 'none'}`}
                        book={book}
                        shelves={initialShelves}
                        isPending={isPending}
                        canMoveUp={siblingIndex > 0}
                        canMoveDown={siblingIndex >= 0 && siblingIndex < siblingItems.length - 1}
                        runAction={runAction}
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col px-1 pb-1 pt-3">
                      <Link
                        href={book.isAvailable ? `/book/${book.slug}` : '#'}
                        className="line-clamp-2 min-h-10 text-xs font-bold leading-5 text-[#0A2540] transition hover:text-[#0369A1] sm:text-sm"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-1 truncate text-[0.68rem] text-[#64748B] sm:text-xs">{book.author}</p>
                      <div className="mt-3 flex items-center gap-2" aria-label={`نسبة التقدم ${book.progress}%`}>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EAF2F8]">
                          <div
                            className={cn('h-full rounded-full transition-[width] duration-500', book.progress === 100 ? 'bg-emerald-500' : 'bg-[#C29C41]')}
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <span className="w-7 text-end text-[0.62rem] font-bold tabular-nums text-[#8B681C]">{book.progress}%</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredItems.length && (
              <EmptyState
                title={searchQuery ? 'لم نعثر على نتائج' : activeTab === 'reading' ? 'لا توجد كتب قيد القراءة' : 'مكتبتك فارغة'}
                description={searchQuery ? 'جرّب عبارة بحث مختلفة.' : 'افتح أي إصدار واضغط «حفظ» لإضافته إلى مكتبتك.'}
                showBrowse={!searchQuery && !activeShelfId}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function BookOptions({
  book,
  shelves,
  isPending,
  canMoveUp,
  canMoveDown,
  runAction,
}: {
  book: LibraryItem;
  shelves: LibraryShelf[];
  isPending: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  runAction: (operation: () => Promise<ActionResult>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(book.progress);
  const committedProgress = useRef(book.progress);

  const commitProgress = () => {
    if (progress === committedProgress.current) return;
    committedProgress.current = progress;
    runAction(() => updateLibraryItemAction(book.id, { progress }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          aria-label={`خيارات ${book.title}`}
          className="absolute end-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-white/25 bg-[#0A2540]/78 text-white shadow-[0_6px_18px_rgba(10,37,64,0.28)] backdrop-blur-md transition hover:border-[#C29C41] hover:bg-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#0A2540] disabled:opacity-50"
        >
          <LuEllipsisVertical className="size-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent dir="rtl" className="w-[min(19rem,calc(100vw-1.5rem))] p-0">
        <div className="relative border-b border-[#0369A1]/10 bg-[#F8FAFC] px-4 py-3.5">
          <span className="absolute inset-y-0 start-0 w-1 bg-[#C29C41]" aria-hidden="true" />
          <p className="text-xs font-bold text-[#8B681C]">خيارات الكتاب</p>
          <p className="mt-1 line-clamp-1 text-sm font-bold text-[#0A2540]">{book.title}</p>
        </div>

        <div className="space-y-4 p-4">
          <label className="block space-y-1.5">
            <span className="text-[0.68rem] font-bold text-[#64748B]">حالة القراءة</span>
            <Select
              value={book.status}
              disabled={isPending}
              onValueChange={(status) => runAction(() => updateLibraryItemAction(book.id, { status }))}
            >
              <SelectTrigger className="h-10 rounded-xl px-3 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-[0.68rem] font-bold text-[#64748B]">الرف</span>
            <Select
              value={book.shelfId ?? '__none__'}
              disabled={isPending}
              onValueChange={(shelfId) => runAction(() => updateLibraryItemAction(book.id, { shelfId: shelfId === '__none__' ? null : shelfId }))}
            >
              <SelectTrigger className="h-10 rounded-xl px-3 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">بدون رف</SelectItem>
                {shelves.map((shelf) => (
                  <SelectItem key={shelf.id} value={shelf.id}>{shelf.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block space-y-2">
            <span className="flex items-center justify-between text-[0.68rem] font-bold text-[#64748B]">
              نسبة التقدم
              <span className="rounded-full bg-[#FFF8E8] px-2 py-0.5 tabular-nums text-[#8B681C]">{progress}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              disabled={isPending}
              onChange={(event) => setProgress(Number(event.currentTarget.value))}
              onPointerUp={commitProgress}
              onKeyUp={(event) => {
                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) commitProgress();
              }}
              onBlur={commitProgress}
              className="h-2 w-full cursor-pointer accent-[#C29C41] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>

          <div className="grid grid-cols-2 gap-2 border-t border-[#0A2540]/[0.07] pt-4" aria-label="ترتيب الكتاب">
            <button
              type="button"
              disabled={!canMoveUp || isPending}
              onClick={() => runAction(() => moveLibraryItemAction(book.id, 'up'))}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E3EE] text-xs font-bold text-[#0369A1] transition hover:border-[#C29C41]/60 hover:bg-[#FFF8E8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <LuArrowUp /> للأعلى
            </button>
            <button
              type="button"
              disabled={!canMoveDown || isPending}
              onClick={() => runAction(() => moveLibraryItemAction(book.id, 'down'))}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#D9E3EE] text-xs font-bold text-[#0369A1] transition hover:border-[#C29C41]/60 hover:bg-[#FFF8E8] disabled:cursor-not-allowed disabled:opacity-35"
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
    <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#0369A1]/20 bg-white px-5 py-12 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#FFF8E8] text-[#C29C41]"><LuCheck className="size-6" /></span>
      <h2 className="text-lg font-bold text-[#0A2540]">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">{description}</p>
      {showBrowse && <Link href="/" className="mt-5 inline-flex h-10 items-center rounded-full bg-[#0B4E84] px-5 text-sm font-bold text-white hover:bg-[#083C67]">تصفح الإصدارات</Link>}
    </div>
  );
}
