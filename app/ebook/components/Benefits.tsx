import Link from 'next/link'
import {
  LuClapperboard,
  LuLayers,
  LuMoveRight,
  LuShield,
  
} from 'react-icons/lu'

import ebook1 from '@/images/landing/ebook/img-1.jpg'
import Image from 'next/image'

const Benefits = () => {
  return (
    <section id="benefits" className="py-10 lg:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Benefits
          </span>
          <h2 className="my-5 text-4xl font-medium text-default-950 md:text-4xl/tight">
            Discover your Benefits
          </h2>
          <p className="mb-10 text-base font-medium">
            Plus, enjoy the convenience of offline access to our ebooks,
            allowing you to read at your convenience, anytime, and anywhere.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <div>
              <div className="group rounded-xl bg-white p-6 drop-shadow-md dark:bg-default-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <LuClapperboard className="size-7 text-primary" />
                </div>
                <h2 className="mt-5 text-2xl font-medium text-default-950">
                  Cost-Effective Option
                </h2>
                <p className="mt-3  text-base">
                  Ebooks typically come at a lower price point compared to
                  printed books, making them accessible to a broader audience of
                  readers.
                </p>
                <div className="mt-5">
                  <Link
                    href=""
                    className="text-lg font-medium text-default-900"
                  >
                    Read More
                    <LuMoveRight className="inline-block h-6 w-6 opacity-0 transition-all duration-500 will-change-transform group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="group rounded-xl bg-white p-6 drop-shadow-md dark:bg-default-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <LuShield className="size-7 text-primary" />
                </div>
                <h2 className="mt-5 text-2xl font-medium text-default-950">
                  Eco-Conscious Choice
                </h2>
                <p className="mt-3 text-base">
                  Ebooks are environmentally friendly as they are digital,
                  eliminating the need for paper, ink, and sustainable option
                  compared to print books.
                </p>
                <div className="mt-5">
                  <Link
                    href=""
                    className="text-lg font-medium text-default-900"
                  >
                    Read More
                    <LuMoveRight className="inline-block h-6 w-6 opacity-0 transition-all duration-500 will-change-transform group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white drop-shadow-md">
            <Image
              alt="ebook1"
              src={ebook1}
              className="h-full w-full rounded-xl"
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="group rounded-xl bg-white p-6 drop-shadow-md dark:bg-default-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <LuLayers className="size-7 text-primary" />
                </div>
                <h2 className="mt-5 text-2xl font-medium text-default-950">
                  Enhanced Visibility
                </h2>
                <p className="mt-3  text-base">
                  Ebooks can be effortlessly searched and shared across the
                  internet, readers and enabling readers to discover new books
                  more readily.
                </p>
                <div className="mt-5">
                  <Link
                    href=""
                    className="text-lg font-medium text-default-900"
                  >
                    Read More
                    <LuMoveRight className="inline-block h-6 w-6 opacity-0 transition-all duration-500 will-change-transform group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="group rounded-xl bg-white p-6 drop-shadow-md dark:bg-default-50">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                </div>
                <h2 className="mt-5 text-2xl font-medium text-default-950">
                  Enhanced Convenience
                </h2>
                <p className="mt-3  text-base">
                  Ebooks have the capacity to incorporate interactive features
                  like videos, audio, and elevating the overall reading
                  experience.
                </p>
                <div className="mt-5">
                  <Link
                    href=""
                    className="text-lg font-medium text-default-900"
                  >
                    Read More
                    <LuMoveRight className="inline-block h-6 w-6 opacity-0 transition-all duration-500 will-change-transform group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href=""
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary/90 px-8 py-3 text-base text-white transition-all duration-500 hover:bg-primary"
          >
            Read More
            <LuMoveRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Benefits
