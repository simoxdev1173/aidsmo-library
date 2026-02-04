import { LuDot, LuMoveRight } from 'react-icons/lu'
import Link from 'next/link'

import ebook15 from '@/images/landing/ebook/img-15.jpg'
import Image from 'next/image'

const About = () => {
  return (
    <section id="about" className="py-10 lg:py-20">
      <div className="container">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <Image
              alt="ebook15"
              height={500}
              width={375}
              src={ebook15}
              className="mx-auto h-[500px] rounded-xl"
            />
          </div>
          <div>
            <span className="rounded-md border border-primary bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              our About
            </span>
            <h2 className="mt-5 text-4xl font-medium text-default-950">
              About the Alchemist
            </h2>
            <p className="mt-4 text-base font-medium">
              Lorem ipsum is simply Dummy text of the Printing and typesetting
              industry. lorem is simply dummy text
            </p>
            <ul role="list" className="my-6 space-y-2">
              <li className="flex items-center gap-2">
                <LuDot className="inline-block h-10 w-10 text-primary" />
                <p className="text-base">
                  Lorem ipsum is smiply dummy text of the printing.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <LuDot className="inline-block h-10 w-10 text-primary" />
                <p className="text-base">
                  Lorem ipsum is smiply dummy text of the printing and lorem{' '}
                  <br /> Donec posuere vulputate.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <LuDot className="inline-block h-10 w-10 text-primary" />
                <p className="text-base">
                  Aenean at bibendum enim. In auctor consectetur urna.
                </p>
              </li>
              <li className="flex items-center gap-2">
                <LuDot className="inline-block h-10 w-10 text-primary" />
                <p className="text-base">
                  Lorem ipsum is smiply dummy text of the printing.
                </p>
              </li>
            </ul>
            <Link
              href=""
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary/90 px-8 py-3 text-base text-white transition-all duration-700 hover:bg-primary"
            >
              Read More
              <LuMoveRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
