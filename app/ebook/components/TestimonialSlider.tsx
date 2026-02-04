'use client'
import Image from 'next/image'
import ebook18 from '@/images/landing/ebook/img-18.png'
import { LuChevronLeft, LuChevronRight, LuStar } from 'react-icons/lu'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules'

import { testimonialSlides } from '../data'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const TestimonialSlider = () => {
  return (
    <section id="testimonials" className="py-10 lg:py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Testimonials
            </span>
            <h2 className="my-4 text-4xl font-medium text-default-950">
              Success Stories
            </h2>
            <p className="text-base font-medium">
              Uncover a realm of opportunities within our extensive ebook
              collection.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="h-full w-full">
                <Image
                  alt="ebook18"
                  src={ebook18}
                  className="h-full max-w-full rounded-xl"
                />
              </div>
            </div>
            <div className="relative col-span-3">
              <Swiper
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                loop
                navigation={{
                  prevEl: '.testimonials-button-prev',
                  nextEl: '.testimonials-button-next',
                }}
                pagination={{
                  clickable: true,
                  el: '.swiper-pagination',
                }}
                className="testimonials relative rounded-md"
              >
                {testimonialSlides.map((slide, idx) => {
                  return (
                    <SwiperSlide key={idx} className="swiper-slide">
                      <div className="pt-3">
                        <div className="flex items-center gap-6">
                          <div>
                            <Image
                              alt="slide-Image"
                              height={56}
                              width={56}
                              src={slide.image}
                              className="h-14 rounded-full"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-medium text-default-950">
                              {slide.name}
                            </h3>
                            <p className="mt-2  text-base">{slide.position}</p>
                          </div>
                        </div>
                        <p className="mt-5  text-base">
                          &quot;{slide.description}&quot;
                        </p>
                        <div className="mt-5 flex items-center gap-2">
                          {Array.from(new Array(5)).map((_val, idx) => {
                            return (
                              <LuStar
                                key={idx}
                                className="h-5 w-5 fill-yellow-400 stroke-yellow-400"
                              />
                            )
                          })}
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
              <div className="hidden lg:block">
                <div className="absolute bottom-0 start-0 z-10">
                  <div className="relative flex items-center justify-end gap-5 pe-10">
                    <div className="testimonials-button-prev">
                      <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-default-300 bg-default-50/90 hover:bg-default-50">
                        <LuChevronLeft className="h-6 w-6 stroke-default-950" />
                      </div>
                    </div>
                    <div className="testimonials-button-next">
                      <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-default-300 bg-default-50/90 hover:bg-default-50">
                        <LuChevronRight className="h-6 w-6 stroke-default-950" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
