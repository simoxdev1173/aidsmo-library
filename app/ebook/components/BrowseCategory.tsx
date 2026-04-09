import React from 'react';
import { Factory, Scale, HardHat, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
const sectors = [
  {
    title: 'الصناعة',
    subtitle: 'Industry',
    icon: <Factory className="w-6 h-6 text-[#0369a1]" />,
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
    subtitle: 'Standardization',
    icon: <Scale className="w-6 h-6 text-[#C29C41]" />,
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
    subtitle: 'Mining',
    icon: <HardHat className="w-6 h-6 text-[#0369a1]" />,
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
    <section className="py-16 px-4 bg-[#F8FAFC]" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="mb-12 pr-6">
          <h2 className="text-3xl font-bold text-[#003652]">تصفح حسب القطاعات</h2>
          
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((sector, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg overflow-hidden"
              style={{ '--accent': sector.accent } as React.CSSProperties}
            >
              {/* Top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                style={{ backgroundColor: sector.accent }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top right, ${sector.accent}18 0%, transparent 70%)`,
                }}
              />

              {/* Sector Header */}
              <div className="relative flex items-center gap-4 mb-6">
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${sector.accent}15` }}
                >
                  {sector.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003652]">{sector.title}</h3>
               
                </div>
              </div>

              {/* Subjects List */}
              <ul className="relative space-y-1">
                {sector.subjects.map((subject, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subject.link}
                      className="group/link flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 text-slate-600 transition-colors duration-200 hover:text-[var(--accent)]"
                    >
                      <span className="text-sm font-medium">{subject.name}</span>
                      <ChevronLeft
                        className="w-4 h-4 text-[var(--accent)] opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 flex-shrink-0"
                      />
                    </Link>
                  </li>
                ))}
              </ul> 

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseBySubject;