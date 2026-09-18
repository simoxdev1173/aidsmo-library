"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Book } from "./subComponents/Book";
import { useAppLocale } from "@/lib/i18n/LocaleProvider";

const latestBooksData = [
  {
    id: 1,
    titleKey: "book1Title",
    categoryKey: "book1Category",
    images: ["/industry-covers/b-3.jpg", "/industry-covers/b-3-1.jpg", "/industry-covers/b-3-2.jpg"],
    spineColor: "#0369a1",
  },
  {
    id: 2,
    titleKey: "book2Title",
    categoryKey: "book2Category",
    images: ["/latest-cover/b-4.png", "/bookCovers/i-2-2.png", "/bookCovers/i-2-3.png"],
    spineColor: "#003652",
  },
  {
    id: 3,
    titleKey: "book3Title",
    categoryKey: "book3Category",
    images: ["/latest-cover/b-1.png", "/latest-cover/b-2.png", "/latest-cover/b-3.png"],
    spineColor: "#003652",
  },
] as const;

const LatestPublications = () => {
  const t = useTranslations("latestPublications");
  const { locale } = useAppLocale();
  const latestBooks = latestBooksData.map((book) => ({
    ...book,
    title: t(book.titleKey),
    category: t(book.categoryKey),
  }));

  return (
    <section className="relative overflow-hidden bg-[#F8F6ED] py-12 sm:py-14 lg:py-16" dir={locale === 'ar' ? 'rtl' : 'ltr'}>



      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-11">
          <h2 className="academic-heading mt-3 text-balance text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {t('heading')}
          </h2>

          <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold tracking-wide text-[#64748B]">
            {latestBooks.map((book, idx) => (
              <React.Fragment key={book.id}>
                <span className="text-[#C29C41]">{book.category}</span>
                {idx < latestBooks.length - 1 && <span className="text-[#C29C41]/50">-</span>}
              </React.Fragment>
            ))}
          </p>

         
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 sm:gap-x-14 lg:gap-x-20">
          {latestBooks.map((book ,bID) => (
            <div key={book.id} className="group flex flex-col items-center">
              <div className="relative">
                <span className="wax-seal absolute -right-5 -top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-[#0A2540]" aria-hidden>
                  {bID > 0 ? 2026 : "2025"}
                </span>
                <Book
                  rtl={true}
                  color={book.spineColor}
                  className="shadow-2xl transition duration-500 group-hover:shadow-[0_24px_52px_rgba(10,37,64,0.18)]"
                  cover={
                    <Image
                      src={book.images[0]}
                      alt={book.title}
                      width={320}
                      height={480}
                      className="h-full w-full rounded-sm object-cover"
                    />
                  }
                  backOfCover={
                    <Image
                      src={book.images[1]}
                      alt={`${t('innerPageAlt')} ${book.title}`}
                      width={320}
                      height={480}
                      className="h-full w-full object-cover opacity-90"
                    />
                  }
                  content={
                    <Image
                      src={book.images[2]}
                      alt={`${t('contentAlt')} ${book.title}`}
                      width={320}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  }
                />
              </div>

              <div className="mt-6 max-w-[230px] text-center">
                <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C29C41]">
                  {book.category}
                </p>
                <h3 className="mt-2 min-h-[3.2rem] text-lg font-bold leading-relaxed text-[#003652]">{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPublications;
