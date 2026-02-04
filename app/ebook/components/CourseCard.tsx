import Link from 'next/link'
import { CourseType } from '../types'
import Image from 'next/image'

const CourseCard = ({ course }: { course: CourseType }) => {
  const { courseName, date, icons, image, name } = course
  return (
    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-md dark:bg-default-50">
      <div className="grid sm:grid-cols-5">
        <div>
          <Image alt="course-image" src={image} className="h-full w-full" />
        </div>
        <div className="group p-6 sm:col-span-4">
          <h3 className="cursor-pointer text-2xl font-medium text-default-950 transition-all hover:text-primary">
            {courseName}
          </h3>
          <p className="mt-3 text-base text-default-950">{name}</p>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-base text-default-950">{date}</p>
            <div className="flex items-center gap-4">
              {icons.map((icon, idx) => {
                const Icon = icon
                return (
                  <Link href="" key={idx}>
                    <Icon className="h-5 w-5 transition-all hover:text-primary" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
