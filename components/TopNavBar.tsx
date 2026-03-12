'use client';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuChevronDown, LuMenu, LuX, LuSearch } from 'react-icons/lu';

const menuItemsData = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'about', label: 'عن المكتبة' },
  { id: 'contact', label: 'اتصل بنا' },
];

const TopNavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = menuItemsData.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
        isScrolled ? 'top-2 px-4 md:px-8' : 'top-0 px-0'
      )}>
        <nav className={cn(
          'mx-auto max-w-7xl transition-all duration-500',
          isScrolled 
            ? 'rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md py-2' 
            : 'border-b border-transparent bg-transparent py-5'
        )}>
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between gap-8">
              
              {/* Logo Area */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/lib-logo.svg"
                    alt="Logo"
                    height={50}
                    width={60}
                    className={cn("transition-all duration-500", isScrolled ? "h-22 w-auto" : "h-24 w-auto")}
                  />
                </Link>
              </div>

              {/* Desktop Menu - Centered */}
              <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
                {menuItemsData.map((item) => (
                  <li key={item.id} className="relative">
                    <Link
                      href={`#${item.id}`}
                      className={cn(
                        'relative px-4 py-2 text-sm font-bold transition-all duration-300',
                        activeSection === item.id ? 'text-[#0369a1]' : 'text-slate-600 hover:text-[#0369a1]'
                      )}
                    >
                      {item.label}
                      {/* {activeSection === item.id && (
                        <span className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-[#0369a1]" />
                      )} */}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Search Bar - Replacing Login */}
              <div className="hidden items-center lg:flex">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="ابحث عن الكتب، المقالات..."
                    className="h-11 w-64 rounded-full border border-slate-200 bg-slate-100/50 pr-11 pl-4 text-sm font-medium text-slate-700 outline-none transition-all duration-300 focus:w-80 focus:border-[#0369a1] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0369a1]">
                    <LuSearch size={18} />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="rounded-xl bg-slate-100 p-2.5 text-slate-700 hover:bg-[#0369a1] hover:text-white lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <LuMenu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm lg:hidden",
        mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0 transition-opacity"
      )} onClick={() => setMobileMenuOpen(false)} />
      
      <div className={cn(
        "fixed bottom-0 right-0 top-0 z-[110] w-[85%] max-w-xs bg-white p-6 transition-transform duration-500 lg:hidden",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <Image src="/lib-logo.svg" alt="Logo" height={40} width={40} />
          <button onClick={() => setMobileMenuOpen(false)} className="rounded-full bg-slate-100 p-2"><LuX size={20} /></button>
        </div>
        
        <div className="mb-6 relative">
           <input
            type="text"
            placeholder="بحث..."
            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pr-10 pl-4 text-sm"
          />
          <LuSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>

        <nav className="flex flex-col gap-2">
          {menuItemsData.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-xl px-4 py-4 text-lg font-bold",
                activeSection === item.id ? "bg-blue-50 text-[#0369a1]" : "text-slate-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TopNavBar;