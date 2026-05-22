import React from 'react';
import { Factory, Scale, HardHat, ChevronLeft, Sparkle } from 'lucide-react';
import Link from 'next/link';

const sectors = [
  {
    title: 'الصناعة',
    icon: Factory,
    accent: '#0369A1',
    subjects: [
      { name: 'اللجنة الاستشارية للتنمية الصناعية', link: '#' },
      { name: 'إستراتيجية التكامل الصناعي', link: '#' },
      { name: 'لجنة تنسيق مراكز البحوث الصناعية', link: '#' },
      { name: 'الصناعات الصغيرة والمتوسطة', link: '#' },
      { name: 'فعاليات وأنشطة', link: '#' },
      { name: 'الدراسات والأدلة', link: '#' },
    ],
  },
  {
    title: 'التقييس',
    icon: Scale,
    accent: '#C29C41',
    subjects: [
      { name: 'الدراسات', link: '#' },
      { name: 'التقارير الوطنية', link: '#' },
      { name: 'الأوراق والأبحاث الفنية', link: '#' },
      { name: 'المواد العلمية', link: '#' },
      { name: 'المجلات', link: '#' },
    ],
  },
  {
    title: 'التعدين',
    icon: HardHat,
    accent: '#0369A1',
    subjects: [
      { name: 'الدراسات', link: '#' },
      { name: 'التقارير الوطنية', link: '#' },
      { name: 'الأوراق والأبحاث الفنية', link: '#' },
      { name: 'المواد العلمية', link: '#' },
      { name: 'المجلات', link: '#' },
      { name: 'القوانين التعدينية', link: '#' },
    ],
  },
];

const BrowseBySubject = () => {
  return (
    <section className="bg-[#F8FAFC] px-4 py-20 md:py-28" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-5xl">تصفح حسب القطاعات</h2>
          <p className="mt-5 max-w-2xl font-academic text-xl leading-relaxed text-[#475569]">
            أبواب معرفية منظمة للباحثين والمهتمين، تقودك مباشرة إلى الإصدارات والدراسات حسب مجال العمل.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <article
                key={sector.title}
                className="group corner-card academic-card overflow-hidden p-7"
                style={{ '--accent': sector.accent } as React.CSSProperties}
              >
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="academic-heading mt-2 text-3xl">{sector.title}</h3>
                    <div className="mt-3 w-24 [--divider-bg:#F8FAFC]">
                      <div className="ornate-divider" aria-hidden />
                    </div>
                  </div>

                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C29C41]/35 bg-white text-[#C29C41]">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                    <Sparkle className="absolute -left-1 -top-1 h-4 w-4 fill-[#C29C41] text-[#C29C41]" />
                  </div>
                </div>

                <ul className="space-y-1">
                  {sector.subjects.map((subject) => (
                    <li key={subject.name}>
                      <Link
                        href={subject.link}
                        className="group/link flex min-h-12 items-center justify-between border-b border-[#0369A1]/10 py-3 text-sm font-medium text-[#334155] transition duration-300 last:border-0 hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[#C29C41] focus:ring-offset-2 focus:ring-offset-[#F8FAFC]"
                      >
                        <span>{subject.name}</span>
                        <ChevronLeft className="h-4 w-4 shrink-0 text-[var(--accent)] opacity-60 transition duration-300 group-hover/link:-translate-x-1 group-hover/link:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseBySubject;
