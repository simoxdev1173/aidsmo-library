'use client';

import { useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

export type EntrySection = {
  title: string;
  body: string;
};

const emptySection: EntrySection = { title: '', body: '' };

export default function SectionFields({ initialSections = [] }: { initialSections?: EntrySection[] }) {
  const [sections, setSections] = useState<EntrySection[]>(
    initialSections.length > 0 ? initialSections : [emptySection],
  );

  const updateSection = (index: number, key: keyof EntrySection, value: string) => {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [key]: value } : section,
      ),
    );
  };

  const removeSection = (index: number) => {
    setSections((current) => (current.length === 1 ? [emptySection] : current.filter((_, sectionIndex) => sectionIndex !== index)));
  };

  return (
    <section className="rounded-lg border border-[#D9E3EE] bg-[#F8FAFC] p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#003652]">أقسام المحتوى</h3>
          <p className="mt-1 text-sm leading-6 text-[#64748B]">
            استخدمها للصفحات أو للإصدارات التي تحتاج فقرات منظمة بعناوين فرعية.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSections((current) => [...current, emptySection])}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0369A1] bg-white px-4 text-sm font-bold text-[#0369A1] transition duration-200 hover:bg-[#0369A1] hover:text-white"
        >
          <HiOutlinePlus className="h-5 w-5" />
          إضافة قسم
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="rounded-md border border-[#CBD5E1] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[#C29C41]">قسم {index + 1}</p>
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-700 transition duration-200 hover:bg-red-100"
                aria-label="حذف القسم"
              >
                <HiOutlineTrash className="h-5 w-5" />
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#334155]">العنوان الفرعي</span>
              <input
                name="sectionTitle"
                value={section.title}
                onChange={(event) => updateSection(index, 'title', event.target.value)}
                className="h-11 w-full rounded-md border border-[#CBD5E1] bg-white px-3 text-sm text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
              />
            </label>

            <label className="mt-3 block">
              <span className="mb-2 block text-sm font-bold text-[#334155]">النص</span>
              <textarea
                name="sectionBody"
                value={section.body}
                onChange={(event) => updateSection(index, 'body', event.target.value)}
                rows={4}
                className="w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-3 text-sm leading-7 text-[#0A2540] outline-none transition duration-200 focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
              />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
