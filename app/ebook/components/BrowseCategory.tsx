import React from 'react';
import { Factory, Scale, HardHat, ChevronLeft } from 'lucide-react'; // Icons for visual cues

const sectors = [
  {
    title: 'الصناعة',
    subtitle: 'Industry',
    icon: <Factory className="w-6 h-6 text-[#0369a1]" />,
    subjects: [
      { name: '  الدراسات', link: '#' },
      { name: 'التقارير الوطنية', link: '#' },
      { name: 'الأوراق والأبحاث الفنية', link: '#' },
      { name: 'المواد العلمية', link: '#' },
      { name: 'المجلات', link: '#' },
    {name : 'القوانين التعدينية' , link : '#'}
    ],
  },

  {
    title: 'التقييس',
    subtitle: 'Standardization',
    icon: <Scale className="w-6 h-6 text-[#0369a1]" />,
    subjects: [
      { name: '  الدراسات', link: '#' },
      { name: 'التقارير الوطنية', link: '#' },
      { name: 'الأوراق والأبحاث الفنية', link: '#' },
      { name: 'المواد العلمية', link: '#' },
      { name: 'المجلات', link: '#' },
    {name : 'القوانين التعدينية' , link : '#'}
    ],
  },
  {
    title: 'التعدين',
    subtitle: 'Mining',
    icon: <HardHat className="w-6 h-6 text-[#0369a1]" />,
       subjects: [
      { name: '  الدراسات', link: '#' },
      { name: 'التقارير الوطنية', link: '#' },
      { name: 'الأوراق والأبحاث الفنية', link: '#' },
      { name: 'المواد العلمية', link: '#' },
      { name: 'المجلات', link: '#' },
    {name : 'القوانين التعدينية' , link : '#'}
    ],
  },
];

const BrowseBySubject = () => {
  return (
    <section className=" py-16 px-4 font-arabic" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12  pr-6">
          <h2 className="text-3xl font-bold text-[#003652]">تصفح حسب القطاعات</h2>
          {/* <p className="text-gray-600 mt-2">استكشف المصادر الرقمية والبحوث المتخصصة في مجالات عمل المنظمة</p> */}
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((sector, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md group"
            >
              {/* Sector Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-xl   transition-colors">
                  {sector.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#003652]">{sector.title}</h3>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">{sector.subtitle}</span>
                </div>
              </div>

              {/* Sub-sectors List */}
              <ul className="space-y-3">
                {sector.subjects.map((subject, subIndex) => (
                  <li key={subIndex}>
                    <a 
                      href={subject.link}
                      className="flex items-center justify-between group/link text-gray-700 hover:text-[#0369a1] transition-colors py-1 border-b border-transparent hover:border-blue-100"
                    >
                      <span className="text-md font-medium">{subject.name}</span>
                      <ChevronLeft className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* View All Button
              <button className="mt-8 text-sm font-bold text-[#0369a1] flex items-center gap-2 hover:underline">
               استكشاف كافة الموارد..
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseBySubject;