"use client";

import React from "react";
import Image from "next/image";
import { Book } from "./subComponents/Book"; // Assuming Book.tsx is in the same directory

const latestBooks = [
  {
    id: 1,
    title: "إعـادة تأهيـل الـمناجم والـمحاجر القديمة   ",
    category: "التعدين",
    images : ["/latest-cover/b-1.png" , "/latest-cover/b-2.png" ,"/latest-cover/b-3.png"],
    spineColor: "#003652",
    coverOverlay: "bg-[#003652]/80",
  },
  {
    id: 2,
    title: 'التنمية الصناعية العربية',
    category: "الصناعة",
    images : ["/industry-covers/b-3.jpg" , "/industry-covers/b-3-1.jpg" ,"/industry-covers/b-3-2.jpg"],
    spineColor: "#0369a1",
    coverOverlay: "bg-[#0369a1]/80",
  },
  {
    id: 3,
    title: 'التنمية الصناعية العربية',
    category: "الصناعة",
    images : ["/bookCovers/i-2-1.png" , "/bookCovers/i-2-2.png" ,"/bookCovers/i-2-3.png"],
    spineColor: "#003652",
    coverOverlay: "bg-[#003652]/80",
  },
];

const LatestPublications = () => {
  return (
    <section className="py-24 bg-white font-arabic" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-[#003652] mb-4">
            أحدث الإصدارات
          </h2>
        
        </div>

        {/* Books Grid */}
        <div className="flex justify-center gap-36 md:gap-54">
          {latestBooks.map((book) => (
            <div key={book.id} className="flex flex-col items-center">
                <Book
                            color={book.spineColor}
                            // We pass a slightly smaller scale or ensure the component itself has margin
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

              {/* Book Labels below the 3D element */}
              <div className="mt-12 text-center">
                <span className="text-xs font-bold text-[#0369a1] uppercase tracking-widest">
                  {book.category}
                </span>
                <h3 className="text-md text-right text-nowrap text-[#003652] mt-1 group-hover:text-[#0369a1] transition-colors">
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