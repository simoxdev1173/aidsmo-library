import Image from 'next/image';
import Link from 'next/link';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBookOpen,
  HiOutlineHome,
  HiOutlineSquares2X2,
} from 'react-icons/hi2';
import { logoutAction } from '@/lib/library-actions';
import { cn } from '@/utils';

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: HiOutlineSquares2X2 },
  { href: '/dashboard/entries', label: 'المداخل', icon: HiOutlineBookOpen },
  { href: '/dashboard/other', label: 'إعدادات أخرى', icon: HiOutlineAdjustmentsHorizontal },
  { href: '/', label: 'عرض الموقع', icon: HiOutlineHome },
];

export default function DashboardShell({
  admin,
  children,
}: {
  admin: { name: string; email: string };
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F8FB] text-[#0A2540]">
      <aside className="fixed bottom-0 right-0 top-0 z-30 hidden w-72 border-l border-[#D9E3EE] bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-[#D9E3EE] px-6 py-5">
            <Image src="/logo-2.png" alt="المكتبة الرقمية" width={170} height={80} className="h-16 w-auto object-contain" priority />
            <p className="mt-3 text-sm font-semibold text-[#475569]">إدارة المكتبة الرقمية</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-4 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-bold text-[#334155] transition duration-200 hover:bg-[#F0F7FC] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]',
                  )}
                >
                  <Icon className="h-5 w-5 text-[#C29C41]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#D9E3EE] p-4">
            <div className="mb-3 rounded-md bg-[#F8FAFC] p-3">
              <p className="text-sm font-bold text-[#0A2540]">{admin.name}</p>
              <p className="mt-1 text-xs text-[#64748B]" dir="ltr">{admin.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#D9E3EE] bg-white text-sm font-bold text-[#334155] transition duration-200 hover:border-[#C29C41] hover:text-[#0369A1] focus:outline-none focus:ring-2 focus:ring-[#C29C41]"
              >
                <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
                تسجيل الخروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pr-72">
        <header className="sticky top-0 z-20 border-b border-[#D9E3EE] bg-white/92 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Image src="/logo-2.png" alt="المكتبة الرقمية" width={130} height={60} className="h-12 w-auto object-contain" />
            <form action={logoutAction}>
              <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-md border border-[#D9E3EE] text-[#334155]">
                <HiOutlineArrowLeftOnRectangle className="h-5 w-5" />
              </button>
            </form>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-2 rounded-md border border-[#D9E3EE] bg-white px-3 py-2 text-xs font-bold text-[#334155]">
                  <Icon className="h-4 w-4 text-[#C29C41]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
