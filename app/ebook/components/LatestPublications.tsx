"use client";

import React from "react";
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
    images: ["/bookCovers/i-2-1.png", "/bookCovers/i-2-2.png", "/bookCovers/i-2-3.png"],
    spineColor: "#003652",
  },
  {
    id: 3,
    title: "إعـادة تأهيـل الـمناجم والـمحاجر القديمة",
    category: "التعدين",
    images: ["/latest-cover/b-1.png", "/latest-cover/b-2.png", "/latest-cover/b-3.png"],
    spineColor: "#003652",
  },
];

const LatestPublications = () => {
  return (
    <section className="py-24 bg-[#F8FAFC]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-[#003652] mb-3">
            أحدث الإصدارات
          </h2>

          {/* All categories as subtitle */}
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 tracking-widest">
            {latestBooks.map((book, idx) => (
              <React.Fragment key={book.id}>
                <span style={{ color: "#2369A1" }}>{book.category}</span>
                {idx < latestBooks.length - 1 && (
                  <span className="text-[#C29C41]">—</span>
                )}
              </React.Fragment>
            ))}
          </p>

          {/* Dual-color rule */}
         
        </div>

        {/* Books grid */}
        <div className="flex flex-wrap justify-center gap-24 md:gap-36">
          {latestBooks.map((book) => (
            <div key={book.id} className="flex flex-col items-center">
              <Book
                rtl={true}
                color={book.spineColor}
                className="shadow-2xl"
                cover={
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-sm"
                  />
                }
                backOfCover={
                  <img
                    src={book.images[1]}
                    alt="Internal page"
                    className="w-full h-full object-cover opacity-90"
                  />
                }
                content={
                  <img
                    src={book.images[2]}
                    alt="Content"
                    className="w-full h-full object-cover"
                  />
                }
              />

              {/* Label — title only */}
              <div className="mt-12 text-center">
                <h3 className="text-sm text-nowrap text-[#003652] font-semibold">
                  {book.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestPublications;