"use client";

import React from "react";
import Image from "next/image";
import { Book } from "./subComponents/Book";

const latestBooks = [
  {
    id: 1,
    title: "التنمية الصناعية العربية",
    category: "الصناعة",
    images: ["/industry-covers/b-3.jpg", "/industry-covers/b-3-1.jpg", "/industry-covers/b-3-2.jpg"],
    spineColor: "#0369a1",
  },
  {
    id: 2,
    title: "التنمية الصناعية العربية",
    category: "التقييس",
    images: ["/latest-cover/b-4.png", "/bookCovers/i-2-2.png", "/bookCovers/i-2-3.png"],
    spineColor: "#003652",
  },
  {
    id: 3,
    title: "إعادة تأهيل المناجم والمحاجر القديمة",
    category: "التعدين",
    images: ["/latest-cover/b-1.png", "/latest-cover/b-2.png", "/latest-cover/b-3.png"],
    spineColor: "#003652",
  },
];

const LatestPublications = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8F6ED] py-20 md:py-28" dir="rtl">
   
    


      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="academic-heading mt-4 text-4xl leading-tight md:text-5xl">
            أحدث الإصدارات
          </h2>

          <p className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold tracking-wide text-[#64748B]">
            {latestBooks.map((book, idx) => (
              <React.Fragment key={book.id}>
                <span className="text-[#C29C41]">{book.category}</span>
                {idx < latestBooks.length - 1 && <span className="text-[#C29C41]/50">-</span>}
              </React.Fragment>
            ))}
          </p>

         
        </div>

        <div className="flex flex-wrap justify-center gap-20 md:gap-28">
          {latestBooks.map((book ,bID) => (
            <div key={book.id} className="group flex flex-col items-center">
              <div className="relative">
                <span className="wax-seal absolute -right-7 -top-7 z-10 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-[#0A2540]" aria-hidden>
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
                      alt={`صفحة داخلية من ${book.title}`}
                      width={320}
                      height={480}
                      className="h-full w-full object-cover opacity-90"
                    />
                  }
                  content={
                    <Image
                      src={book.images[2]}
                      alt={`محتوى ${book.title}`}
                      width={320}
                      height={480}
                      className="h-full w-full object-cover"
                    />
                  }
                />
              </div>

              <div className="mt-8 max-w-[260px] text-center">
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
