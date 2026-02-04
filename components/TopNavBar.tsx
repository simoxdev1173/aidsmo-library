'use client';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuMenu, LuX } from 'react-icons/lu';

// Arabic menu items with their IDs and labels
const menuItemsData = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'about', label: 'عن المكتبة' },
  { id: 'contact', label: 'اتصل بنا' },
  { id: 'newsletter', label: 'النشرة البريدية' },
];

// فهرس المكتبة dropdown items
const catalogItems = [
  { id: 'industry', label: 'الصناعة', link: '/catalog/industry' },
  { id: 'standardization', label: 'التقييس', link: '/catalog/standardization' },
  { id: 'mining', label: 'التعدين', link: '/catalog/mining' },
];

const TopNavBar = ({
  position = 'fixed',
}: {
  position?: 'sticky' | 'fixed';
}) => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY >= 80) {
          navbarRef.current.classList.add('nav-sticky');
        } else {
          navbarRef.current.classList.remove('nav-sticky');
        }
      }
      activeSection();
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [activation, setActivation] = useState<string>('home');

  const activeSection = () => {
    const scrollY = window.scrollY;

    for (let i = menuItemsData.length - 1; i >= 0; i--) {
      const section = menuItemsData[i].id;
      const el: HTMLElement | null = document.getElementById(section);
      if (el && el.offsetTop <= scrollY + 100) {
        setActivation(section);
        return;
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={navbarRef}
        id="navbar"
        className={cn(
          position,
          'inset-x-0 top-0 z-[60] w-full border-b border-[#e2e8f0] bg-white shadow-sm transition-all duration-300'
        )}
      >
        <div className="flex h-full items-center py-3">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/lib-logo.svg"
                    alt="شعار المكتبة"
                    height={100}
                    width={120}
                    className="h-32 w-auto"
                  />
                </Link>
              </div>

              {/* Desktop Menu - Centered */}
              <ul className="hidden items-center justify-center gap-1 lg:flex">
                {menuItemsData.map((item) => (
                  <li key={item.id}>
                    <Link
                      className={cn(
                        'rounded-lg px-4 py-2 text-base font-medium text-[#334155] transition-all duration-300 hover:bg-[#F0F7FC] hover:text-[#0369a1]',
                        activation === item.id && 'bg-[#F0F7FC] text-[#0369a1]'
                      )}
                      href={`#${item.id}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}

                {/* فهرس المكتبة Dropdown */}
                <li className="group relative">
                  <button
                    className="flex items-center gap-1 rounded-lg px-4 py-2 text-base font-medium text-[#334155] transition-all duration-300 hover:bg-[#F0F7FC] hover:text-[#0369a1]"
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    فهرس المكتبة
                    <LuChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div
                    className={cn(
                      'absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-[#e2e8f0] bg-white p-2 shadow-lg transition-all duration-200',
                      catalogOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-2 opacity-0'
                    )}
                    onMouseEnter={() => setCatalogOpen(true)}
                    onMouseLeave={() => setCatalogOpen(false)}
                  >
                    <ul className="flex flex-col gap-1">
                      {catalogItems.map((item) => (
                        <li key={item.id}>
                          <Link
                            className={cn(
                              'block rounded-md px-4 py-2.5 text-sm font-medium text-[#475569] transition-all hover:bg-[#F0F7FC] hover:text-[#0369a1]',
                              pathname === item.link && 'bg-[#F0F7FC] text-[#0369a1]'
                            )}
                            href={item.link}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              {/* Login Button - Desktop */}
              <div className="hidden lg:block">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0369a1] px-6 py-2.5 text-base font-medium text-white transition-all hover:bg-[#075985]"
                >
                  تسجيل الدخول
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="inline-flex items-center justify-center rounded-lg p-2 text-[#334155] hover:bg-[#F0F7FC] hover:text-[#0369a1] lg:hidden"
                onClick={toggleMobileMenu}
                aria-label="فتح القائمة"
              >
                <LuMenu className="h-7 w-7" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 lg:hidden',
          mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          'fixed bottom-0 right-0 top-0 z-[80] h-screen w-full max-w-[300px] transform border-l border-[#e2e8f0] bg-white transition-transform duration-300 lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Mobile Menu Header */}
        <div className="flex h-[72px] items-center justify-between border-b border-[#e2e8f0] px-4">
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="/logo-lib.png"
              alt="شعار المكتبة"
              height={40}
              width={100}
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-[#334155] hover:bg-[#F0F7FC] hover:text-[#0369a1]"
            aria-label="إغلاق القائمة"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="h-[calc(100%-72px)] overflow-y-auto p-4">
          <nav>
            <ul className="space-y-1">
              {menuItemsData.map((item) => (
                <li key={item.id}>
                  <Link
                    className={cn(
                      'block rounded-lg px-4 py-3 text-base font-medium text-[#334155] transition-all duration-300 hover:bg-[#F0F7FC] hover:text-[#0369a1]',
                      activation === item.id && 'bg-[#F0F7FC] text-[#0369a1]'
                    )}
                    href={`#${item.id}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* فهرس المكتبة Accordion */}
              <li>
                <button
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium text-[#334155] transition-all duration-300 hover:bg-[#F0F7FC] hover:text-[#0369a1]"
                  onClick={() => setCatalogOpen(!catalogOpen)}
                >
                  فهرس المكتبة
                  <LuChevronDown
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      catalogOpen && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    catalogOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <ul className="mt-1 space-y-1 pr-4">
                    {catalogItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          className={cn(
                            'block rounded-lg px-4 py-2.5 text-sm font-medium text-[#475569] transition-all hover:bg-[#F0F7FC] hover:text-[#0369a1]',
                            pathname === item.link && 'bg-[#F0F7FC] text-[#0369a1]'
                          )}
                          href={item.link}
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>

            {/* Mobile Login Button */}
            <div className="mt-6 border-t border-[#e2e8f0] pt-6">
              <Link
                href="/login"
                className="block w-full rounded-lg bg-[#0369a1] px-6 py-3 text-center text-base font-medium text-white transition-all hover:bg-[#075985]"
                onClick={closeMobileMenu}
              >
                تسجيل الدخول
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default TopNavBar;