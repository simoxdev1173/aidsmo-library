import ebook5 from '@/images/landing/ebook/img-5.jpg'
import { allCourse } from '../data'
import CourseCard from './CourseCard'
import Image from 'next/image'

const Courses = () => {
  return (
    <section id="courses" className="bg-default-100 py-10 lg:py-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Image
              alt="ebook5"
              src={ebook5}
              className="h-full w-full rounded-xl shadow-md"
            />
          </div>
          <div className="order-1 lg:order-2 lg:col-span-3">
            <h2 className="text-4xl font-medium text-default-950">
              Our Featured Courses
            </h2>
            <p className="font-me mt-4 text-base">
              Lorem ipsum dolor sit amet, consectetur, adipiscing elit.
              pellentesque quils arcu nisl. pellentesque quis arcu nisl.
              pellentesque ac tortor et est dignissim vulputate. proin quis
              sagittis est. phasellus dignissim dui et ipsum elementum, et
              auctor risus posuere.
            </p>
            {allCourse.map((course, idx) => (
              <CourseCard course={course} key={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Courses
